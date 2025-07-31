export function createRequireFromMap(map: Record<string, string>) {
  const moduleCache: Record<string, any> = {};

  function require(path: string) {
    if (moduleCache[path]) return moduleCache[path];
    const code = map[path];
    if (!code) throw new Error("Module not found: " + path);

    const module = { exports: {} };
    const wrappedCode = `(function(require, module, exports) { ${code} \n})`;
    const fn = eval(wrappedCode);
    fn(require, module, module.exports);

    moduleCache[path] = module.exports;
    return module.exports;
  }

  return require;
}
