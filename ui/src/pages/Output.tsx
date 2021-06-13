import React, { ReactElement } from "react";
import { useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import useIpc from "../state/useIpc";

export default function OutputPage(): ReactElement {
  const [output] = useIpc<number[]>("output", new Array(512).fill(0));

  const roundedOutput = useMemo(
    () => output.map((i) => Math.round(i)),
    [output]
  );

  return <MainLayout>{roundedOutput.join(" - ")}</MainLayout>;
}
