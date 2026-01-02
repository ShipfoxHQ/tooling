import type {Meta, StoryObj} from '@storybook/react';
import {Code} from 'components/typography';
import {useInView, useMotionValue, useSpring} from 'framer-motion';
import {useCallback, useEffect, useRef, useState} from 'react';
import {formatNumberCompact} from 'utils/format/number';
import {CountUp} from './count-up';

const meta = {
  title: 'Components/CountUp',
  component: CountUp,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    to: {
      control: 'number',
    },
    from: {
      control: 'number',
    },
    direction: {
      control: 'select',
      options: ['up', 'down'],
    },
    delay: {
      control: 'number',
    },
    duration: {
      control: 'number',
    },
    separator: {
      control: 'text',
    },
    startWhen: {
      control: 'boolean',
    },
  },
  args: {
    to: 1000,
    from: 0,
    direction: 'up',
    delay: 0,
    duration: 2,
    separator: '',
    startWhen: true,
  },
} satisfies Meta<typeof CountUp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    to: 1000,
    from: 0,
  },
};

export const Basic: Story = {
  render: () => (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Count from 0 to 1000
        </Code>
        <div className="text-4xl font-semibold">
          <CountUp to={1000} from={0} duration={2} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Count from 500 to 1000
        </Code>
        <div className="text-4xl font-semibold">
          <CountUp to={1000} from={500} duration={2} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Count down from 1000 to 0
        </Code>
        <div className="text-4xl font-semibold">
          <CountUp to={1000} from={0} direction="down" duration={2} />
        </div>
      </div>
    </div>
  ),
};

export const WithSeparator: Story = {
  render: () => (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          With comma separator
        </Code>
        <div className="text-4xl font-semibold">
          <CountUp to={1234567} from={0} duration={2} separator="," />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          With space separator
        </Code>
        <div className="text-4xl font-semibold">
          <CountUp to={1234567} from={0} duration={2} separator=" " />
        </div>
      </div>
    </div>
  ),
};

export const WithDecimals: Story = {
  render: () => (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          With 1 decimal place
        </Code>
        <div className="text-4xl font-semibold">
          <CountUp to={99.5} from={0} duration={2} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          With 2 decimal places
        </Code>
        <div className="text-4xl font-semibold">
          <CountUp to={123.45} from={0} duration={2} />
        </div>
      </div>
    </div>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          With 1 second delay
        </Code>
        <div className="text-4xl font-semibold">
          <CountUp to={1000} from={0} duration={2} delay={1} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          With 2 second delay
        </Code>
        <div className="text-4xl font-semibold">
          <CountUp to={1000} from={0} duration={2} delay={2} />
        </div>
      </div>
    </div>
  ),
};

export const DifferentDurations: Story = {
  render: () => (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Fast (0.5s)
        </Code>
        <div className="text-4xl font-semibold">
          <CountUp to={1000} from={0} duration={0.5} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Normal (2s)
        </Code>
        <div className="text-4xl font-semibold">
          <CountUp to={1000} from={0} duration={2} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Slow (5s)
        </Code>
        <div className="text-4xl font-semibold">
          <CountUp to={1000} from={0} duration={5} />
        </div>
      </div>
    </div>
  ),
};

export const WithCallbacks: Story = {
  render: () => {
    const [started, setStarted] = useState(false);
    const [ended, setEnded] = useState(false);

    const handleStart = () => {
      setStarted(true);
    };

    const handleEnd = () => {
      setEnded(true);
    };

    return (
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle">
            Callbacks triggered
          </Code>
          <div className="text-4xl font-semibold">
            <CountUp to={1000} from={0} duration={2} onStart={handleStart} onEnd={handleEnd} />
          </div>
        </div>
        <div className="flex flex-col gap-4 text-sm">
          <div>Started: {started ? 'Yes' : 'No'}</div>
          <div>Ended: {ended ? 'Yes' : 'No'}</div>
        </div>
      </div>
    );
  },
};

function CountUpCompact({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  onStart,
  onEnd,
}: {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, {once: true, margin: '0px'});

  const formatValue = useCallback((latest: number) => {
    if (Math.abs(latest) >= 999) {
      return formatNumberCompact(latest);
    }
    const hasDecimals = latest % 1 !== 0;
    const options: Intl.NumberFormatOptions = {
      useGrouping: false,
      minimumFractionDigits: hasDecimals ? 1 : 0,
      maximumFractionDigits: hasDecimals ? 1 : 0,
    };
    return Intl.NumberFormat('en-US', options).format(latest);
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(direction === 'down' ? to : from);
    }
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === 'function') {
        onStart();
      }

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === 'down' ? from : to);
      }, delay * 1000);

      const durationTimeoutId = setTimeout(
        () => {
          if (typeof onEnd === 'function') {
            onEnd();
          }
        },
        delay * 1000 + duration * 1000,
      );

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest: number) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });

    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
}

export const WithCompactFormat: Story = {
  render: () => (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          From 999 to 1.1K
        </Code>
        <div className="text-4xl font-semibold">
          <CountUpCompact to={1100} from={999} duration={2} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          From 0 to 1.5K
        </Code>
        <div className="text-4xl font-semibold">
          <CountUpCompact to={1500} from={0} duration={2} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          From 999,999 to 1.1M
        </Code>
        <div className="text-4xl font-semibold">
          <CountUpCompact to={1100000} from={999999} duration={2} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          From 0 to 2.5M
        </Code>
        <div className="text-4xl font-semibold">
          <CountUpCompact to={2500000} from={0} duration={2} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          From 0 to 1.2B
        </Code>
        <div className="text-4xl font-semibold">
          <CountUpCompact to={1200000000} from={0} duration={2} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Count down from 1.5K to 999
        </Code>
        <div className="text-4xl font-semibold">
          <CountUpCompact to={999} from={1500} direction="down" duration={2} />
        </div>
      </div>
    </div>
  ),
};
