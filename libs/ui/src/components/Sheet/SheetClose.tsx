import * as SheetPrimitive from '@radix-ui/react-dialog';
import {IconButton, type IconButtonProps} from 'components/Button';

export type SheetCloseProps = Partial<IconButtonProps>;

export function SheetClose(props: SheetCloseProps) {
  return (
    <SheetPrimitive.Close asChild>
      <IconButton variant="ghost" icon="cross" srText="Close" {...props} />
    </SheetPrimitive.Close>
  );
}
