onmessage = (event) => {
  console.log(`Logging from pyodide: receives "${event.data}"`);
  postMessage(`Message from pyodide: receives "${event.data}"`);
};
