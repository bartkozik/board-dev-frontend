import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { icons } from '@/theme/icon';
import IconButton from '@/theme/iconButton';

const icon = icons.close;
const onClickMockFn = jest.fn();

describe(`IconButton`, () => {
  it(`renders with the icon when a correct icon provided`, () => {
    const button = render(<IconButton icon={icon} onClick={onClickMockFn} />);
    expect(button).toBeTruthy();
  });

  it(`fires onClick callback when button is clicked`, async () => {
    const user = userEvent.setup();

    render(<IconButton icon={icon} onClick={onClickMockFn} />);

    const iconButton = screen.getByRole('button');
    expect(iconButton).toBeEnabled();

    await user.click(iconButton);

    expect(onClickMockFn).toBeCalledTimes(1);
  });
});
