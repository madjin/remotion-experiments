import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";
import { GitHubSummaryData } from "../data/githubSummary";

interface AreasProps {
  areas: GitHubSummaryData["areas"];
}

export const Areas: React.FC<AreasProps> = ({ areas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxAdditions = Math.max(...areas.map(a => a.additions));
  const maxDeletions = Math.max(...areas.map(a => a.deletions));
  const maxScale = Math.max(maxAdditions, maxDeletions);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
      }}
    >
      {areas.map((area, i) => {
        const delay = i * 5;

        const opacity = spring({
          frame: frame - delay,
          fps,
          from: 0,
          to: 1,
          config: { mass: 0.5, damping: 12 },
        });

        const additionsWidth = spring({
          frame: frame - delay,
          fps,
          from: 0,
          to: (area.additions / maxScale) * 100,
          config: { mass: 0.5, damping: 12 },
        });

        const deletionsWidth = spring({
          frame: frame - delay,
          fps,
          from: 0,
          to: (area.deletions / maxScale) * 100,
          config: { mass: 0.5, damping: 12 },
        });

        return (
          <div
            key={i}
            style={{
              opacity,
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
                color: "white",
              }}
            >
              <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {area.name}
              </span>
              <span style={{ color: "#94A3B8" }}>
                {area.files} files
              </span>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div
                style={{
                  flex: 1,
                  height: "24px",
                  backgroundColor: "rgba(35, 134, 54, 0.2)",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${additionsWidth}%`,
                    height: "100%",
                    backgroundColor: "#238636",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <span style={{ color: "#238636", minWidth: "100px" }}>
                +{area.additions}
              </span>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.5rem" }}>
              <div
                style={{
                  flex: 1,
                  height: "24px",
                  backgroundColor: "rgba(248, 81, 73, 0.2)",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${deletionsWidth}%`,
                    height: "100%",
                    backgroundColor: "#F85149",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <span style={{ color: "#F85149", minWidth: "100px" }}>
                -{area.deletions}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}; 