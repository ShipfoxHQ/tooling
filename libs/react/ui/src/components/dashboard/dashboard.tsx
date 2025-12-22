import {useMotionValueEvent, useScroll} from 'framer-motion';
import {useCallback, useRef, useState} from 'react';
import {AnalyticsContent} from './components/analytics-content';
import {AnimatedLogo} from './components/animated-logo';
import {JobsContent} from './components/jobs-content';
import {TopMenu} from './components/top-menu';
import {Topbar} from './components/topbar';

const LOGO_HEIGHT = 48;
const TOPBAR_HEIGHT = 41;

export function Dashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const topbarRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('analytics');

  const {scrollY} = useScroll({
    container: containerRef,
  });

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const progress = Math.min(latest / TOPBAR_HEIGHT, 1);
    setScrollProgress(progress);
  });

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    if (containerRef.current) {
      containerRef.current.scrollTo({top: 0, behavior: 'instant'});
    }
    setScrollProgress(0);
  }, []);

  const isTopbarHidden = scrollProgress >= 1;

  return (
    <div className="flex flex-col w-full h-full">
      <AnimatedLogo scrollProgress={scrollProgress} />

      <div ref={containerRef} className="flex flex-col w-full h-full overflow-auto">
        <div ref={topbarRef}>
          <Topbar hideLogo={isTopbarHidden} />
        </div>

        <div className="sticky top-0 z-40 border-b border-border-neutral-strong bg-background-neutral-base">
          <div
            style={{
              paddingLeft: `${(1 - (1 - scrollProgress) ** 3) * (LOGO_HEIGHT - 8)}px`,
            }}
          >
            <TopMenu activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </div>

        {activeTab === 'analytics' && <AnalyticsContent />}
        {activeTab === 'jobs' && <JobsContent />}
      </div>
    </div>
  );
}
