import type {RemixiconComponentType} from '@remixicon/react';
import * as RemixIcons from '@remixicon/react';
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

const RI_PREFIX_REGEX = /^Ri/;
const NUMERIC_START_REGEX = /^\d/;

const customIcons = {
  google: RemixIcons.RiGoogleFill,
  microsoft: RemixIcons.RiMicrosoftFill,
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
  imageAdd: RemixIcons.RiImageAddFill,
  close: RemixIcons.RiCloseLine,
  shipfox: ShipfoxLogo,
  slack: SlackLogo,
  stripe: StripeLogo,
  github: RemixIcons.RiGithubFill,
  check: RemixIcons.RiCheckLine,
  subtractLine: RemixIcons.RiSubtractLine,
  info: RemixIcons.RiInformationFill,
  money: RemixIcons.RiMoneyDollarCircleLine,
  homeSmile: RemixIcons.RiHomeSmileFill,
  copy: RemixIcons.RiFileCopyLine,
  addLine: RemixIcons.RiAddLine,
  chevronRight: RemixIcons.RiArrowRightSLine,
  bookOpen: RemixIcons.RiBookOpenFill,
} as const;

function toCamelCase(iconName: string): string {
  const name = iconName.replace(RI_PREFIX_REGEX, '');
  if (NUMERIC_START_REGEX.test(name)) {
    return `i${name}`;
  }

  return name.charAt(0).toLowerCase() + name.slice(1);
}

const remixIconsRecord = RemixIcons as Record<string, RemixiconComponentType | undefined>;
const remixIconNames = Object.keys(RemixIcons).filter(
  (key) => typeof remixIconsRecord[key] === 'function' && key.startsWith('Ri'),
);

const dynamicIconsMap: Record<string, RemixiconComponentType> = {};

for (const remixIconName of remixIconNames) {
  const camelCaseName = toCamelCase(remixIconName);
  if (!(camelCaseName in customIcons)) {
    const iconComponent = remixIconsRecord[remixIconName];
    if (iconComponent) {
      dynamicIconsMap[camelCaseName] = iconComponent;
    }
  }
}

const iconsMap = {
  ...customIcons,
  ...dynamicIconsMap,
} as const satisfies Record<string, RemixiconComponentType>;

export type IconName = keyof typeof iconsMap;
export const iconNames = Object.keys(iconsMap) as IconName[];

type BaseIconProps = ComponentProps<typeof RemixIcons.RiGoogleFill>;
type IconProps = {name: IconName} & Omit<BaseIconProps, 'name'>;

export function Icon({name, ...props}: IconProps) {
  const IconComponent = iconsMap[name];
  return <IconComponent {...props} />;
}
