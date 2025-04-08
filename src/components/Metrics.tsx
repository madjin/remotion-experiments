import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";
import { GitHubSummaryData } from "../data/githubSummary";

interface MetricsProps {
  metrics: GitHubSummaryData["metrics"];
}

export const Metrics: React.FC<MetricsProps> = ({ metrics }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { label: "Contributors", value: metrics.contributors, icon: "👥" },
    { label: "Merged PRs", value: metrics.merged_prs, icon: "🔄" },
    { label: "New Issues", value: metrics.new_issues, icon: "⚠️" },
    { label: "Lines Changed", value: metrics.lines_changed.toLocaleString(), icon: "📝" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "2rem",
        padding: "2rem",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
      }}
    >
      {items.map((item, i) => {
        const delay = i * 5;

        const scale = spring({
          frame: frame - delay,
          fps,
          from: 0,
          to: 1,
          config: { mass: 0.5, damping: 10 },
        });

        const opacity = spring({
          frame: frame - delay,
          fps,
          from: 0,
          to: 1,
          config: { mass: 0.5, damping: 10 },
        });

        return (
          <div
            key={i}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              padding: "1.5rem",
              transform: `scale(${scale})`,
              opacity,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "2rem" }}>{item.icon}</span>
            <div style={{ fontSize: "3rem", fontWeight: "bold", color: "white" }}>
              {item.value}
            </div>
            <div style={{ fontSize: "1.5rem", color: "#94A3B8" }}>
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}; 