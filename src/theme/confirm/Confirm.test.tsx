import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Confirm from '@/theme/confirm';

const onClickYesMockFn = jest.fn();
const onClickCancelMockFn = jest.fn();

const testYesText = 'Test yes text';
const testQuestion = 'Do you want to confirm';

describe(`Confirm`, () => {
  it(`renders provided props`, () => {
    const { getByText } = render(
      <Confirm action={onClickYesMockFn} close={onClickCancelMockFn} question={testQuestion} yesText={testYesText} />
    );

    const questionText = getByText(testQuestion);
    const acceptButton = getByText(testYesText);

    expect(questionText).toBeInTheDocument();
    expect(questionText).toBeVisible();
    expect(acceptButton).toBeInTheDocument();
    expect(acceptButton).toBeVisible();
  });

  it(`fires confirm action when confirm button is clicked`, async () => {
    render(
      <Confirm action={onClickYesMockFn} close={onClickCancelMockFn} question={testQuestion} yesText={testYesText} />
    );

    const user = userEvent.setup();

    const button = screen.getByText(testYesText);
    await user.click(button);

    expect(button).toBeInTheDocument();
    expect(onClickYesMockFn).toBeCalledTimes(1);
  });

  it(`fires cancel action when cancel button is clicked`, async () => {
    render(
      <Confirm action={onClickYesMockFn} close={onClickCancelMockFn} question={testQuestion} yesText={testYesText} />
    );

    const user = userEvent.setup();

    const button = screen.getByText('Cancel');
    await user.click(button);

    expect(button).toBeInTheDocument();
    expect(onClickCancelMockFn).toBeCalledTimes(1);
  });

  it(`doesn't fire confirm and cancel actions after confirm and cancel buttons are clicked when submitting is truthy`, async () => {
    render(
      <Confirm
        action={onClickYesMockFn}
        close={onClickCancelMockFn}
        question={testQuestion}
        yesText={testYesText}
        submitting
      />
    );

    const user = userEvent.setup();
    const buttons = screen.getAllByRole('button');

    await user.click(buttons[0]);
    await user.click(buttons[1]);

    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
    expect(onClickYesMockFn).toBeCalledTimes(0);
    expect(onClickCancelMockFn).toBeCalledTimes(0);
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });
});
