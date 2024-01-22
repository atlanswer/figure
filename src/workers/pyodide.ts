/* @refresh granular */

console.debug("Starting Pyodide web worker...");

const pyodideModule = (await import(
  "/pyodide/pyodide.mjs"
)) as typeof import("/pyodide");

const loadPyodideAndPackages = async () => {
  const pyodide = await pyodideModule.loadPyodide({
    indexURL: "/pyodide/",
  });
  await pyodide.loadPackage(["numpy", "matplotlib"]);
  return pyodide;
};

const pyodide = await loadPyodideAndPackages();
console.debug("Pyodide web worker initialized.");

onmessage = async () => {
  const cmdGetVersion = `import sys;sys.version`;
  await pyodide.loadPackagesFromImports(cmdGetVersion);
  const pythonVersion = (await pyodide.runPythonAsync(cmdGetVersion)) as string;
  postMessage(`Pyodide version: "${pythonVersion}"`);
};

export {};
