import { ConfigFieldKind, FormElementConfig } from '@/forms/types';

export function createFieldConfigMap(
  formConfig: Record<string, FormElementConfig[]>
): Record<string, FormElementConfig> {
  const fieldConfigMap: Record<string, FormElementConfig> = {};

  Object.keys(formConfig).forEach((stepKey) => {
    formConfig[stepKey].forEach((field) => {
      if (field.type === ConfigFieldKind.MultipleScale) {
        field.scales.forEach((scale) => {
          fieldConfigMap[scale.key] = field;
        });
      } else fieldConfigMap[field.name] = field;
    });
  });

  return fieldConfigMap;
}
