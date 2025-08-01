import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../../../navigation/types";
import { PATHS } from "../../../constants/paths";
import { createModuleSystem } from "../../../utils/createModuleSystem.js";
import ProgramErrorDisplay from "../components/ProgramErrorDisplay";
import SafeAppWrapper from "../components/SafeAppWrapper";
import GPTChatModal from "../components/GPTChatModal";
import LoadingModal from "../../../modals/LoadingModal";
import { GptUtils } from "../../../utils/gptUtils";
import { Utils } from "../../../utils/Utils";
import { GPTMessage } from "../../../utils/types";
import { SYSTEM_PROMPT } from "../../../utils/SystemPrompt";

type ProgramScreenRouteProp = RouteProp<RootStackParamList, "Program">;

const ProgramScreen: React.FC = () => {
  const route = useRoute<ProgramScreenRouteProp>();
  const navigation = useNavigation();
  const { programId } = route.params;

  const [MiniApp, setMiniApp] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [directoryTree, setDirectoryTree] = useState<any[]>([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backupFiles, setBackupFiles] = useState<any>(null);
  const [miniAppCode, setMiniAppCode] = useState<string | null>(null);
  const [allFileContents, setAllFileContents] = useState<{[key: string]: string}>({});

  useEffect(() => {
    navigation.setOptions({
      title: programId.replace(/_/g, " "),
      headerRight: () => (
        <View style={styles.headerButtons}>
          {backupFiles && (
            <TouchableOpacity
              style={[styles.headerButton, styles.undoButton]}
              onPress={handleUndo}
            >
              <Text style={styles.headerButtonText}>↶</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowChatModal(true)}
          >
            <Text style={styles.headerButtonText}>✏️</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, programId, backupFiles]);

  // const loadProgram = async () => {
  //   try {
  //     const tree = await Utils.buildDirectoryTree(
  //       PATHS.PROGRAMS + programId + "/",
  //       ""
  //     );
  //     setDirectoryTree(tree);

  //     const fileContents = await Utils.getProgramFileContents(
  //       PATHS.PROGRAMS,
  //       programId
  //     );

  //     const moduleSystem = createModuleSystem(fileContents);
  //     const AppComponent = moduleSystem.require("index.js").default;

  //     setMiniApp(() => AppComponent);
  //     setError(null);
  //   } catch (e) {
  //     console.error(e);
  //     setError(e instanceof Error ? e.message : String(e));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const loadProgram = async () => {
    try {
      setRenderError(null); // Clear render errors
      const tree = await Utils.buildDirectoryTree(
        PATHS.PROGRAMS + programId + "/",
        ""
      );
      setDirectoryTree(tree);

      const fileContents = await Utils.getProgramFileContents(
        PATHS.PROGRAMS,
        programId
      );

      // Store all files content for error display
      setAllFileContents(fileContents);
      
      // Store the index.js code for debugging
      setMiniAppCode(fileContents['index.js'] || 'index.js not found');

      // ✅ Fix: createModuleSystem returns the require function directly
      const requireFunc = createModuleSystem(fileContents);

      // ✅ Fix: Call requireFunc directly, not moduleSystem.require
      const AppComponent = requireFunc("index.js");

      setMiniApp(() => AppComponent);
      setError(null);
    } catch (e) {
      console.error("Error loading program:", e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = async () => {
    if (!backupFiles) return;
    
    try {
      setIsLoading(true);
      await Utils.updateProgram(PATHS.PROGRAMS, programId, backupFiles);
      setBackupFiles(null);
      setMiniApp(null);
      await loadProgram();
    } catch (error) {
      console.error("Error during undo:", error);
      setError(error instanceof Error ? error.message : String(error));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProgram();
  }, [programId]);

  const handleSendPrompt = async (prompt: string) => {
    try {
      setIsLoading(true);
      setShowChatModal(false);

      // Backup current files before making changes
      const currentFiles = await Utils.readFolderAsFiles(
        `${PATHS.PROGRAMS}${programId}/`
      );
      setBackupFiles(currentFiles);

      const messages: GPTMessage[] = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ];

      const files = await Utils.readFolderAsFiles(
        `${PATHS.PROGRAMS}${programId}/`
      );

      const res = await GptUtils.create_gpt_code_change(files, messages);
      await Utils.updateProgram(PATHS.PROGRAMS, programId, res.files);

      setMiniApp(null);
      await loadProgram();
    } catch (error) {
      console.error("Error in handleSendPrompt:", error);
      setError(error instanceof Error ? error.message : String(error));
      setIsLoading(false);
    }
  };

  const handleRenderError = (error: Error, errorInfo: any) => {
    console.error("Render error caught by SafeAppWrapper:", error, errorInfo);
    // You could log this to an analytics service here
  };

  if (error) {
    // Convert fileContents object to array of {path, content} objects
    const jsFilesContent = Object.entries(allFileContents).map(([path, content]) => ({
      path,
      content
    }));

    return (
      <ProgramErrorDisplay
        error={error}
        programId={programId}
        directoryTree={directoryTree}
        jsFilesContent={jsFilesContent}
        stacktrace={error.includes('SyntaxError') ? error : undefined}
      />
    );
  }

  if (!MiniApp) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading program...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAppWrapper onError={handleRenderError} miniAppCode={miniAppCode || undefined}>
        <MiniApp />
      </SafeAppWrapper>
      <GPTChatModal
        visible={showChatModal}
        onClose={() => setShowChatModal(false)}
        programId={programId}
        onSendPrompt={handleSendPrompt}
      />
      <LoadingModal visible={isLoading} message="Generating code with AI..." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  undoButton: {
    backgroundColor: "#ff6b6b",
    borderRadius: 16,
  },
  headerButtonText: {
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
});

export default ProgramScreen;
