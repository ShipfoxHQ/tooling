import {Input} from 'components/input';
import {Kbd} from 'components/kbd';
import {PopoverTrigger} from 'components/popover';
import {cn} from 'utils/cn';
import {
  type UseNewIntervalSelectorInputProps,
  useIntervalSelectorInput,
} from './hooks/use-interval-selector-input';

type IntervalSelectorInputProps = {
  className?: string;
  inputClassName?: string;
} & UseNewIntervalSelectorInputProps;

export function IntervalSelectorInput({
  className,
  inputClassName,
  ...props
}: IntervalSelectorInputProps) {
  const {
    displayValue,
    shortcutValue,
    isFocused,
    isInvalid,
    shouldShake,
    onChange,
    onKeyDown,
    onFocus,
    onBlur,
    onMouseDown,
    onMouseUp,
    inputRef,
  } = useIntervalSelectorInput(props);

  return (
    <PopoverTrigger asChild>
      <div className={cn('relative', className, shouldShake && 'animate-shake')}>
        <Input
          ref={inputRef}
          value={displayValue}
          onChange={isFocused ? onChange : undefined}
          onFocus={onFocus}
          onBlur={onBlur}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onKeyDown={onKeyDown}
          readOnly={!isFocused}
          aria-invalid={isInvalid && isFocused}
          iconLeft={<Kbd className="h-16 shrink-0 min-w-36">{shortcutValue}</Kbd>}
          className={cn('w-full pl-50', inputClassName)}
        />
      </div>
    </PopoverTrigger>
  );
}
