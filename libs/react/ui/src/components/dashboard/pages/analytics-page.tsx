import {Button} from 'components/button';
import {CountUp} from 'components/count-up/count-up';
import {Icon} from 'components/icon';
import {SearchInline} from 'components/search/search-inline';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from 'components/select';
import {jobColumns} from 'components/table/table.stories.columns';
import {jobsData} from 'components/table/table.stories.data';
import {useMediaQuery} from 'hooks/useMediaQuery';
import {useMemo, useState} from 'react';
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

const performanceData = [
  {label: '1', dataA: 150, dataB: 200, dataC: 280, dataD: 180},
  {label: '2', dataA: 250, dataB: 180, dataC: 320, dataD: 220},
  {label: '3', dataA: 380, dataB: 320, dataC: 410, dataD: 280},
  {label: '4', dataA: 320, dataB: 280, dataC: 350, dataD: 240},
  {label: '5', dataA: 280, dataB: 220, dataC: 180, dataD: 200},
  {label: '6', dataA: 180, dataB: 250, dataC: 220, dataD: 160},
];

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

interface ParsedValue {
  prefix: string;
  numericValue: number;
  suffix: string;
  isNumeric: boolean;
}

const KPI_VALUE_REGEX = /^([^\d]*)([\d.,]+)([^\d]*)$/;

function parseKpiValue(value: string | number): ParsedValue {
  if (typeof value === 'number') {
    return {
      prefix: '',
      numericValue: value,
      suffix: '',
      isNumeric: true,
    };
  }

  const match = value.match(KPI_VALUE_REGEX);
  if (match) {
    const [, prefix, numericStr, suffix] = match;
    const numericValue = parseFloat(numericStr.replace(/,/g, ''));
    if (!Number.isNaN(numericValue)) {
      return {
        prefix,
        numericValue,
        suffix,
        isNumeric: true,
      };
    }
  }

  return {
    prefix: '',
    numericValue: 0,
    suffix: '',
    isNumeric: false,
  };
}

function renderKpiValue(value: string | number) {
  const parsed = parseKpiValue(value);

  if (parsed.isNumeric) {
    return (
      <>
        {parsed.prefix}
        <CountUp to={parsed.numericValue} from={0} duration={0.5} className="inline" />
        {parsed.suffix}
      </>
    );
  }

  return value;
}

const kpiCards: KpiCardProps[] = [
  {label: 'Total', value: renderKpiValue('1211'), variant: 'info'},
  {label: 'Success', value: renderKpiValue('1200'), variant: 'success'},
  {label: 'Neutral', value: renderKpiValue('11'), variant: 'neutral'},
  {label: 'Failure rate', value: renderKpiValue('0%'), variant: 'success'},
];

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

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [performanceTimeRange, setPerformanceTimeRange] = useState('2h');

  const pageTitle = useMemo(() => {
    const activeItem = defaultSidebarItems.find((item) => item.id === activeSidebarItem);
    return activeItem?.label || 'Reliability';
  }, [activeSidebarItem]);

  const filteredData = useMemo(
    () => jobsData.filter((job) => job.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery],
  );

  return (
    <div className="flex h-full flex-col">
      <PageToolbar
        title={pageTitle}
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        lastUpdated={lastUpdated}
      >
        {!isDesktop && (
          <MobileSidebar
            items={defaultSidebarItems}
            activeItemId={activeSidebarItem}
            onItemClick={(item) => setActiveSidebarItem(item.id)}
          />
        )}
      </PageToolbar>

      <div className="flex flex-1 overflow-hidden">
        {isDesktop && (
          <Sidebar
            items={defaultSidebarItems}
            activeItemId={activeSidebarItem}
            onItemClick={(item) => setActiveSidebarItem(item.id)}
          />
        )}

        <div className="flex-1 px-12 pb-12 pt-4 md:px-24 md:pb-24 space-y-12 md:space-y-16 lg:space-y-20 overflow-auto">
          <DashboardAlert
            title="Ship faster. At half the cost."
            description="Track every workflow in one place, with full visibility into performance and reliability."
            primaryAction={{label: 'Learn more', onClick: () => undefined}}
            secondaryAction={{label: 'Dismiss', onClick: () => undefined}}
          />

          <ExpressionFilterBar value={resourceType} onValueChange={setResourceType} />

          <ToolbarActions />

          <KpiCardsGroup cards={kpiCards} />

          <div className="flex flex-col lg:flex-row gap-12 md:gap-16 lg:gap-20">
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
              action={
                <Select value={performanceTimeRange} onValueChange={setPerformanceTimeRange}>
                  <SelectTrigger className="w-60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1h</SelectItem>
                    <SelectItem value="2h">2h</SelectItem>
                    <SelectItem value="6h">6h</SelectItem>
                    <SelectItem value="12h">12h</SelectItem>
                    <SelectItem value="24h">24h</SelectItem>
                  </SelectContent>
                </Select>
              }
            />

            <BarChart
              data={durationData}
              bars={[{dataKey: 'value', name: 'Duration', color: 'orange'}]}
              title="Duration distribution"
              className="flex-1 min-h-300"
              yAxis={{domain: [0, 500], ticks: [0, 100, 200, 300, 400, 500]}}
            />
          </div>

          <TableWrapper
            title="Analytics breakdown"
            columns={jobColumns}
            data={filteredData}
            headerActions={
              <>
                <SearchInline
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                  className="flex-1 md:w-240"
                />
                <Button variant="secondary" aria-label="Insert column left" className="shrink-0">
                  <Icon
                    name="insertColumnLeft"
                    className="size-16 text-foreground-neutral-subtle"
                  />
                </Button>
              </>
            }
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={updateColumnVisibility}
          />
        </div>
      </div>
    </div>
  );
}
