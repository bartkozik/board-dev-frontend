import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropdownMenu, { DropdownItem } from '@/theme/dropdownMenu';

const testText = 'Test text';
const actionMockFn = jest.fn();
const ChildComponent = (): JSX.Element => <div>{testText}</div>;
const testMenuActions: DropdownItem[] = [{ id: 'testAction', label: 'Test action', action: actionMockFn }];

describe(`DropdownMenu`, () => {
  it(`renders when correct actions provided`, () => {
    const dropdownMenuElement = render(<DropdownMenu items={testMenuActions} />);

    expect(dropdownMenuElement).toBeTruthy();
  });

  it(`renders with children when provided`, () => {
    render(
      <DropdownMenu items={testMenuActions}>
        <ChildComponent />
      </DropdownMenu>
    );

    expect(screen.getByText(testText)).toBeInTheDocument();
    expect(screen.queryByText(testText)).toBeVisible();
  });

  it(`renders with hidden content by default then open menu  on button click after that close on click outside DropdownMenuList or second click on button`, async () => {
    render(<DropdownMenu items={testMenuActions} />);

    const user = userEvent.setup();
    const button = screen.getByRole('button');

    await user.click(button);

    const listItem = screen.getByText('Test action');
    const list = listItem.parentElement as HTMLElement;
    const parentDiv = list.parentElement as HTMLElement;

    expect(parentDiv).toHaveClass('showDropdown');

    expect(parentDiv).toBeVisible();

    await user.click(document.body);

    expect(parentDiv).not.toHaveClass('showDropdown');

    await user.click(button);

    expect(parentDiv).toHaveClass('showDropdown');

    await user.click(button);

    expect(parentDiv).not.toHaveClass('showDropdown');
  });

  it(`fires onClick DropdownItem action when DropdownItem is clicked`, async () => {
    const { getByText } = render(<DropdownMenu items={testMenuActions} />);

    const user = userEvent.setup();
    const actionItem = getByText(testMenuActions[0].label);

    await user.click(actionItem);

    const listItem = getByText('Test action');
    const list = listItem.parentElement as HTMLElement;
    const parentDiv = list.parentElement as HTMLElement;

    expect(actionItem).toBeInTheDocument();
    expect(actionMockFn).toBeCalledTimes(1);
    expect(parentDiv).not.toHaveClass('showDropdown');
  });
});
