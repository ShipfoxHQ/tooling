import {Avatar} from 'components/avatar';
import {Button} from 'components/button';
import {Icon} from 'components/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from 'components/select';

export function OrganizationSelector() {
  return (
    <Select defaultValue="stripe">
      <SelectTrigger className="w-200 h-40 shadow-none bg-background-neutral-base hover:bg-background-neutral-hover rounded-none gap-8 pl-12 border-l min-[321px]:border-r border-border-neutral-strong">
        <div className="flex items-center gap-8 flex-1 min-w-0">
          <SelectValue placeholder="Select organization" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="stripe">
          <div className="flex items-center gap-8">
            <Avatar size="3xs" content="logo" logoName="stripe" radius="rounded" />
            <span>Stripe</span>
          </div>
        </SelectItem>
        <SelectItem value="shipfox">
          <div className="flex items-center gap-8">
            <Avatar size="3xs" content="logo" logoName="shipfox" radius="rounded" />
            <span>Shipfox</span>
          </div>
        </SelectItem>
        <SelectItem value="github">
          <div className="flex items-center gap-8">
            <Avatar size="3xs" content="logo" logoName="github" radius="rounded" />
            <span>GitHub</span>
          </div>
        </SelectItem>
        <SelectSeparator />
        <Button
          variant="transparent"
          className="w-full justify-start text-foreground-neutral-subtle"
        >
          <Icon name="addLine" className="size-16 shrink-0" />
          <span>New organization</span>
        </Button>
      </SelectContent>
    </Select>
  );
}
