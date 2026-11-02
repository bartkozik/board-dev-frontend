import { render, screen } from '@testing-library/react';
import Toast from '@/toasts/toast';

const id = 'testId';
const key = 'testKey';
const Text = <p>Test text</p>;
const testTime = 3000;
const toastType = 'error';

beforeAll(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe(`Toast`, () => {
  it(`renders with default properties `, () => {
    render(
      <Toast id={id} key={key}>
        {Text}
      </Toast>
    );

    expect(screen.getByText('Test text')).toBeInTheDocument();
    expect(screen.getByText('Confirmation')).toBeInTheDocument();
  });

  it(`fires the remove function after 6 seconds if different time is not provided `, () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    render(
      <Toast id={id} key={key}>
        {Text}
      </Toast>
    );

    expect(screen.getByText('Test text')).toBeVisible();

    expect(setTimeout).toBeCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 6000);
  });

  it(`renders with custom properties and fires the remove function after provided time `, () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    render(
      <Toast id={id} key={key} timeout={testTime} type={toastType}>
        {Text}
      </Toast>
    );

    expect(screen.getByText('Test text')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();

    expect(setTimeout).toBeCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), testTime);
  });
});
