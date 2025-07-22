import {readdirSync} from 'node:fs';
import {join} from 'node:path';
import svgToDataUri from 'mini-svg-data-uri';
import type {Config} from 'tailwindcss';
import animate from 'tailwindcss-animate';
import {fontFamily} from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import {colors} from './tailwind.config.colors';

function subDirs(dir: string): string[] {
  return readdirSync(dir, {withFileTypes: true})
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => `${dir}/${dirent.name}`);
}

function generateContent(): string[] {
  const root = join(__dirname, '../../../');
  const apps = subDirs(join(root, 'apps'));
  const libs = subDirs(join(root, 'libs')).flatMap((f) => subDirs(join(f)));
  const projects = [...apps, ...libs];
  return projects.flatMap((p) => [
    `${p}/*.{tsx,ts,astro,html}`,
    `${p}/src/**/*.{tsx,ts,astro,html,md,mdx}`,
    `${p}/.storybook/**/*.{tsx,ts,astro,html}`,
  ]);
}

export default {
  darkMode: 'selector',
  content: generateContent(),
  safelist: [
    {
      pattern:
        /bg-(gray|blue|amber|red|green|teal|purple|pink|gray-alpha|border|text|background|focus|surface|contrast|status).*/,
    },
    'visx-tooltip',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    fontFamily: {
      display: ['Jura', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      body: ['Raleway', 'sans-serif'],
      code: ['IBM Plex Mono'],
    },
    extend: {
      boxShadow: {
        focus: 'var(--ds-focus-border)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      colors,
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: [...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'},
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    animate,
    plugin(({matchUtilities}) => {
      matchUtilities(
        {
          'bg-grid': (value: string) => {
            return {
              backgroundImage: `url("${svgToDataUri(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
              )}")`,
            };
          },
        },
        {type: 'color'},
      );
    }),
  ],
} satisfies Config;
