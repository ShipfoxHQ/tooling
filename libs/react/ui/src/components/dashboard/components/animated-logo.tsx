import {Icon} from 'components/icon';
import {motion} from 'framer-motion';

const LOGO_HEIGHT = 48;

export function AnimatedLogo({scrollProgress}: {scrollProgress: number}) {
  const isVisible = scrollProgress > 0;

  if (!isVisible) return null;

  const easedProgress = 1 - (1 - scrollProgress) ** 3;

  return (
    <motion.div
      className="fixed top-0 left-0 z-50 flex items-center justify-center shrink-0 w-48 h-48 bg-background-neutral-base"
      style={{
        opacity: easedProgress,
        transform: `translateY(${-LOGO_HEIGHT + easedProgress * LOGO_HEIGHT}px)`,
      }}
      initial={false}
    >
      <Icon name="shipfox" className="size-20 text-foreground-neutral-subtle" />
    </motion.div>
  );
}
