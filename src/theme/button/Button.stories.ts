import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    text: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    type: 'button',
    variant: 'secondary',
    text: 'Secondary Button',
  },
};

export const Loading: Story = {
  args: {
    type: 'button',
    variant: 'primary',
    loading: true,
  },
};
