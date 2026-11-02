import type { Meta, StoryObj } from '@storybook/react';
import Confirm from './Confirm';

const meta = {
  title: 'Atoms/Confirm',
  component: Confirm,
  parameters: {
    layout: 'centered',
  },
  args: {
    action: () => alert('Done'),
    close: () => alert('Close'),
    question: 'Proceed to checkout?',
  },
} satisfies Meta<typeof Confirm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: meta.args,
};

export const Submitting: Story = {
  args: {
    ...meta.args,
    submitting: true,
  },
};

export const CustomYesText: Story = {
  args: {
    ...meta.args,
    yesText: 'Confirm',
  },
};
