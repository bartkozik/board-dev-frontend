import React from 'react';
import { z } from 'zod';
import { useFormValidation } from './useFormValidation';

const testSchema = z.object({
  userName: z.string().nonempty({ message: 'User name is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

const TestForm: React.FC = () => {
  const { formMethods, resetValidation, clearValidationErrors } = useFormValidation(testSchema);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const onSubmit = (data: any): void => {
    console.log('Submitted data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="userName">User Name:</label>
        <input id="userName" {...register('userName')} data-testid="userName" />
        {errors.userName && <span data-testid="userNameError">{errors.userName.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input id="password" type="password" {...register('password')} data-testid="password" />
        {errors.password && <span data-testid="passwordError">{errors.password.message}</span>}
      </div>

      <button type="submit">Submit</button>
      <button type="button" onClick={() => clearValidationErrors(['userName'])} data-testid="clearUserNameError">
        Clear User Name Error
      </button>
      <button type="button" onClick={resetValidation} data-testid="resetValidation">
        Reset Validation
      </button>
      <button
        type="button"
        onClick={() => clearValidationErrors(['invalidUserName'] as any)}
        data-testid="clearInvalidUserNameError"
      >
        Clear Invalid UserName Error
      </button>
    </form>
  );
};

export default TestForm;
