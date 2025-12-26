/**
 * Analytics Page Component
 *
 * Refactored analytics page using DashboardContext and generic components.
 */

import {jobColumns} from 'components/table/table.stories.columns';
import {jobsData} from 'components/table/table.stories.data';
import {useMediaQuery} from 'hooks/useMediaQuery';
import {useMemo} from 'react';
import {BarChart} from '../components/charts/bar-chart';
import {LineChart} from '../components/charts/line-chart';
import {DashboardAlert} from '../components/dashboard-alert';
import {type KpiCardProps, KpiCardsGroup} from '../components/kpi-card';
import {MobileSidebar} from '../components/mobile-sidebar';
import {defaultSidebarItems, Sidebar} from '../components/sidebar';
import {useDashboardContext} from '../context';
import {ExpressionFilterBar} from '../filters';
import {TableWrapper} from '../table';
import {PageToolbar, ToolbarActions} from '../toolbar';

// Sample data for the performance chart
const performanceData = [
  {label: '1', dataA: 150, dataB: 200, dataC: 280, dataD: 180},
  {label: '2', dataA: 250, dataB: 180, dataC: 320, dataD: 220},
  {label: '3', dataA: 380, dataB: 320, dataC: 410, dataD: 280},
  {label: '4', dataA: 320, dataB: 280, dataC: 350, dataD: 240},
  {label: '5', dataA: 280, dataB: 220, dataC: 180, dataD: 200},
  {label: '6', dataA: 180, dataB: 250, dataC: 220, dataD: 160},
];

// Generate sample data for duration distribution
function generateDurationData() {
  const count = 40;
  const data: {label: string; value: number}[] = [];
  for (let i = 0; i < count; i++) {
    const baseValue = 80 + Math.random() * 120;
    const spike = i % 8 === 0 ? Math.random() * 300 : 0;
    data.push({
      label: String(i + 1),
      value: Math.round(baseValue + spike),
    });
  }
  return data;
}

const durationData = generateDurationData();

/**
 * KPI Cards configuration
 */
const kpiCards: KpiCardProps[] = [
  {label: 'Total', value: '1211', variant: 'neutral'},
  {label: 'Success', value: '1200', variant: 'success'},
  {label: 'Neutral', value: '11', variant: 'neutral'},
  {label: 'Failure rate', value: '0%', variant: 'success'},
];

/**
 * Analytics Page
 *
 * Main analytics page with KPI cards, charts, and jobs table.
 * Uses DashboardContext for state management and generic reusable components.
 *
 * @example
 * ```tsx
 * <DashboardProvider>
 *   <AnalyticsPage />
 * </DashboardProvider>
 * ```
 */
export function AnalyticsPage() {
  const {
    searchQuery,
    setSearchQuery,
    timePeriod,
    setTimePeriod,
    lastUpdated,
    columnVisibility,
    updateColumnVisibility,
    activeSidebarItem,
    setActiveSidebarItem,
    resourceType,
    setResourceType,
  } = useDashboardContext();

  // Responsive breakpoints
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Get the active sidebar item label for the title
  const pageTitle = useMemo(() => {
    const activeItem = defaultSidebarItems.find((item) => item.id === activeSidebarItem);
    return activeItem?.label || 'Reliability'; // Default to Reliability
  }, [activeSidebarItem]);

  // Filter data based on search query
  const filteredData = useMemo(
    () => jobsData.filter((job) => job.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery],
  );

  return (
    <div className="flex h-full flex-col">
      {/* Page Toolbar with Mobile Menu */}
      <PageToolbar
        title={pageTitle}
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        lastUpdated={lastUpdated}
      >
        {/* Mobile Sidebar Trigger */}
        {!isDesktop && (
          <MobileSidebar
            items={defaultSidebarItems}
            activeItemId={activeSidebarItem}
            onItemClick={(item) => setActiveSidebarItem(item.id)}
          />
        )}
      </PageToolbar>

      <div className="flex flex-1 overflow-hidden bg-background-neutral-base">
        {/* Desktop Sidebar */}
        {isDesktop && (
          <Sidebar
            items={defaultSidebarItems}
            activeItemId={activeSidebarItem}
            onItemClick={(item) => setActiveSidebarItem(item.id)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 px-12 pb-12 pt-4 md:px-24 md:pb-24 space-y-12 md:space-y-16 lg:space-y-20 overflow-auto">
          {/* Promotional Alert Banner */}
          <DashboardAlert />

          {/* Expression Filter Bar */}
          <ExpressionFilterBar value={resourceType} onValueChange={setResourceType} />

          {/* Toolbar Actions: Filter, Search, View */}
          <ToolbarActions />

          {/* KPI Cards */}
          <KpiCardsGroup cards={kpiCards} />

          {/* Charts Row - Responsive */}
          <div className="flex flex-col lg:flex-row gap-12 md:gap-16 lg:gap-20">
            {/* Performance over time - Line Chart */}
            <LineChart
              data={performanceData}
              lines={[
                {dataKey: 'dataA', name: 'Data A', color: 'blue'},
                {dataKey: 'dataB', name: 'Data B', color: 'green'},
                {dataKey: 'dataC', name: 'Data C', color: 'orange'},
                {dataKey: 'dataD', name: 'Data D', color: 'purple'},
              ]}
              title="Performance over time"
              className="flex-1 min-h-300"
              yAxis={{domain: [0, 500], ticks: [0, 100, 200, 300, 400, 500]}}
              tooltip={{
                labelFormatter: () => `Jul 22, 2025`,
              }}
            />

            {/* Duration distribution - Bar Chart */}
            <BarChart
              data={durationData}
              bars={[{dataKey: 'value', name: 'Duration', color: 'orange'}]}
              title="Duration distribution"
              className="flex-1 min-h-300"
              yAxis={{domain: [0, 500], ticks: [0, 100, 200, 300, 400, 500]}}
            />
          </div>

          {/* Analytics Table */}
          <TableWrapper
            title="Analytics breakdown"
            columns={jobColumns}
            data={filteredData}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchClear={() => setSearchQuery('')}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={updateColumnVisibility}
          />
        </div>
      </div>
    </div>
  );
}
