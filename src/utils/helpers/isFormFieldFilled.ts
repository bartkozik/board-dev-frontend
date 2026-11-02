import { NpoChecklist } from '@/forms/NPOform/types';
import { TechLeaderChecklist } from '@/forms/techLeaderForm/types';
import { ConfigFieldKind, FormElementConfig } from '@/forms/types';

function isOtherValueFilled(
  fieldConfigName: string,
  suffix: string,
  currentForm: Record<string, string | number | boolean | NpoChecklist | TechLeaderChecklist>
): boolean {
  const otherValueKey = `${fieldConfigName}${suffix}`;
  const otherValue = currentForm[otherValueKey];
  return Boolean(otherValue);
}

export function isFormFieldFilled(
  fieldConfig: FormElementConfig,
  fieldValue: string | number | boolean | NpoChecklist | TechLeaderChecklist,
  currentForm: Record<string, string | number | boolean | NpoChecklist | TechLeaderChecklist>
): boolean {
  if (fieldValue === undefined || fieldValue === null || fieldValue === '') return false;

  switch (fieldConfig.type) {
    case ConfigFieldKind.Checklist: {
      const selectedOptions = Object.entries(fieldValue as Record<string, boolean>).filter(([, selected]) => selected);
      if (selectedOptions.length === 0) return false;

      const otherSelected = selectedOptions.some(([option]) => option === 'other');
      if (otherSelected) return isOtherValueFilled(fieldConfig.name, 'OtherValue', currentForm);

      return true;
    }

    case ConfigFieldKind.Radio:
    case ConfigFieldKind.Select: {
      if (fieldValue === 'other') return isOtherValueFilled(fieldConfig.name, 'OtherValue', currentForm);

      return true;
    }

    default:
      return Boolean(fieldValue);
  }
}
