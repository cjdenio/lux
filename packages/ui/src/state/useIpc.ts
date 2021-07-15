import { IpcRendererEvent } from "electron/main";
import { useEffect, useState } from "react";
import ipc from "../lib/ipc";

export default function useIpc<T>(
  handle: string,
  initial: T
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    ipc.invoke(handle).then(setValue);

    const onUpdate = (_e: IpcRendererEvent, value: T) => setValue(value);

    ipc.on(`${handle}-update`, onUpdate);

    return () => {
      ipc.removeListener(`${handle}-update`, onUpdate);
    };
  }, []);

  return [
    value,
    (value) => {
      ipc.send(`${handle}-update`, value);
    },
  ];
}
