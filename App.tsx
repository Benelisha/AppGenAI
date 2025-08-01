import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { RootNavigator } from "./project/navigation/RootNavigator";

import '@react-native-async-storage/async-storage';
import 'react-native-reanimated';



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
