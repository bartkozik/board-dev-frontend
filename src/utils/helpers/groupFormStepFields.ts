import { ConfigFieldKind, FormElementConfig } from '@/forms/types';

export function groupFormStepFields(formConfig: Record<string, FormElementConfig[]>): Record<string, string[]> {
  return Object.keys(formConfig).reduce((acc, stepKey) => {
    const stepConfig = formConfig[stepKey];

    acc[stepKey] = stepConfig
      .filter((field) => !field.optional)
      .flatMap((field) => {
        if (field.type === ConfigFieldKind.MultipleScale) return field.scales.map((scale) => scale.key);
        return [field.name];
      });

    return acc;
  }, {} as Record<string, string[]>);
}
