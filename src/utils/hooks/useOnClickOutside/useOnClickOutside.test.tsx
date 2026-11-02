import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { useOnClickOutside } from './useOnClickOutside';

const onClickMockFn = jest.fn();

describe('useOnClickOutside', () => {
  const user = userEvent.setup();
  const ref = createRef<HTMLDivElement>();

  function Component(): JSX.Element {
    return <div ref={ref}>Test</div>;
  }

  it('runs provided function if user clicks outside element', async () => {
    render(<Component />);
    renderHook(() => useOnClickOutside({ ref, handler: onClickMockFn }));

    await user.click(document.body);

    expect(onClickMockFn).toHaveBeenCalledTimes(1);
  });

  it('doesn`t run provided function if user clicks on element', async () => {
    render(<Component />);
    renderHook(() => useOnClickOutside({ ref, handler: onClickMockFn }));

    const element = screen.getByText('Test');

    await user.click(element);

    expect(onClickMockFn).toHaveBeenCalledTimes(0);
  });
});
