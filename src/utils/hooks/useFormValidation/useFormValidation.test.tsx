import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TestForm from './TestForm';

describe('useFormValidation Hook via TestForm Component', () => {
  it('should not display errors when valid values are provided', async () => {
    render(<TestForm />);

    fireEvent.change(screen.getByTestId('userName'), { target: { value: 'validUser' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'validPass123' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.queryByTestId('userNameError')).not.toBeInTheDocument();
      expect(screen.queryByTestId('passwordError')).not.toBeInTheDocument();
    });
  });

  it('should display errors when invalid values are provided', async () => {
    render(<TestForm />);

    fireEvent.change(screen.getByTestId('userName'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: '123' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByTestId('userNameError')).toHaveTextContent('User name is required');
      expect(screen.getByTestId('passwordError')).toHaveTextContent('Password must be at least 6 characters long');
    });
  });

  it('should clear specific validation errors', async () => {
    render(<TestForm />);

    fireEvent.change(screen.getByTestId('userName'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: '123' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByTestId('userNameError')).toHaveTextContent('User name is required');
      expect(screen.getByTestId('passwordError')).toHaveTextContent('Password must be at least 6 characters long');
    });

    fireEvent.click(screen.getByTestId('clearUserNameError'));

    await waitFor(() => {
      expect(screen.queryByTestId('userNameError')).not.toBeInTheDocument();
      expect(screen.getByTestId('passwordError')).toHaveTextContent('Password must be at least 6 characters long');
    });
  });

  it('should clear multiple validation errors at once', async () => {
    render(<TestForm />);

    fireEvent.change(screen.getByTestId('userName'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: '123' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByTestId('userNameError')).toHaveTextContent('User name is required');
      expect(screen.getByTestId('passwordError')).toHaveTextContent('Password must be at least 6 characters long');
    });

    fireEvent.click(screen.getByTestId('clearUserNameError'));

    fireEvent.click(screen.getByTestId('resetValidation'));

    await waitFor(() => {
      expect(screen.queryByTestId('userNameError')).not.toBeInTheDocument();
      expect(screen.queryByTestId('passwordError')).not.toBeInTheDocument();
    });
  });

  it('should reset validation errors to initial state', async () => {
    render(<TestForm />);

    fireEvent.change(screen.getByTestId('userName'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: '123' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByTestId('userNameError')).toHaveTextContent('User name is required');
      expect(screen.getByTestId('passwordError')).toHaveTextContent('Password must be at least 6 characters long');
    });

    fireEvent.click(screen.getByTestId('resetValidation'));

    await waitFor(() => {
      expect(screen.queryByTestId('userNameError')).not.toBeInTheDocument();
      expect(screen.queryByTestId('passwordError')).not.toBeInTheDocument();
    });
  });

  it('should not throw error when attempting to clear non-existent validation errors', async () => {
    render(<TestForm />);

    fireEvent.change(screen.getByTestId('userName'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'validPass123' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByTestId('userNameError')).toHaveTextContent('User name is required');
      expect(screen.queryByTestId('passwordError')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('clearInvalidUserNameError'));

    await waitFor(() => {
      expect(screen.getByTestId('userNameError')).toHaveTextContent('User name is required');
      expect(screen.queryByTestId('passwordError')).not.toBeInTheDocument();
    });
  });
});
