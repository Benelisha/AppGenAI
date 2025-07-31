import * as FileSystem from 'expo-file-system';

export async function loadAllFilesRecursively(path: string): Promise<Record<string, string>> {
  const files: Record<string, string> = {};

  async function walk(dir: string) {
    const items = await FileSystem.readDirectoryAsync(dir);

    for (const item of items) {
      const fullPath = `${dir}/${item}`;
      const fileInfo = await FileSystem.getInfoAsync(fullPath);

      if (fileInfo.isDirectory) {
        await walk(fullPath);
      } else if (item.endsWith(".js")) {
        const code = await FileSystem.readAsStringAsync(fullPath);
        const relativePath = fullPath.replace(`${path}/`, "").replace(/\\/g, "/");
        files[relativePath] = code;
      }
    }
  }

  await walk(path);
  return files;
}
