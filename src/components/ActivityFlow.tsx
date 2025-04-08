import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface ActivityFlowProps {
  events: Record<string, any>;
}

export const ActivityFlow: React.FC<ActivityFlowProps> = ({ events }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Extract unique contributors and repositories
  const contributors = new Set<string>();
  const repositories = new Set<string>();
  Object.values(events).forEach((event: any) => {
    event.details.forEach((detail: any) => {
      contributors.add(detail.author);
      repositories.add(detail.repository);
    });
  });

  const contributorsList = Array.from(contributors);
  const repositoriesList = Array.from(repositories);

  // Create flow lines for each contributor's activity
  const flowLines = contributorsList.map((contributor, i) => {
    const contributorEvents = Object.values(events).flatMap((event: any) =>
      event.details.filter((detail: any) => detail.author === contributor)
    );

    const yPos = (height * (i + 1)) / (contributorsList.length + 1);

    return (
      <div key={contributor}>
        {/* Contributor label */}
        <div
          style={{
            position: "absolute",
            left: 20,
            top: yPos - 10,
            color: "white",
            fontSize: "1rem",
            opacity: spring({
              frame,
              fps,
              from: 0,
              to: 1,
              config: { mass: 0.5, damping: 12 },
            }),
          }}
        >
          {contributor}
        </div>

        {/* Activity particles */}
        {contributorEvents.map((event: any, eventIndex) => {
          const repoIndex = repositoriesList.indexOf(event.repository);
          const targetY = (height * (repoIndex + 1)) / (repositoriesList.length + 1);
          const delay = eventIndex * 5;

          const progress = spring({
            frame: frame - delay,
            fps,
            from: 0,
            to: 1,
            config: { mass: 0.5, damping: 12 },
          });

          const x = interpolate(progress, [0, 1], [100, width - 100]);
          const y = interpolate(progress, [0, 1], [yPos, targetY]);

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

          return (
            <div
              key={`${event.createdAt}-${eventIndex}`}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: colors[event.type] || colors.default,
                transform: `scale(${spring({
                  frame: frame - delay,
                  fps,
                  from: 0,
                  to: 1,
                  config: { mass: 0.3, damping: 8 },
                })})`,
              }}
            />
          );
        })}
      </div>
    );
  });

  // Repository labels on the right
  const repoLabels = repositoriesList.map((repo, i) => {
    const yPos = (height * (i + 1)) / (repositoriesList.length + 1);

    return (
      <div
        key={repo}
        style={{
          position: "absolute",
          right: 20,
          top: yPos - 10,
          color: "white",
          fontSize: "1rem",
          opacity: spring({
            frame: frame - i * 3,
            fps,
            from: 0,
            to: 1,
            config: { mass: 0.5, damping: 12 },
          }),
        }}
      >
        {repo.split("/")[1]}
      </div>
    );
  });

  return (
    <div style={{ position: "absolute", width, height }}>
      {flowLines}
      {repoLabels}
    </div>
  );
}; 