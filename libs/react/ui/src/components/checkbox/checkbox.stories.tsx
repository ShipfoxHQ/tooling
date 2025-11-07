import type {Meta, StoryObj} from '@storybook/react';
import {Code, Header} from 'components/typography';
import {Checkbox, CheckboxLabel, CheckboxLinks} from '.';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {control: 'boolean'},
    checked: {control: 'boolean'},
  },
  args: {
    size: 'md',
    disabled: false,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col gap-16">
        <Header variant="h4">Controlled Checkbox</Header>
        <Code variant="label" className="text-foreground-neutral-subtle">
          Use the controls below to change the checkbox state
        </Code>
        <Checkbox {...args} />
      </div>

      <div className="flex flex-col gap-32">
        <Header variant="h4">All States</Header>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <div key={size} className="flex flex-wrap gap-16">
            <Header variant="h4">Size: {size}</Header>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Unchecked
              </Code>
              <Checkbox size={size} />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Checked
              </Code>
              <Checkbox size={size} checked />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Indeterminate
              </Code>
              <Checkbox size={size} checked="indeterminate" />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Disabled (Unchecked)
              </Code>
              <Checkbox size={size} disabled />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Disabled (Checked)
              </Code>
              <Checkbox size={size} checked disabled />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Focus
              </Code>
              <Checkbox size={size} className="focus" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    pseudo: {
      focusVisible: '.focus',
    },
  },
};

export const CheckboxLabelStory: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-32 pb-64 pt-32 px-32 bg-background-neutral-base">
      <Code variant="label" className="text-foreground-neutral-subtle">
        CHECKBOX LABEL - WITHOUT BORDER
      </Code>
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Default - Unchecked
          </Code>
          <CheckboxLabel
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
          />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Hover - Unchecked
          </Code>
          <CheckboxLabel
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            className="hover"
          />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Default - Checked
          </Code>
          <CheckboxLabel
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            checked
          />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Hover - Checked
          </Code>
          <CheckboxLabel
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            checked
            className="hover"
          />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Default - Indeterminate
          </Code>
          <CheckboxLabel
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            checked="indeterminate"
          />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Disabled - Checked
          </Code>
          <CheckboxLabel
            label="Label"
            checked
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            disabled
          />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Disabled - Unchecked
          </Code>
          <CheckboxLabel
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            disabled
          />
        </div>
      </div>

      <Code variant="label" className="text-foreground-neutral-subtle mt-32">
        CHECKBOX LABEL - WITH BORDER
      </Code>
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Default - Unchecked
          </Code>
          <CheckboxLabel
            id="checkbox-border-default-unchecked"
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            border
          />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Hover - Unchecked
          </Code>
          <CheckboxLabel
            id="checkbox-border-hover-unchecked"
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            border
            className="hover"
          />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Focus - Unchecked
          </Code>
          <CheckboxLabel
            id="checkbox-border-focus-unchecked"
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            border
            className="focus"
          />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Default - Checked
          </Code>
          <CheckboxLabel
            id="checkbox-border-default-checked"
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            checked
            border
          />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Hover - Checked
          </Code>
          <CheckboxLabel
            id="checkbox-border-hover-checked"
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            checked
            border
            className="hover"
          />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Focus - Checked
          </Code>
          <CheckboxLabel
            id="checkbox-border-focus-checked"
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            checked
            border
            className="focus"
          />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Default - Indeterminate
          </Code>
          <CheckboxLabel
            id="checkbox-border-default-indeterminate"
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            checked="indeterminate"
            border
          />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Disabled - Unchecked
          </Code>
          <CheckboxLabel
            id="checkbox-border-disabled-unchecked"
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            disabled
            border
          />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Disabled - Checked
          </Code>
          <CheckboxLabel
            id="checkbox-border-disabled-checked"
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            checked
            disabled
            border
          />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle text-xs">
            Disabled - Indeterminate
          </Code>
          <CheckboxLabel
            id="checkbox-border-disabled-indeterminate"
            label="Label"
            optional
            showInfoIcon
            description="The quick brown fox jumps over a lazy dog."
            checked="indeterminate"
            disabled
            border
          />
        </div>
      </div>
    </div>
  ),
};

CheckboxLabelStory.parameters = {
  pseudo: {
    hover: '.hover',
    focusVisible: '.focus',
  },
};

export const CheckboxLinksStory: StoryObj = {
  args: {
    disabled: true,
  },

  render: () => (
    <div className="flex flex-col gap-32 pb-64 pt-32 px-32 bg-background-neutral-base">
      <Code variant="label" className="text-foreground-neutral-subtle">
        CHECKBOX LINKS
      </Code>
      <div className="flex flex-col gap-16">
        <CheckboxLinks
          id="checkbox-links-default"
          label="Accept policies"
          links={[
            {label: 'Terms of use', href: '#'},
            {label: 'Privacy Policy', href: '#'},
          ]}
        />
        <CheckboxLinks
          id="checkbox-links-checked"
          label="Accept policies"
          links={[
            {label: 'Terms of use', href: '#'},
            {label: 'Privacy Policy', href: '#'},
          ]}
          checked
        />
      </div>
    </div>
  ),
};
