import * as FileSystem from "expo-file-system";

export const PATHS = {
  BASE: FileSystem.documentDirectory!,
  PROGRAMS: `${FileSystem.documentDirectory}programs/`,
} as const;
