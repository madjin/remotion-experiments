import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate, Sequence } from 'remotion';

interface Contribution {
  type: string;
  count: number;
  timestamp: string;
  impact?: {
    linesChanged?: number;
    filesModified?: number;
    reviewComments?: number;
  };
}

interface Contributor {
  username: string;
  avatarUrl: string;
  recentContributions: Contribution[];
  totalContributions: number;
  streak: number;
  contributionsByType: {
    commits: number;
    reviews: number;
    issues: number;
    pullRequests: number;
  };
  impactMetrics: {
    totalLinesChanged: number;
    filesModified: number;
    avgReviewComments: number;
    mergeRate: number;
  };
}

interface ContributorActivityProps {
  contributors: Contributor[];
  title: string;
}

const COLORS = {
  background: '#0D1117',
  text: '#FFFFFF',
  primary: '#58A6FF',
  secondary: '#30363D',
  contribution: {
    level0: '#161B22',
    level1: '#0E4429',
    level2: '#006D32',
    level3: '#26A641',
    level4: '#39D353',
  },
  types: {
    commits: '#2EA043',
    reviews: '#A371F7',
    issues: '#F85149',
    pullRequests: '#58A6FF',
  },
};

const PARTICLE_COUNT = 20;
const SEQUENCE_DURATION = 120;

export const ContributorActivity: React.FC<ContributorActivityProps> = ({ contributors, title }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12 },
  });

  // Sort contributors by total contributions
  const sortedContributors = [...contributors].sort((a, b) => b.totalContributions - a.totalContributions);

  // Create particles for contributor streaks
  const createStreakParticles = (streak: number) => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const radius = spring({
        frame: frame - i * 2,
        fps,
        from: 0,
        to: 40 + streak * 2,
        config: { mass: 0.5, damping: 15 },
      });

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      return { x, y };
    });
  };

  // Calculate contribution level color
  const getContributionColor = (count: number) => {
    if (count === 0) return COLORS.contribution.level0;
    if (count <= 3) return COLORS.contribution.level1;
    if (count <= 6) return COLORS.contribution.level2;
    if (count <= 9) return COLORS.contribution.level3;
    return COLORS.contribution.level4;
  };

  // Render contribution type breakdown chart
  const renderContributionTypeChart = (contributor: Contributor) => {
    const total = Object.values(contributor.contributionsByType).reduce((a, b) => a + b, 0);
    let currentOffset = 0;

    return (
      <div style={{ position: 'relative', width: '200px', height: '200px' }}>
        {Object.entries(contributor.contributionsByType).map(([type, count], index) => {
          const percentage = (count / total) * 100;
          const delay = index * 5;
          const progress = spring({
            frame: frame - delay,
            fps,
            from: 0,
            to: percentage,
            config: { damping: 12 },
          });

          const rotation = currentOffset * 3.6; // 3.6 degrees per percentage point
          const dashArray = `${progress} ${100 - progress}`;
          currentOffset += percentage;

          return (
            <svg
              key={type}
              style={{
                position: 'absolute',
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center',
              }}
              width="200"
              height="200"
            >
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={COLORS.types[type as keyof typeof COLORS.types]}
                strokeWidth="20"
                strokeDasharray={dashArray}
                strokeDashoffset="25"
              />
            </svg>
          );
        })}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: COLORS.text,
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{total}</div>
          <div style={{ fontSize: '0.9rem' }}>total</div>
        </div>
      </div>
    );
  };

  // Render impact metrics
  const renderImpactMetrics = (contributor: Contributor) => {
    const metrics = [
      {
        label: 'Lines Changed',
        value: contributor.impactMetrics.totalLinesChanged.toLocaleString(),
        color: COLORS.types.commits,
      },
      {
        label: 'Files Modified',
        value: contributor.impactMetrics.filesModified.toLocaleString(),
        color: COLORS.types.pullRequests,
      },
      {
        label: 'Avg Review Comments',
        value: contributor.impactMetrics.avgReviewComments.toFixed(1),
        color: COLORS.types.reviews,
      },
      {
        label: 'Merge Rate',
        value: `${(contributor.impactMetrics.mergeRate * 100).toFixed(1)}%`,
        color: COLORS.types.issues,
      },
    ];

    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {metrics.map((metric, index) => {
          const delay = index * 5;
          const progress = spring({
            frame: frame - delay,
            fps,
            from: 0,
            to: 1,
            config: { damping: 12 },
          });

          return (
            <div
              key={metric.label}
              style={{
                backgroundColor: COLORS.secondary,
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                transform: `scale(${progress})`,
                border: `2px solid ${metric.color}`,
              }}
            >
              <div style={{ color: metric.color, fontSize: '1.5rem', fontWeight: 'bold' }}>
                {metric.value}
              </div>
              <div style={{ color: COLORS.text, fontSize: '0.9rem' }}>{metric.label}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          width: '100%',
          textAlign: 'center',
          opacity: titleProgress,
          color: COLORS.text,
        }}
      >
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{title}</h1>
      </div>

      {/* Overview Sequence */}
      <Sequence from={0} durationInFrames={SEQUENCE_DURATION}>
        <div
          style={{
            position: 'absolute',
            top: '20%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          {sortedContributors.map((contributor, index) => {
            const delay = index * 5;
            const slideProgress = spring({
              frame: frame - delay,
              fps,
              from: -1,
              to: 0,
              config: { damping: 15 },
            });

            const particles = createStreakParticles(contributor.streak);

            return (
              <div
                key={contributor.username}
                style={{
                  transform: `translateX(${slideProgress * 100}%)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2rem',
                  padding: '1.5rem',
                  backgroundColor: COLORS.secondary,
                  borderRadius: '12px',
                  width: '80%',
                  maxWidth: '1000px',
                  position: 'relative',
                }}
              >
                {/* Avatar and Streak */}
                <div style={{ position: 'relative' }}>
                  <img
                    src={contributor.avatarUrl}
                    alt={contributor.username}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: `3px solid ${COLORS.primary}`,
                    }}
                  />
                  {particles.map((particle, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: '4px',
                        height: '4px',
                        backgroundColor: COLORS.primary,
                        borderRadius: '50%',
                        left: '40px',
                        top: '40px',
                        transform: `translate(${particle.x}px, ${particle.y}px)`,
                        opacity: interpolate(frame % 60, [0, 30, 60], [0.8, 0.3, 0.8]),
                      }}
                    />
                  ))}
                </div>

                {/* Contributor Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ color: COLORS.text, margin: 0 }}>{contributor.username}</h2>
                    <div style={{ color: COLORS.primary, fontWeight: 'bold' }}>
                      {contributor.streak} day streak 🔥
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginTop: '1rem',
                    }}
                  >
                    {contributor.recentContributions.map((contribution, i) => {
                      const scaleProgress = spring({
                        frame: frame - delay - i * 2,
                        fps,
                        from: 0,
                        to: 1,
                        config: { damping: 12 },
                      });

                      return (
                        <div
                          key={i}
                          style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: getContributionColor(contribution.count),
                            borderRadius: '4px',
                            transform: `scale(${scaleProgress})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: COLORS.text,
                            fontSize: '0.8rem',
                          }}
                        >
                          {contribution.count}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total Contributions */}
                <div
                  style={{
                    backgroundColor: COLORS.primary,
                    padding: '1rem',
                    borderRadius: '8px',
                    color: COLORS.text,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {contributor.totalContributions}
                  </div>
                  <div style={{ fontSize: '0.9rem' }}>contributions</div>
                </div>
              </div>
            );
          })}
        </div>
      </Sequence>

      {/* Contribution Types Sequence */}
      <Sequence from={SEQUENCE_DURATION} durationInFrames={SEQUENCE_DURATION}>
        <div
          style={{
            position: 'absolute',
            top: '15%',
            width: '100%',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            overflowY: 'hidden',
          }}
        >
          <h2 style={{ color: COLORS.text, margin: 0 }}>Contribution Breakdown</h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              width: '100%',
              alignItems: 'center',
              paddingBottom: '2rem',
            }}
          >
            {sortedContributors.map((contributor, index) => {
              const delay = index * 5;
              const slideProgress = spring({
                frame: frame - SEQUENCE_DURATION - delay,
                fps,
                from: -1,
                to: 0,
                config: { damping: 15 },
              });

              return (
                <div
                  key={contributor.username}
                  style={{
                    transform: `translateX(${slideProgress * 100}%)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem',
                    padding: '1.5rem',
                    backgroundColor: COLORS.secondary,
                    borderRadius: '12px',
                    width: '80%',
                    maxWidth: '800px',
                  }}
                >
                  <div style={{ flex: '0 0 45%' }}>
                    <h3 style={{ color: COLORS.text, margin: '0 0 1rem 0' }}>{contributor.username}</h3>
                    {renderContributionTypeChart(contributor)}
                  </div>
                  <div style={{ flex: '0 0 45%' }}>
                    {Object.entries(contributor.contributionsByType).map(([type, count], i) => {
                      const progress = spring({
                        frame: frame - SEQUENCE_DURATION - delay - i * 3,
                        fps,
                        from: 0,
                        to: 1,
                        config: { damping: 12 },
                      });

                      return (
                        <div
                          key={type}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '0.8rem',
                            opacity: progress,
                          }}
                        >
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: COLORS.types[type as keyof typeof COLORS.types],
                            }}
                          />
                          <div style={{ color: COLORS.text, fontSize: '1.1rem' }}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}: {count}
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
      </Sequence>

      {/* Impact Metrics Sequence */}
      <Sequence from={SEQUENCE_DURATION * 2} durationInFrames={SEQUENCE_DURATION}>
        <div
          style={{
            position: 'absolute',
            top: '20%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3rem',
          }}
        >
          <h2 style={{ color: COLORS.text, margin: 0 }}>Impact Metrics</h2>
          {sortedContributors.map((contributor, index) => {
            const delay = index * 5;
            const slideProgress = spring({
              frame: frame - SEQUENCE_DURATION * 2 - delay,
              fps,
              from: -1,
              to: 0,
              config: { damping: 15 },
            });

            return (
              <div
                key={contributor.username}
                style={{
                  transform: `translateX(${slideProgress * 100}%)`,
                  padding: '2rem',
                  backgroundColor: COLORS.secondary,
                  borderRadius: '12px',
                  width: '80%',
                  maxWidth: '800px',
                }}
              >
                <h3 style={{ color: COLORS.text, margin: '0 0 1.5rem 0', textAlign: 'center' }}>
                  {contributor.username}
                </h3>
                {renderImpactMetrics(contributor)}
              </div>
            );
          })}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
}; 