import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface DetailedActivitySummaryProps {
  events: Record<string, {
    displayName: string;
    count: number;
    details: Array<{
      repository: string;
      author: string;
      createdAt: string;
      [key: string]: any;
    }>;
  }>;
  orgName: string;
}

export const DetailedActivitySummary: React.FC<DetailedActivitySummaryProps> = ({
  events,
  orgName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Event type colors and icons
  const eventStyles: Record<string, { color: string; icon: string }> = {
    PushEvent: { color: "#2EA043", icon: "🔄" },
    PullRequestEvent: { color: "#DB61A2", icon: "🔀" },
    IssuesEvent: { color: "#F78166", icon: "⚠️" },
    IssueCommentEvent: { color: "#8957E5", icon: "💬" },
    CreateEvent: { color: "#3FB950", icon: "✨" },
    DeleteEvent: { color: "#F85149", icon: "🗑️" },
  };

  // Group events by repository
  const eventsByRepo = Object.entries(events).reduce((acc, [type, event]) => {
    event.details.forEach((detail) => {
      if (!acc[detail.repository]) {
        acc[detail.repository] = [];
      }
      acc[detail.repository].push({
        type,
        displayName: event.displayName,
        ...detail,
      });
    });
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#0D1117",
        padding: "2rem",
        color: "white",
        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Organization Summary */}
      <div
        style={{
          opacity: spring({
            frame,
            fps,
            from: 0,
            to: 1,
            config: { mass: 0.5, damping: 12 },
          }),
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#58A6FF" }}>
          {orgName} Activity Summary
        </h1>
        
        {/* Total counts */}
        <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
          {Object.entries(events).map(([type, event], i) => {
            const style = eventStyles[type] || { color: "#58A6FF", icon: "📊" };
            const delay = i * 5;
            
            return (
              <div
                key={type}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  padding: "1rem",
                  borderRadius: "8px",
                  transform: `scale(${spring({
                    frame: frame - delay,
                    fps,
                    from: 0,
                    to: 1,
                    config: { mass: 0.5, damping: 12 },
                  })})`,
                }}
              >
                <div style={{ fontSize: "2rem" }}>{style.icon}</div>
                <div style={{ fontSize: "1.8rem", color: style.color }}>
                  {event.count}
                </div>
                <div style={{ color: "#8B949E" }}>{event.displayName}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Repository Activity */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {Object.entries(eventsByRepo).map(([repo, repoEvents], repoIndex) => {
          const delay = repoIndex * 5;
          const scale = spring({
            frame: frame - delay,
            fps,
            from: 0,
            to: 1,
            config: { mass: 0.5, damping: 12 },
          });

          return (
            <div
              key={repo}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                padding: "1.5rem",
                transform: `scale(${scale})`,
              }}
            >
              <h2 style={{ color: "#58A6FF", marginBottom: "1rem" }}>
                {repo.split("/")[1]}
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {repoEvents.map((event, eventIndex) => {
                  const style = eventStyles[event.type] || { color: "#58A6FF", icon: "📊" };
                  const eventDelay = delay + eventIndex * 3;
                  const opacity = spring({
                    frame: frame - eventDelay,
                    fps,
                    from: 0,
                    to: 1,
                    config: { mass: 0.5, damping: 12 },
                  });

                  return (
                    <div
                      key={`${event.createdAt}-${eventIndex}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        opacity,
                      }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>{style.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: style.color }}>
                          {event.displayName}
                          {event.title && `: ${event.title}`}
                          {event.commits?.length > 0 &&
                            `: ${event.commits[0].message}`}
                        </div>
                        <div style={{ color: "#8B949E", fontSize: "0.9rem" }}>
                          by {event.author} at{" "}
                          {new Date(event.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 