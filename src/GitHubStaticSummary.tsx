import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Title } from "./components/Title";
import { Metrics } from "./components/Metrics";
import { Changes } from "./components/Changes";
import { Areas } from "./components/Areas";

interface GitHubStaticSummaryProps {
  title: string;
  metrics: {
    contributors: number;
    merged_prs: number;
    new_issues: number;
    lines_changed: number;
  };
  changes: {
    features: string[];
    fixes: string[];
    chores: string[];
  };
  areas: Array<{
    name: string;
    files: number;
    additions: number;
    deletions: number;
  }>;
}

export const GitHubStaticSummary: React.FC<GitHubStaticSummaryProps> = ({
  title,
  metrics,
  changes,
  areas,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0D1117", // GitHub dark theme
      }}
    >
      <Sequence from={0} durationInFrames={90}>
        <Title title={title} />
      </Sequence>

      <Sequence from={90} durationInFrames={90}>
        <Metrics metrics={metrics} />
      </Sequence>

      <Sequence from={180} durationInFrames={90}>
        <Changes changes={changes} />
      </Sequence>

      <Sequence from={270} durationInFrames={90}>
        <Areas areas={areas} />
      </Sequence>
    </AbsoluteFill>
  );
}; 