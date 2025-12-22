import {Button} from 'components/button';
import {ShinyText} from 'components/shiny-text';
import {useResolvedTheme} from 'hooks/useResolvedTheme';
import {ShipfoxLoader} from 'shipfox-loader-react';
import {cn} from 'utils/cn';

export function CompleteSetupButton({className}: {className?: string}) {
  const resolvedTheme = useResolvedTheme();
  return (
    <Button
      type="button"
      variant="transparent"
      className={cn(
        'flex items-center gap-8 min-w-124 max-w-280 overflow-hidden px-12 py-10 transition-colors rounded-none h-40 border-l border-border-neutral-strong',
        className,
      )}
    >
      <ShipfoxLoader
        size={13}
        animation="circular"
        color={resolvedTheme === 'dark' ? 'white' : 'orange'}
        background={resolvedTheme === 'dark' ? 'dark' : 'light'}
      />
      <ShinyText
        text="Complete setup"
        className="flex-1 text-sm font-medium leading-20 text-foreground-neutral-base truncate text-left"
      />
    </Button>
  );
}
