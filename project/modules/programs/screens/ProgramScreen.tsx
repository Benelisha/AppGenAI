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
import { createModuleSystem } from "../../../utils/createModuleSystem";
import ProgramErrorDisplay from "../components/ProgramErrorDisplay";
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
  const [directoryTree, setDirectoryTree] = useState<any[]>([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: programId.replace(/_/g, " "),
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerEditButton}
          onPress={() => setShowChatModal(true)}
        >
          <Text style={styles.headerEditButtonText}>✏️</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, programId]);

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
      const tree = await Utils.buildDirectoryTree(
        PATHS.PROGRAMS + programId + "/",
        ""
      );
      setDirectoryTree(tree);

      const fileContents = await Utils.getProgramFileContents(
        PATHS.PROGRAMS,
        programId
      );

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

  useEffect(() => {
    loadProgram();
  }, [programId]);

  const handleSendPrompt = async (prompt: string) => {
    try {
      setIsLoading(true);
      setShowChatModal(false);

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

  if (error) {
    return (
      <ProgramErrorDisplay
        error={error}
        programId={programId}
        directoryTree={directoryTree}
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
      <MiniApp />
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
  headerEditButton: {
    padding: 8,
    marginRight: 8,
  },
  headerEditButtonText: {
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

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   TouchableOpacity,
// } from "react-native";
// import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
// import type { RootStackParamList } from "../../../navigation/types";
// import { PATHS } from "../../../constants/paths";
// import { createModuleSystem } from "../../../utils/createModuleSystem";
// import ProgramErrorDisplay from "../components/ProgramErrorDisplay";
// import GPTChatModal from "../components/GPTChatModal";
// import LoadingModal from "../../../modals/LoadingModal";
// import { GptUtils } from "../../../utils/gptUtils";
// import { Utils } from "../../../utils/Utils";
// import { GPTMessage } from "../../../utils/types";
// import { SYSTEM_PROMPT } from "../../../utils/SystemPrompt";

// type ProgramScreenRouteProp = RouteProp<RootStackParamList, "Program">;

// // GPT API KEY: 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

// const ProgramScreen: React.FC = () => {
//   const route = useRoute<ProgramScreenRouteProp>();
//   const navigation = useNavigation();
//   const { programId } = route.params; // This is now the folder name
//   const [MiniApp, setMiniApp] = useState<React.ComponentType | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [directoryTree, setDirectoryTree] = useState<any[]>([]);
//   const [showChatModal, setShowChatModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleEditMiniApp = () => {
//     setShowChatModal(true);
//     console.log("Edit MiniApp button pressed - will open GPT chat modal");
//   };

//   const handleCloseChatModal = () => {
//     setShowChatModal(false);
//   };

//   const handleSendPrompt = async (prompt: string) => {
//     try {
//       setIsLoading(true);
//       setShowChatModal(false); // Close chat modal while processing

//       console.log("Prompt received:", prompt);
//       const messages: GPTMessage[] = [
//         {
//           role: "system",
//           content: SYSTEM_PROMPT,
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ];

//       const files = await Utils.readFolderAsFiles(
//         PATHS.PROGRAMS + programId + "/"
//       );

//       const res = await GptUtils.create_gpt_code_change(files, messages);
//       console.log("GPT response:", res);
//       await Utils.updateProgram(PATHS.PROGRAMS, programId, res.files);

//       setMiniApp(null);
//       setError(null);

//       async function loadProgram() {
//         try {
//           // Build directory tree using Utils
//           const tree = await Utils.buildDirectoryTree(
//             PATHS.PROGRAMS + programId + "/",
//             ""
//           );
//           setDirectoryTree(tree);

//           // Get file contents for the module system using Utils
//           const fileContents = await Utils.getProgramFileContents(
//             PATHS.PROGRAMS,
//             programId
//           );

//           const requireFunc = createModuleSystem(fileContents);
//           const AppComponent = requireFunc("index.js"); // Your app entry point

//           setMiniApp(() => AppComponent);
//           setShowChatModal(false);
//         } catch (e) {
//           console.error(e);
//           setError(e instanceof Error ? e.message : String(e));
//         } finally {
//           setIsLoading(false);
//         }
//       }

//       await loadProgram();
//     } catch (error) {
//       console.error("Error in handleSendPrompt:", error);
//       setError(error instanceof Error ? error.message : String(error));
//       setIsLoading(false);
//     }
//   };

//   // Set the header right button
//   useEffect(() => {
//     navigation.setOptions({
//       title: programId.replace(/_/g, " "),
//       headerRight: () => (
//         <TouchableOpacity
//           style={styles.headerEditButton}
//           onPress={handleEditMiniApp}
//         >
//           <Text style={styles.headerEditButtonText}>✏️</Text>
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation, programId]);

//   useEffect(() => {
//     async function loadProgram() {
//       try {
//         // Build directory tree using Utils
//         const tree = await Utils.buildDirectoryTree(
//           PATHS.PROGRAMS + programId + "/",
//           ""
//         );
//         setDirectoryTree(tree);

//         // Get file contents for the module system using Utils
//         const fileContents = await Utils.getProgramFileContents(
//           PATHS.PROGRAMS,
//           programId
//         );

//         const requireFunc = createModuleSystem(fileContents);
//         const AppComponent = requireFunc("index.js"); // Your app entry point

//         setMiniApp(() => AppComponent);
//       } catch (e) {
//         console.error(e);
//         setError(e instanceof Error ? e.message : String(e));
//       }
//     }

//     loadProgram();
//   }, [programId]);

//   if (error) {
//     return (
//       <ProgramErrorDisplay
//         error={error}
//         programId={programId}
//         directoryTree={directoryTree}
//       />
//     );
//   }

//   if (!MiniApp) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text style={styles.loadingText}>Loading program...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <MiniApp />

//       {/* GPT Chat Modal */}
//       <GPTChatModal
//         visible={showChatModal}
//         onClose={handleCloseChatModal}
//         programId={programId}
//         onSendPrompt={handleSendPrompt}
//       />

//       {/* Loading Modal */}
//       <LoadingModal
//         visible={isLoading}
//         message="Generating code with AI..."
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },
//   headerEditButton: {
//     padding: 8,
//     marginRight: 8,
//   },
//   headerEditButtonText: {
//     fontSize: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//   },
//   loadingText: {
//     fontSize: 16,
//     color: "#666",
//     marginTop: 16,
//   },
// });

// export default ProgramScreen;
