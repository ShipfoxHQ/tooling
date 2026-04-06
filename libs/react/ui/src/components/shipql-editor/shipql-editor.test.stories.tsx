import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {expect, screen, userEvent, waitFor, within} from 'storybook/test';
import {type LeafChangePayload, ShipQLEditor} from './shipql-editor';
import type {FacetDef} from './suggestions/types';

const meta = {
  title: 'Components/ShipQLEditor/Regressions',
  component: ShipQLEditor,
  tags: ['!autodocs'],
} satisfies Meta<typeof ShipQLEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

const FACETS: FacetDef[] = [
  'status',
  'env',
  'service',
  'repository',
  {
    name: 'duration',
    config: {
      type: 'range',
      min: '0',
      max: '500',
      presets: ['>10m', '>30m', '>1h', '>6h'],
    },
  },
];

const FACET_VALUES: Record<string, string[]> = {
  status: ['success', 'failed', 'cancelled', 'running'],
  env: ['prod', 'staging', 'dev'],
  service: ['payments', 'auth', 'api', 'worker'],
  repository: ['shipfox-api', 'shipfox-web', 'tooling'],
};

function getLeafNodes(canvasElement: HTMLElement): HTMLElement[] {
  return Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-shipql-leaf="true"]'));
}

function getEditor(canvasElement: HTMLElement): Promise<HTMLElement> {
  return within(canvasElement).findByLabelText('ShipQL query editor');
}

async function expectSelectionInEditor(editor: HTMLElement): Promise<void> {
  await waitFor(() => {
    expect(editor).toHaveFocus();
    const selection = window.getSelection();
    expect(selection).not.toBeNull();
    expect(selection?.rangeCount).toBeGreaterThan(0);
    expect(selection?.anchorNode).not.toBeNull();
    expect(editor.contains(selection?.anchorNode)).toBe(true);
  });
}

async function expectFirstLeafInvalid(canvasElement: HTMLElement): Promise<void> {
  await waitFor(() => {
    const leaves = getLeafNodes(canvasElement);
    expect(leaves).toHaveLength(1);
    expect(leaves[0]).toHaveTextContent('abc');
    expect(leaves[0]).toHaveClass('bg-tag-error-bg');
  });
}

async function expectSuggestionClosed(label: string): Promise<void> {
  await waitFor(() => {
    const option = screen.queryByText(label);
    if (option) {
      expect(option).not.toBeVisible();
    }
  });
}

function RegressionHarness(args: Parameters<typeof ShipQLEditor>[0]) {
  const [currentFacet, setCurrentFacet] = useState<string | null>(null);
  const [onLeafChangePayload, setOnLeafChangePayload] = useState<LeafChangePayload | null>(null);

  const partialValue = onLeafChangePayload?.partialValue ?? '';
  const allValues = currentFacet ? (FACET_VALUES[currentFacet] ?? []) : [];
  const valueSuggestions = partialValue
    ? allValues.filter((value) => value.toLowerCase().includes(partialValue.toLowerCase()))
    : allValues;

  return (
    <div className="flex max-w-3xl flex-col gap-12 p-24">
      <button
        type="button"
        className="w-fit rounded-6 border border-border-neutral-strong px-8 py-4"
      >
        Outside blur target
      </button>
      <ShipQLEditor
        {...args}
        allowFreeText={false}
        facets={FACETS}
        currentFacet={currentFacet}
        setCurrentFacet={setCurrentFacet}
        valueSuggestions={valueSuggestions}
        onLeafChange={setOnLeafChangePayload}
        placeholder="Add filter..."
      />
    </div>
  );
}

export const MarksFreeTextLeafInvalidOnExit: Story = {
  render: (args) => <RegressionHarness {...args} />,
  play: async ({canvasElement}) => {
    const editor = await getEditor(canvasElement);

    await userEvent.click(editor);
    await userEvent.type(editor, 'abc ');
    await expectFirstLeafInvalid(canvasElement);

    await userEvent.type(editor, 'status:success');

    await waitFor(() => {
      const leaves = getLeafNodes(canvasElement);
      expect(leaves).toHaveLength(2);
      expect(leaves[0]).toHaveTextContent('abc');
      expect(leaves[0]).toHaveClass('bg-tag-error-bg');
      expect(leaves[1]).toHaveTextContent('status:success');
      expect(leaves[1]).not.toHaveClass('bg-tag-error-bg');
    });

    expect(editor).not.toHaveClass('shadow-border-error');
  },
};

export const ClosesSuggestionsAndRestoresSelectionAfterBlur: Story = {
  render: (args) => <RegressionHarness {...args} />,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const editor = await getEditor(canvasElement);
    const outsideButton = await canvas.findByRole('button', {name: 'Outside blur target'});

    await userEvent.click(editor);
    await userEvent.type(editor, 'status:');

    await waitFor(() => {
      expect(screen.getByText('success')).toBeInTheDocument();
    });

    await userEvent.click(outsideButton);
    await expectSuggestionClosed('success');

    await userEvent.click(editor);
    await expectSelectionInEditor(editor);

    await userEvent.type(editor, 'success');

    await waitFor(() => {
      const leaves = getLeafNodes(canvasElement);
      expect(leaves.some((leaf) => leaf.textContent?.includes('status:success'))).toBe(true);
    });
  },
};

export const BlurWithErrorAndOpenSelectorKeepsEditorUsable: Story = {
  render: (args) => <RegressionHarness {...args} />,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const editor = await getEditor(canvasElement);
    const outsideButton = await canvas.findByRole('button', {name: 'Outside blur target'});

    await userEvent.click(editor);
    await userEvent.type(editor, 'abc ');
    await expectFirstLeafInvalid(canvasElement);

    await userEvent.type(editor, 'status:');

    await waitFor(() => {
      expect(screen.getByText('success')).toBeInTheDocument();
    });

    await userEvent.click(outsideButton);
    await expectSuggestionClosed('success');

    await waitFor(() => {
      const leaves = getLeafNodes(canvasElement);
      expect(leaves[0]).toHaveTextContent('abc');
      expect(leaves[0]).toHaveClass('bg-tag-error-bg');
    });

    await userEvent.click(editor);
    await expectSelectionInEditor(editor);

    await userEvent.type(editor, 'success');

    await waitFor(() => {
      const leaves = getLeafNodes(canvasElement);
      expect(leaves).toHaveLength(2);
      expect(leaves[0]).toHaveTextContent('abc');
      expect(leaves[0]).toHaveClass('bg-tag-error-bg');
      expect(leaves[1]).toHaveTextContent('status:success');
      expect(leaves[1]).not.toHaveClass('bg-tag-error-bg');
    });
  },
};
