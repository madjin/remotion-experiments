import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface Issue {
  title: string;
  author: string;
  repository: string;
  createdAt: string;
  labels: string[];
  priority: "high" | "medium" | "low";
}

interface NewIssuesListProps {
  issues: Issue[];
  title: string;
}

export const NewIssuesList: React.FC<NewIssuesListProps> = ({
  issues,
  title,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Animation springs
  const titleOpacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10 },
  });

  // Priority colors
  const priorityColors = {
    high: "#F85149",
    medium: "#F7C847",
    low: "#2EA043",
  };

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
          top: "5%",
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>{title}</h1>
        <h2 style={{ fontSize: "1.8rem", color: "#58A6FF", marginTop: "0.5rem" }}>
          New Issues
        </h2>
      </div>

      {/* Issues Container */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          maxWidth: 1200,
        }}
      >
        {issues.map((issue, index) => {
          const delay = index * 5;
          const slideProgress = spring({
            frame: frame - delay,
            fps,
            from: -1,
            to: 0,
            config: { damping: 15 },
          });

          const opacity = spring({
            frame: frame - delay,
            fps,
            from: 0,
            to: 1,
            config: { damping: 12 },
          });

          // Format date
          const date = new Date(issue.createdAt);
          const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          });

          return (
            <div
              key={`${issue.repository}-${issue.title}`}
              style={{
                transform: `translateX(${slideProgress * 100}%)`,
                opacity,
                backgroundColor: "#161B22",
                borderRadius: 8,
                padding: 20,
                marginBottom: 16,
                border: "1px solid #30363D",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Issue Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      marginBottom: 4,
                    }}
                  >
                    {issue.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#8B949E",
                    }}
                  >
                    {issue.repository}
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: priorityColors[issue.priority] + "20",
                    color: priorityColors[issue.priority],
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {issue.priority} priority
                </div>
              </div>

              {/* Issue Details */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  {issue.labels.map((label) => (
                    <span
                      key={label}
                      style={{
                        backgroundColor: "#30363D",
                        color: "#8B949E",
                        padding: "2px 8px",
                        borderRadius: 12,
                        fontSize: "0.8rem",
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    color: "#8B949E",
                    fontSize: "0.9rem",
                  }}
                >
                  <span>by {issue.author}</span>
                  <span>•</span>
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}; 