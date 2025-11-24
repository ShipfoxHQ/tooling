import type {RemixiconComponentType} from '@remixicon/react';
import type {ComponentProps} from 'react';
import {
  BadgeIcon,
  CheckCircleSolidIcon,
  CircleDottedLineIcon,
  ComponentFillIcon,
  ComponentLineIcon,
  EllipseMiniSolidIcon,
  InfoTooltipFillIcon,
  ResizeIcon,
  ShipfoxLogo,
  SlackLogo,
  SpinnerIcon,
  StripeLogo,
  ThunderIcon,
  XCircleSolidIcon,
} from './custom';
import {remixiconMap} from './remixicon-registry';

const customIconsMap = {
  shipfox: ShipfoxLogo,
  slack: SlackLogo,
  stripe: StripeLogo,
  badge: BadgeIcon,
  checkCircleSolid: CheckCircleSolidIcon,
  circleDottedLine: CircleDottedLineIcon,
  componentFill: ComponentFillIcon,
  componentLine: ComponentLineIcon,
  ellipseMiniSolid: EllipseMiniSolidIcon,
  infoTooltipFill: InfoTooltipFillIcon,
  resize: ResizeIcon,
  spinner: SpinnerIcon,
  thunder: ThunderIcon,
  xCircleSolid: XCircleSolidIcon,
} as const satisfies Record<string, RemixiconComponentType>;

const iconsMap = {
  ...remixiconMap,
  ...customIconsMap,
} as Record<string, RemixiconComponentType> & typeof customIconsMap;

export type IconName = keyof typeof iconsMap;
export const iconNames = Object.keys(iconsMap) as IconName[];

type BaseIconProps = ComponentProps<RemixiconComponentType>;
type IconProps = {name: IconName} & Omit<BaseIconProps, 'name'>;

export function Icon({name, ...props}: IconProps) {
  const IconComponent = iconsMap[name];
  return <IconComponent {...props} />;
}
