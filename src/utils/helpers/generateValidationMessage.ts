interface GenerateValidationMessageData {
  validation: Record<number, boolean>;
  message: string;
}

export const generateValidationMessage = ({ validation, message }: GenerateValidationMessageData): string => {
  const invalidFields = Object.keys(validation)
    .filter((field) => !validation[Number(field)])
    .map(Number);

  if (invalidFields.length === 0) return '';

  if (invalidFields.length === 1) return `${message} ${invalidFields[0]}`;

  const lastField = invalidFields.pop();
  return `${message} ${invalidFields.join(', ')} & ${lastField}`;
};
