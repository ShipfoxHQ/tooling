import type {RemixiconComponentType} from '@remixicon/react';
import {
  RiAddLine,
  RiArrowRightSLine,
  RiBookOpenFill,
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
  github: RiGithubFill,
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
  addLine: RiAddLine,
  bookOpen: RiBookOpenFill,
  check: RiCheckLine,
  chevronRight: RiArrowRightSLine,
  close: RiCloseLine,
  copy: RiFileCopyLine,
  homeSmile: RiHomeSmileFill,
  imageAdd: RiImageAddFill,
  info: RiInformationFill,
  money: RiMoneyDollarCircleLine,
  subtractLine: RiSubtractLine,
} as const satisfies Record<string, RemixiconComponentType>;

export type IconName = keyof typeof iconsMap;
export const iconNames = Object.keys(iconsMap) as IconName[];

type BaseIconProps = ComponentProps<typeof RiGoogleFill>;
type IconProps = {name: IconName} & Omit<BaseIconProps, 'name'>;

export function Icon({name, ...props}: IconProps) {
  const IconComponent = iconsMap[name];
  return <IconComponent {...props} />;
}
