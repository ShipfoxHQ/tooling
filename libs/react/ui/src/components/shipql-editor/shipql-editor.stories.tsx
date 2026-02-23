import type {AstNode} from '@shipfox/shipql-parser';
import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import type {LeafAstNode} from './lexical/shipql-leaf-node';
import {ShipQLEditor} from './shipql-editor';

const meta = {
  title: 'Components/ShipQLEditor',
  component: ShipQLEditor,
  tags: ['autodocs'],
  args: {
    placeholder: 'Type a ShipQL query…',
  },
} satisfies Meta<typeof ShipQLEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'status:success AND env:prod',
  },
};

export const ComplexQuery: Story = {
  args: {
    defaultValue: 'status:[200 TO 299] OR (env:prod NOT service:payments)',
  },
};

function LeafFocusCallbackDemo(args: Parameters<typeof ShipQLEditor>[0]) {
  const [focused, setFocused] = useState<LeafAstNode | null>(null);
  const [lastAst, setLastAst] = useState<AstNode | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <ShipQLEditor
        {...args}
        defaultValue="status:success AND env:prod"
        onLeafFocus={setFocused}
        onChange={setLastAst}
      />
      <div className="rounded-6 border border-border-neutral-base bg-background-components-base p-3 text-sm font-code">
        <p className="mb-1 text-foreground-neutral-subtle">Focused leaf:</p>
        <pre className="text-foreground-neutral-base">
          {focused ? JSON.stringify(focused, null, 2) : 'null'}
        </pre>
        {lastAst && (
          <>
            <p className="mb-1 mt-3 text-foreground-neutral-subtle">Last valid AST (on blur):</p>
            <pre className="text-foreground-neutral-base">{JSON.stringify(lastAst, null, 2)}</pre>
          </>
        )}
      </div>
    </div>
  );
}

export const LeafFocusCallback: Story = {
  render: (args) => <LeafFocusCallbackDemo {...args} />,
};

export const Disabled: Story = {
  args: {
    defaultValue: 'status:success AND env:prod',
    disabled: true,
  },
};
