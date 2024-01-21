import { loadPyodide } from "@/pyodide";

const loadPyodideAndPackages = async () => {
  const pyodide = await loadPyodide({
    indexURL: "/pyodide/",
  });
  // await pyodide.loadPackage();

  return pyodide;
};

const pyodide = await loadPyodideAndPackages();
console.log("Pyodide web worker initialized.");

onmessage = async () => {
  const cmdGetVersion = `import sys;sys.version`;
  await pyodide.loadPackagesFromImports(cmdGetVersion);
  const pythonVersion = (await pyodide.runPythonAsync(cmdGetVersion)) as string;
  postMessage(`Pyodide version: "${pythonVersion}"`);
};
