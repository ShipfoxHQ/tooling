import type {
  GlobalOptions as ConfettiGlobalOptions,
  CreateTypes as ConfettiInstance,
  Options as ConfettiOptions,
} from 'canvas-confetti';
import confetti from 'canvas-confetti';
import {Button} from 'components/button';
import type {ComponentProps, ReactNode} from 'react';
import {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

type ConfettiApi = {
  fire: (options?: ConfettiOptions) => Promise<void>;
};

const ConfettiContext = createContext<ConfettiApi | null>(null);

export type ConfettiRef = ConfettiApi | null;

export type ConfettiProps = ComponentProps<'canvas'> & {
  options?: ConfettiOptions;
  globalOptions?: ConfettiGlobalOptions;
  manualstart?: boolean;
  children?: ReactNode;
};

const ConfettiComponent = forwardRef<ConfettiRef, ConfettiProps>(
  (
    {
      options,
      globalOptions = {resize: true, useWorker: true},
      manualstart = false,
      children,
      ...props
    },
    ref,
  ) => {
    const instanceRef = useRef<ConfettiInstance | null>(null);
    const hasAutoFiredRef = useRef<boolean>(false);
    const optionsRef = useRef<ConfettiOptions | undefined>(options);

    useEffect(() => {
      optionsRef.current = options;
    }, [options]);

    const canvasRef = useCallback(
      (node: HTMLCanvasElement | null) => {
        if (node !== null) {
          if (instanceRef.current) {
            instanceRef.current.reset();
          }
          instanceRef.current = confetti.create(node, {
            ...globalOptions,
          });
        } else {
          if (instanceRef.current) {
            instanceRef.current.reset();
            instanceRef.current = null;
          }
        }
      },
      [globalOptions],
    );

    const fire = useCallback(async (opts: ConfettiOptions = {}) => {
      try {
        await instanceRef.current?.({...optionsRef.current, ...opts});
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: we need to log the error
        console.error('Confetti error:', error);
      }
    }, []);

    const api = useMemo<ConfettiApi>(
      () => ({
        fire,
      }),
      [fire],
    );

    useImperativeHandle(ref, () => api, [api]);

    useEffect(() => {
      if (!manualstart && !hasAutoFiredRef.current && instanceRef.current) {
        hasAutoFiredRef.current = true;
        void instanceRef.current(optionsRef.current);
      }
    }, [manualstart]);

    return (
      <ConfettiContext.Provider value={api}>
        <canvas ref={canvasRef} {...props} />
        {children}
      </ConfettiContext.Provider>
    );
  },
);

ConfettiComponent.displayName = 'Confetti';

export const Confetti = ConfettiComponent;

export type ConfettiButtonProps = ComponentProps<'button'> & {
  options?: ConfettiOptions & ConfettiGlobalOptions & {canvas?: HTMLCanvasElement};
};

export function ConfettiButton({options, onClick, children, ...props}: ConfettiButtonProps) {
  const handleClick: ComponentProps<'button'>['onClick'] = async (event) => {
    try {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      await confetti({
        ...options,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
      });
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: we need to log the error
      console.error('Confetti button error:', error);
    }

    onClick?.(event);
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
