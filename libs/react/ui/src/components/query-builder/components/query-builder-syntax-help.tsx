import type {QueryToken} from '../types';
import {parseInput} from '../utils/suggestions';

interface QueryBuilderSyntaxHelpProps {
  editingToken: QueryToken | null;
  inputValue: string;
  syntaxError: {message: string} | null;
}

export function QueryBuilderSyntaxHelp({
  editingToken,
  inputValue,
  syntaxError,
}: QueryBuilderSyntaxHelpProps) {
  const parsed = parseInput(inputValue);
  const field = editingToken?.key || parsed.field;

  return (
    <div className="px-8 py-6 flex flex-col gap-4">
      {syntaxError && <span className="text-xs text-red-500">{syntaxError.message}</span>}
      {field === 'duration' ? (
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
          <span className="text-xs text-foreground-neutral-subtle">Duration:</span>
          {[
            {ex: '<25s', desc: '<25s'},
            {ex: '>5min', desc: '>5m'},
            {ex: '>=1h', desc: '≥1h'},
          ].map(({ex, desc}) => (
            <code key={ex} className="text-xs font-mono text-purple-500">
              {desc}
            </code>
          ))}
          <span className="text-xs text-foreground-neutral-subtle">Units: s, m, h, d</span>
        </div>
      ) : field === 'branch' || field === 'repository' ? (
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
          <span className="text-xs text-foreground-neutral-subtle">Patterns:</span>
          {['feature/*', '*-test', 'a,b'].map((ex) => (
            <code key={ex} className="text-xs font-mono text-purple-500">
              {ex}
            </code>
          ))}
        </div>
      ) : field ? (
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
          <span className="text-xs text-foreground-neutral-subtle">Multi-select:</span>
          <code className="text-xs font-mono text-purple-500">a,b</code>
          <span className="text-xs text-foreground-neutral-subtle ml-8">Exclude:</span>
          <code className="text-xs font-mono text-purple-500">-val</code>
          <code className="text-xs font-mono text-purple-500">!val</code>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-16 gap-y-4">
          <div className="flex items-center gap-6">
            <span className="text-xs text-foreground-neutral-subtle uppercase">OR</span>
            <code className="text-xs font-mono text-purple-500">a,b</code>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-foreground-neutral-subtle uppercase">Negate</span>
            <code className="text-xs font-mono text-purple-500">-val</code>
            <code className="text-xs font-mono text-purple-500">!val</code>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-foreground-neutral-subtle uppercase">Wildcard</span>
            <code className="text-xs font-mono text-purple-500">*</code>
          </div>
        </div>
      )}
    </div>
  );
}
