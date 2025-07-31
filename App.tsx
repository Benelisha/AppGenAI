import React from "react";
import ReactNative from "react-native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import { RootNavigator } from "./project/navigation/RootNavigator";

const forceReset = true;

const FILE_NAME = "MiniApp.js";
const FILE_PATH = FileSystem.documentDirectory + FILE_NAME;

const DEFAULT_MINIAPP_CODE = `
  const { useState } = React;
  const { View, Text, Button, Image, TextInput, ScrollView, StyleSheet } = ReactNative;

  function MiniApp() {
    const [count, setCount] = useState(0);
    const [input, setInput] = useState("");

    return (
      React.createElement(ScrollView, {
          contentContainerStyle: styles.container,
          keyboardShouldPersistTaps: "handled",
          keyboardDismissMode: "on-drag",
        },
        React.createElement(Text, { style: styles.title }, "🔥 Welcome to MiniApp!"),
        React.createElement(Image, {
          source: { uri: 'https://reactnative.dev/img/tiny_logo.png' },
          style: styles.image
        }),
        React.createElement(TextInput, {
          style: styles.input,
          value: input,
          onChangeText: setInput,
          placeholder: 'Type something...',
          keyboardType: 'default',
          returnKeyType: 'done',
          blurOnSubmit: true,
        }),
        React.createElement(Text, { style: styles.text }, "You typed: " + input),
        React.createElement(View, { style: styles.buttonContainer },
          React.createElement(Button, {
            title: "Press Me (" + count + ")",
            onPress: () => setCount(count + 1)
          })
        )
      )
    );
  }

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#eef'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20
    },
    image: {
      width: 60,
      height: 60,
      marginBottom: 20
    },
    input: {
      height: 40,
      width: '80%',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10
    },
    text: {
      fontSize: 16,
      marginBottom: 20
    },
    buttonContainer: {
      marginTop: 10,
      width: '60%'
    }
  });

  return MiniApp;
`;


export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <RootNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
