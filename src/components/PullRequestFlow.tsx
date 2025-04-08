import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

interface PullRequest {
  title: string;
  author: string;
  repository: string;
  state: 'open' | 'closed' | 'merged';
  createdAt: string;
}

interface PullRequestFlowProps {
  pullRequests: PullRequest[];
  title: string;
}

const PARTICLE_COUNT = 30;
const COLORS = {
  open: '#238636',
  closed: '#F85149',
  merged: '#8957E5',
  background: '#0D1117',
  text: '#FFFFFF',
};

export const PullRequestFlow: React.FC<PullRequestFlowProps> = ({ pullRequests, title }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12 },
  });

  // Group PRs by state
  const prsByState = pullRequests.reduce((acc, pr) => {
    acc[pr.state] = (acc[pr.state] || []).concat(pr);
    return acc;
  }, {} as Record<string, PullRequest[]>);

  // Create particles for each state
  const createParticles = (state: string, count: number) => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const baseRadius = state === 'open' ? 150 : (state === 'closed' ? 200 : 250);
      
      const radius = spring({
        frame: frame - i * 2,
        fps,
        from: 0,
        to: baseRadius,
        config: { mass: 0.5, damping: 15 },
      });

      const rotation = spring({
        frame: frame - i * 2,
        fps,
        from: 0,
        to: angle,
        config: { mass: 0.3, damping: 12 },
      });

      const x = Math.cos(rotation) * radius;
      const y = Math.sin(rotation) * radius;
      
      return { x, y };
    });
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

      {/* PR Flow Visualization */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* State circles and particles */}
        {Object.entries(prsByState).map(([state, prs]) => {
          const particles = createParticles(state, PARTICLE_COUNT);
          const stateProgress = spring({
            frame,
            fps,
            from: 0,
            to: 1,
            config: { damping: 12 },
          });

          return (
            <div key={state}>
              {/* State circle */}
              <div
                style={{
                  position: 'absolute',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: COLORS[state as keyof typeof COLORS],
                  opacity: stateProgress,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  color: COLORS.text,
                  transform: `scale(${stateProgress})`,
                }}
              >
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {prs.length}
                </div>
                <div style={{ fontSize: '1.2rem', textTransform: 'capitalize' }}>
                  {state}
                </div>
              </div>

              {/* Particles */}
              {particles.map((particle, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '8px',
                    height: '8px',
                    backgroundColor: COLORS[state as keyof typeof COLORS],
                    borderRadius: '50%',
                    transform: `translate(${particle.x}px, ${particle.y}px)`,
                    opacity: interpolate(frame % 60, [0, 30, 60], [0.8, 0.3, 0.8]),
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* PR List */}
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {pullRequests.slice(0, 3).map((pr, index) => {
          const delay = index * 5;
          const slideProgress = spring({
            frame: frame - delay,
            fps,
            from: -1,
            to: 0,
            config: { damping: 15 },
          });

          return (
            <div
              key={`${pr.repository}-${pr.title}`}
              style={{
                transform: `translateX(${slideProgress * 100}%)`,
                backgroundColor: '#161B22',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #30363D',
                color: COLORS.text,
                width: '300px',
              }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '5px' }}>
                {pr.title}
              </div>
              <div style={{ color: '#8B949E', fontSize: '0.9rem' }}>
                {pr.repository} • {pr.author}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}; 