import { render } from '@testing-library/react';
import Icon, { icons } from '@/theme/icon';

describe('Icon', () => {
  it('renders a component when the correct icon name provided', () => {
    const iconElement = render(<Icon icon={icons.close} />);

    expect(iconElement).toBeTruthy();
  });
});
