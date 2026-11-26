"use client";

import { useState } from "react";
import { ReadingPractice } from "./ReadingPractice";
import { ReadingReport } from "./ReadingReport";

export function ReadingWorkspace() {
  const [latestAccuracy, setLatestAccuracy] = useState<number | null>(null);

  return (
    <>
      <ReadingPractice onComplete={setLatestAccuracy} />
      <ReadingReport latestAccuracy={latestAccuracy} />
    </>
  );
}
