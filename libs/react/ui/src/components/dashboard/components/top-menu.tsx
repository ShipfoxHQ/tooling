import {Tabs, TabsList, TabsTrigger} from 'components/tabs';

export function TopMenu({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center flex-1 min-w-0 pl-12 md:pl-20 pr-8">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="h-48 gap-8 md:gap-12">
            <TabsTrigger value="analytics" className="text-sm font-medium">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="jobs" className="text-sm font-medium">
              Jobs
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
