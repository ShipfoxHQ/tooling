import {
  type RemixiconComponentType,
  RiCheckLine,
  RiCloseLine,
  RiFileCopyLine,
  RiGithubFill,
  RiGoogleFill,
  RiHomeSmileFill,
  RiImageAddFill,
  RiInformationFill,
  RiMicrosoftFill,
  RiMoneyDollarCircleLine,
  RiSubtractLine,
} from '@remixicon/react';
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

const iconsMap = {
  google: RiGoogleFill,
  microsoft: RiMicrosoftFill,
  badge: BadgeIcon,
  checkCircleSolid: CheckCircleSolidIcon,
  circleDottedLine: CircleDottedLineIcon,
  componentFill: ComponentFillIcon,
  xCircleSolid: XCircleSolidIcon,
  thunder: ThunderIcon,
  resize: ResizeIcon,
  infoTooltipFill: InfoTooltipFillIcon,
  spinner: SpinnerIcon,
  ellipseMiniSolid: EllipseMiniSolidIcon,
  componentLine: ComponentLineIcon,
  imageAdd: RiImageAddFill,
  close: RiCloseLine,
  shipfox: ShipfoxLogo,
  slack: SlackLogo,
  stripe: StripeLogo,
  github: RiGithubFill,
  check: RiCheckLine,
  subtractLine: RiSubtractLine,
  info: RiInformationFill,
  money: RiMoneyDollarCircleLine,
  homeSmile: RiHomeSmileFill,
  copy: RiFileCopyLine,
} as const satisfies Record<string, RemixiconComponentType>;

export type IconName = keyof typeof iconsMap;
export const iconNames = Object.keys(iconsMap) as IconName[];

type BaseIconProps = ComponentProps<typeof RiGoogleFill>;
type IconProps = {name: IconName} & Omit<BaseIconProps, 'name'>;

export function Icon({name, ...props}: IconProps) {
  const IconComponent = iconsMap[name];
  return <IconComponent {...props} />;
}
