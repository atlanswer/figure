/* @refresh granular */

import {
  createContext,
  createSignal,
  useContext,
  type Accessor,
  type ParentComponent,
} from "solid-js";

const DrawPerfProviderContext =
  createContext<[Accessor<number>, (newTime: number) => void]>();

export function useDrawPerf() {
  const context = useContext(DrawPerfProviderContext);
  if (!context) {
    throw new Error("useDrawPerf: `DrawPerfContext` not found");
  }
  return context;
}

export const DrawPerfProvider: ParentComponent = (props) => {
  const [avgTime, setAvgTime] = createSignal<number>(0);
  const [count, setCount] = createSignal<number>(0);

  function updateAvgTime(newTime: number) {
    setCount((prevCount) => prevCount + 1);
    setAvgTime((prevAvg) => prevAvg + (newTime - prevAvg) / count());
  }

  return (
    <DrawPerfProviderContext.Provider value={[avgTime, updateAvgTime]}>
      {props.children}
    </DrawPerfProviderContext.Provider>
  );
};
