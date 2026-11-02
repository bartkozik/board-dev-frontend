import React from 'react';
import { config as npoFormConfig } from '@/forms/NPOform/constants';
import { config as techLeaderFormConfig } from '@/forms/techLeaderForm/constants';
import { ChecklistConfig, ConfigFieldKind, FormElementConfig, RadioConfig, SelectConfig } from '@/forms/types';
import RadioButton from '@/theme/radioButton';
import { RawUserRole, User } from '@/users/types';
import { getUserFormData } from '@/utils/helpers';

function getFieldDefinition(role: RawUserRole, keyName: string): FormElementConfig | null {
  const flattenedConfig = role === RawUserRole.TechLeader ? techLeaderFormConfig : npoFormConfig;

  const lowerKey = keyName.toLowerCase();
  const found = flattenedConfig.find((field) => field.name.toLowerCase() === lowerKey);

  return found ?? null;
}

const renderChecklistValue = (fieldDefinition: ChecklistConfig, userValue: string): React.ReactNode => {
  const userValueArray = userValue.split(';');

  if (!Array.isArray(userValueArray)) return '';

  const checklistLabels = userValueArray.map((selectedKey: string) => {
    const foundOption = fieldDefinition.fields?.find((opt) => opt.key === selectedKey);
    return foundOption ? foundOption.label : selectedKey;
  });

  return (
    <>
      {checklistLabels.map((label, index) => (
        <li key={index}>{label}</li>
      ))}
    </>
  );
};

const renderCheckboxValue = (userValue: string, keyName: string): React.ReactNode => {
  if (keyName === 'NonprofitBoardExperienceRequirement')
    return userValue === 'true' ? 'Experience is required' : 'Experience is not required';

  return String(userValue ?? '');
};

const renderRadioOrSelectValue = (
  fieldDefinition: RadioConfig | SelectConfig,
  userValue: string,
  keyName: string
): React.ReactNode => {
  if (!fieldDefinition.options) return String(userValue ?? '');

  if (keyName === 'RequireBoardMembersLocation') {
    const require = userValue === 'yes';
    return (
      <RadioButton
        name={keyName}
        checked={require}
        readonly
        isGrayscaled
        label={`${require ? '' : 'do not '}require board members to be located in this city`}
      />
    );
  }

  const selectedOption = fieldDefinition.options.find((opt) => opt.value === userValue);
  return selectedOption ? selectedOption.label : String(userValue ?? '');
};

export const getValueByKeyName = (keyName: string, user?: User): React.ReactNode => {
  if (!user) return '';

  const role = user.roles?.[0];

  const userField = getUserFormData(user, keyName);
  if (!userField) return '';

  const { value: userValue } = userField;

  const fieldDefinition = getFieldDefinition(role, keyName.toLowerCase());
  if (!fieldDefinition) return String(userValue ?? '');

  switch (fieldDefinition.type) {
    case ConfigFieldKind.Checklist:
      return renderChecklistValue(fieldDefinition, userValue);
    case ConfigFieldKind.Checkbox:
      return renderCheckboxValue(userValue, keyName);
    case ConfigFieldKind.Radio:
    case ConfigFieldKind.Select:
      return renderRadioOrSelectValue(fieldDefinition, userValue, keyName);

    default:
      return String(userValue ?? '');
  }
};
