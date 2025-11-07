import {useMediaQuery} from 'react-responsive';

const breakpoints = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
  '2xl': '96rem',
};

type BreakpointKey = keyof typeof breakpoints;

export function useBreakpoint<K extends BreakpointKey>(breakpointKey: K): boolean {
  return useMediaQuery({
    query: `(min-width: ${breakpoints[breakpointKey]})`,
  });
}
