import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface TimelineEvent {
  type: string;
  displayName: string;
  createdAt: string;
  details: any[];
}

interface TimelineProps {
  events: Record<string, TimelineEvent>;
  startDate: Date;
  endDate: Date;
}

export const Timeline: React.FC<TimelineProps> = ({ events, startDate, endDate }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Convert events to timeline points
  const timelinePoints = Object.entries(events).flatMap(([type, event]) =>
    event.details.map((detail) => ({
      type,
      displayName: event.displayName,
      time: new Date(detail.createdAt),
      detail
    }))
  ).sort((a, b) => a.time.getTime() - b.time.getTime());

  // Calculate timeline position for each event
  const timeRange = endDate.getTime() - startDate.getTime();
  const getPositionOnTimeline = (time: Date) => {
    return ((time.getTime() - startDate.getTime()) / timeRange) * (width - 200);
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        left: 100,
        right: 100,
        height: 200,
      }}
    >
      {/* Timeline base */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        }}
      />

      {/* Event markers */}
      {timelinePoints.map((point, i) => {
        const delay = i * 3;
        const scale = spring({
          frame: frame - delay,
          fps,
          from: 0,
          to: 1,
          config: { mass: 0.5, damping: 12 },
        });

        const opacity = spring({
          frame: frame - delay,
          fps,
          from: 0,
          to: 1,
          config: { mass: 0.5, damping: 12 },
        });

        // Event type colors
        const colors: Record<string, string> = {
          PushEvent: "#2EA043",
          PullRequestEvent: "#DB61A2",
          IssuesEvent: "#F78166",
          IssueCommentEvent: "#8957E5",
          CreateEvent: "#3FB950",
          DeleteEvent: "#F85149",
          default: "#58A6FF",
        };

        const color = colors[point.type] || colors.default;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: 40,
              left: getPositionOnTimeline(point.time),
              transform: `scale(${scale})`,
              opacity,
            }}
          >
            {/* Event marker */}
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: color,
                border: "2px solid rgba(255, 255, 255, 0.2)",
                marginBottom: 8,
              }}
            />
            
            {/* Event label */}
            <div
              style={{
                color: "white",
                fontSize: "0.8rem",
                transform: "rotate(-45deg)",
                transformOrigin: "left top",
                whiteSpace: "nowrap",
                marginTop: 8,
              }}
            >
              {point.displayName}
            </div>
          </div>
        );
      })}

      {/* Time markers */}
      {Array.from({ length: 5 }).map((_, i) => {
        const time = new Date(startDate.getTime() + (timeRange * i) / 4);
        const opacity = spring({
          frame: frame - i * 3,
          fps,
          from: 0,
          to: 0.5,
          config: { mass: 0.5, damping: 12 },
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: 60,
              left: (width - 200) * (i / 4),
              opacity,
              color: "white",
              fontSize: "0.8rem",
            }}
          >
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        );
      })}
    </div>
  );
}; 