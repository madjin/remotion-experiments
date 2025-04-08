import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface FileChange {
  path: string;
  additions: number;
  deletions: number;
  total: number;
}

interface CodeChangesHeatmapProps {
  changes: FileChange[];
  title: string;
}

export const CodeChangesHeatmap: React.FC<CodeChangesHeatmapProps> = ({
  changes,
  title,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Sort changes by total impact (additions + deletions)
  const sortedChanges = [...changes].sort((a, b) => b.total - a.total).slice(0, 8);

  // Animation springs
  const titleOpacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10 },
  });

  const containerProgress = spring({
    frame: frame - 15,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12 },
  });

  // Calculate maximum values for scaling
  const maxTotal = Math.max(...sortedChanges.map(c => c.total));
  const barHeight = 50;
  const barGap = 20;
  const maxBarWidth = width * 0.6;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0D1117",
        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif",
        color: "white",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>{title}</h1>
        <h2 style={{ fontSize: "1.8rem", color: "#58A6FF", marginTop: "0.5rem" }}>
          Code Changes Impact
        </h2>
      </div>

      {/* Changes Container */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: maxBarWidth + 300,
        }}
      >
        {sortedChanges.map((change, index) => {
          const delay = index * 5;
          const barProgress = spring({
            frame: frame - 30 - delay,
            fps,
            from: 0,
            to: 1,
            config: { damping: 15 },
          });

          const labelOpacity = spring({
            frame: frame - 45 - delay,
            fps,
            from: 0,
            to: 1,
            config: { damping: 10 },
          });

          // Calculate widths for additions and deletions
          const additionsWidth = (change.additions / maxTotal) * maxBarWidth * barProgress;
          const deletionsWidth = (change.deletions / maxTotal) * maxBarWidth * barProgress;

          return (
            <div
              key={change.path}
              style={{
                marginBottom: barGap,
                opacity: containerProgress,
              }}
            >
              {/* File path and stats */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 5,
                  opacity: labelOpacity,
                }}
              >
                <span style={{ fontSize: "1rem" }}>
                  {change.path}
                </span>
                <span style={{ fontSize: "0.9rem", color: "#8B949E" }}>
                  <span style={{ color: "#2EA043" }}>+{change.additions}</span>
                  {" / "}
                  <span style={{ color: "#F85149" }}>-{change.deletions}</span>
                </span>
              </div>

              {/* Change bars */}
              <div style={{ display: "flex", alignItems: "center", height: 20 }}>
                {/* Additions bar */}
                <div
                  style={{
                    width: additionsWidth,
                    height: "100%",
                    backgroundColor: "#2EA043",
                    borderRadius: "4px 0 0 4px",
                    transition: "width 0.3s ease",
                  }}
                />
                {/* Deletions bar */}
                <div
                  style={{
                    width: deletionsWidth,
                    height: "100%",
                    backgroundColor: "#F85149",
                    borderRadius: "0 4px 4px 0",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            justifyContent: "center",
            gap: 30,
            opacity: spring({
              frame: frame - 60,
              fps,
              from: 0,
              to: 1,
              config: { damping: 10 },
            }),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 16,
                height: 16,
                backgroundColor: "#2EA043",
                borderRadius: 4,
              }}
            />
            <span>Lines Added</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 16,
                height: 16,
                backgroundColor: "#F85149",
                borderRadius: 4,
              }}
            />
            <span>Lines Deleted</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}; 