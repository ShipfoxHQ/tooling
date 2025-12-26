/**
 * Dashboard Component
 *
 * Main dashboard with context provider and page routing.
 */

import {Tabs, TabsContent, TabsContents} from 'components/tabs';
import {useMotionValueEvent, useScroll} from 'framer-motion';
import {useCallback, useRef, useState} from 'react';
import {AnimatedLogo} from './components/animated-logo';
import {TopMenu} from './components/top-menu';
import {Topbar} from './components/topbar';
import {DashboardProvider} from './context';
import {AnalyticsPage} from './pages/analytics-page';
import {JobsPage} from './pages/jobs-page';

const LOGO_HEIGHT = 48;
const TOPBAR_HEIGHT = 41;

export interface DashboardProps {
  /**
   * Default active tab
   * @default 'analytics'
   */
  defaultActiveTab?: string;
}

/**
 * Dashboard
 *
 * Main dashboard component with improved architecture:
 * - Uses DashboardProvider for centralized state management
 * - Generic reusable components (PageToolbar, TableWrapper)
 * - Better separation of concerns
 * - Cleaner, more maintainable code
 *
 * @example
 * ```tsx
 * <Dashboard defaultActiveTab="analytics" />
 * ```
 */
export function Dashboard({defaultActiveTab = 'analytics'}: DashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topbarRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

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
    <DashboardProvider>
      <div className="flex flex-col w-full h-full">
        <AnimatedLogo scrollProgress={scrollProgress} />

        <div className="flex flex-1 w-full h-full overflow-hidden">
          <div ref={containerRef} className="flex flex-col flex-1 w-full h-full overflow-auto">
            <div ref={topbarRef}>
              <Topbar hideLogo={isTopbarHidden} />
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <div className="sticky top-0 z-40 border-b border-border-neutral-strong bg-background-neutral-base">
                <div
                  style={{
                    paddingLeft: `${(1 - (1 - scrollProgress) ** 3) * (LOGO_HEIGHT - 8)}px`,
                  }}
                >
                  <TopMenu activeTab={activeTab} onTabChange={handleTabChange} />
                </div>
              </div>
              <TabsContents>
                <TabsContent value="analytics">
                  <AnalyticsPage />
                </TabsContent>
                <TabsContent value="jobs">
                  <JobsPage />
                </TabsContent>
              </TabsContents>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
