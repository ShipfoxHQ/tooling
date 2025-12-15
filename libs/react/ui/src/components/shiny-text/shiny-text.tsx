import {cn} from 'utils/cn';

type ShinyTextProps = {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
};

function ShinyText({text, disabled = false, speed = 5, className = ''}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={cn('shiny-text', {['disabled']: disabled}, className)}
      style={{animationDuration}}
    >
      {text}
    </div>
  );
}

export {ShinyText};
export type {ShinyTextProps};
