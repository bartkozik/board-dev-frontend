import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '@/test-utils';
import Button from '@/theme/button';
import Icon, { icons } from '@/theme/icon';

const onClickMockFn = jest.fn();
const testText = 'test';
const icon = <Icon icon={icons.tick} />;
const testHref = 'https://google.com';

describe(`Button`, () => {
  it(`renders with default props`, () => {
    const button = render(<Button />);

    expect(button).toBeTruthy();
  });

  it(`renders as a button with default props if href is not provided`, () => {
    renderWithRouter(<Button />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it(`renders as a button with custom props`, () => {
    renderWithRouter(<Button text={testText} active={true} variant="secondary" type="submit" />);

    expect(screen.getByText(testText)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('secondary');
  });

  it(`is disabled when disabled prop is true`, () => {
    const button = render(<Button text={testText} icon={icon} disabled={true} />);

    expect(button).toBeTruthy();
    expect(screen.getByText(testText)).not.toBeEnabled();
  });

  it(`renders with the icon when a correct icon component provided`, () => {
    const button = render(<Button text={testText} icon={icon} />);

    expect(button).toBeTruthy();
  });

  it(`renders without text if loading prop is truthy`, () => {
    const button = render(<Button text={testText} icon={icon} loading={true} />);

    expect(button).toBeTruthy();
    expect(screen.getByRole('button')).toContainHTML('span');
  });

  it(`fires onClick callback when button is clicked`, async () => {
    const user = userEvent.setup();

    render(<Button onClick={onClickMockFn} />);

    const button = screen.getByRole('button');
    expect(button).toBeEnabled();

    await user.click(button);

    expect(onClickMockFn).toBeCalledTimes(1);
  });

  it(`renders as a Link element if path is provided`, () => {
    renderWithRouter(<Button to="/" text={testText} />);

    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it(`renders as a Link with the icon when a correct path and icon provided`, () => {
    const button = renderWithRouter(<Button to="/" icon={icon} text={testText} />);

    expect(button).toBeTruthy();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it(`renders as a link element with the correct link href when href provided`, () => {
    render(<Button text={testText} externalHref={testHref} />);

    expect(screen.getByRole(`link`)).toHaveAttribute(`href`, testHref);
  });
});
