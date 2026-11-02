import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChangeEvent, useState } from 'react';
import Input, { InputType } from '@/theme/input';

const inputName = 'Test name';
const inputLabel = 'Test label';
const testValue = 'Test value';
const placeholderText = 'Test placeholder text';

function InputWithState({ type }: { type?: InputType }): JSX.Element {
  const [inputValue, setInputValue] = useState('');

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setInputValue(e.currentTarget.value);
  };

  return <Input type={type} name={inputName} value={inputValue} onChange={handleChangeValue} />;
}

describe(`Input`, () => {
  it(`renders with provided props`, () => {
    render(<Input name={inputName} label={inputLabel} type="text" value={testValue} placeholder={placeholderText} />);

    const inputTextArea = screen.getByRole('textbox');

    const inputAriaLabel = screen.getByLabelText(`${inputName} input`);
    const label = screen.getByText(inputLabel);
    const inputPlaceholderText = screen.getByPlaceholderText(placeholderText);

    expect(inputTextArea).toBeEnabled();
    expect(inputAriaLabel).toBeInTheDocument();
    expect(inputTextArea).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(inputPlaceholderText).toBeInTheDocument();
  });

  it(`renders disabled when disabled attribute passed`, () => {
    render(<Input name={inputName} label={inputLabel} type="text" value={testValue} disabled />);

    const inputTextArea = screen.getByRole('textbox');

    expect(inputTextArea).toBeDisabled();
  });

  it('input is focused when button is clicked', async () => {
    render(<InputWithState />);

    const user = userEvent;
    const inputTextArea = screen.getByRole('textbox');

    await user.click(inputTextArea);

    expect(inputTextArea).toHaveFocus();
  });

  it('text input has typed text', async () => {
    render(<InputWithState />);

    const user = userEvent;
    const inputTextArea = screen.getByRole('textbox');

    await user.type(inputTextArea, 'Test text');

    expect(inputTextArea).toHaveValue('Test text');
  });

  it('number input has typed number', async () => {
    render(<InputWithState type="number" />);

    const user = userEvent;
    const inputTextArea = screen.getByRole('spinbutton');

    await user.type(inputTextArea, '123');

    expect(inputTextArea).toHaveValue(123);
  });

  it('should not allow letters to be typed when type is set to number', async () => {
    render(<InputWithState type="number" />);

    const user = userEvent;
    const inputTextArea = screen.getByRole('spinbutton');

    await user.type(inputTextArea, 'Test text');

    expect(inputTextArea).toHaveValue(null);
    expect(inputTextArea).toHaveAttribute('type', 'number');
  });
});
