import { UserFormField } from '@/forms/types';
import { User } from '@/users/types';

export const getUserFormData = (user: User, keyName: string): UserFormField | undefined => {
  return user?.formData?.find((field: UserFormField) => field.key === keyName);
};
