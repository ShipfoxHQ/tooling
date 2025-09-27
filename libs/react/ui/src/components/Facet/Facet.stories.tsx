import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {Facet} from './Facet';
import type {FacetValueData} from './FacetValue';

const meta: Meta<typeof Facet> = {
  title: 'Molecules/Facet',
  component: Facet,
};
export default meta;

type Story = StoryObj<typeof Facet>;

export const ListFacet: Story = {
  args: {
    id: 'status',
    name: 'Status',
    className: 'w-48',
  },
  render: (args) => {
    const [values, setValues] = useState<FacetValueData[]>([
      {
        value: 'success',
        label: 'Succeeded',
        count: 45749,
        isSelected: true,
        isOnlyValueSelected: false,
      },
      {
        value: 'failure',
        label: 'Failed',
        count: 4892,
        isSelected: true,
        isOnlyValueSelected: false,
      },
      {value: 'skip', label: 'Skipped', count: 543, isSelected: true, isOnlyValueSelected: false},
    ]);

    function onInclude(_id: string, value: string | null) {
      setValues((prev) =>
        prev.map((prevValue) => ({
          ...prevValue,
          isSelected: prevValue.value === value ? true : prevValue.isSelected,
        })),
      );
    }

    function onExclude(_id: string, value: string | null) {
      setValues((prev) =>
        prev.map((prevValue) => ({
          ...prevValue,
          isSelected: prevValue.value === value ? false : prevValue.isSelected,
        })),
      );
    }

    function onSelect(_id: string, value: string | null | undefined) {
      const selectAll = value === null;
      setValues((prev) =>
        prev.map((prevValue) => ({
          ...prevValue,
          isSelected: selectAll ? true : prevValue.value === value,
          isOnlyValueSelected: prevValue.value === value,
        })),
      );
    }

    return (
      <Facet
        {...args}
        type="list"
        values={values}
        onInclude={onInclude}
        onExclude={onExclude}
        onSelect={onSelect}
      />
    );
  },
};

export const RangeFacet: Story = {
  args: {
    id: 'duration',
    name: 'Duration',
    className: 'w-48',
  },
  render: (args) => {
    const [value, setValue] = useState<[number, number]>([0, 100]);

    return (
      <Facet
        {...args}
        type="range"
        min={0}
        max={100}
        value={value}
        onValueChange={(_, value) => setValue(value)}
      />
    );
  },
};
