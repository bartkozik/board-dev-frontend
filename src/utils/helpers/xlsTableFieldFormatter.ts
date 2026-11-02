import {
  ChecklistConfig,
  ConfigFieldKind,
  FormConfig,
  FormElementConfig,
  MultipleScaleConfig,
  UserFormField,
} from '@/forms/types';

type UserFieldMap = Map<string, UserFormField>;

export const formatValue = (field: FormElementConfig, userFields: UserFieldMap, empty = '---'): string => {
  const userFormField = userFields.get(field.name);

  const parseOther = (v: string): string => (v.startsWith('other:') ? `Other: ${v.slice(6)}` : v);

  switch (field.type) {
    case ConfigFieldKind.Input:
    case ConfigFieldKind.Textarea:
      return userFormField && userFormField.value !== '' ? String(userFormField.value) : empty;

    case ConfigFieldKind.Select: {
      if (!userFormField) return empty;
      const opt = field.options.find((o) => o.value === userFormField.value.split(':')[0]);
      return opt ? parseOther(userFormField.value) : empty;
    }

    case ConfigFieldKind.Radio: {
      if (!userFormField) return empty;
      if (userFormField.value.startsWith('other:')) {
        return `Other: ${userFormField.value.split(':')[1]}`;
      }
      const opt = field.options.find((o) => o.value === userFormField.value);
      return opt ? String(opt.label) : empty;
    }

    case ConfigFieldKind.Checkbox:
      return userFormField ? (userFormField.value === 'true' ? 'Yes' : 'No') : empty;

    case ConfigFieldKind.Scale:
      return userFormField ? `Selected: ${userFormField.value}` : empty;

    case ConfigFieldKind.MultipleScale: {
      const m = field as MultipleScaleConfig;
      return m.scales
        .map((s) => {
          const v = userFields.get(s.key)?.value ?? '-';
          return `${s.label}: ${v}`;
        })
        .join(' | ');
    }

    case ConfigFieldKind.Checklist: {
      if (!userFormField || typeof userFormField.value !== 'string') return empty;
      const raw = userFormField.value.split(';');
      const other = raw.find((k) => k.startsWith('other:'));
      return (field as ChecklistConfig).fields
        .map((f) => {
          if (f.key === 'other' && other) return `${f.label}: ${other.slice(6)}`;
          return raw.includes(f.key) ? f.label : null;
        })
        .filter(Boolean)
        .join(', ');
    }

    default:
      return empty;
  }
};

const flattenConfig = (config: FormConfig | FormElementConfig[]): FormElementConfig[] =>
  Array.isArray(config) ? config.flat() : Object.values(config).flat();

const explodeMultipleScaleTypeFields = (fields: FormElementConfig[]): FormElementConfig[] =>
  fields.flatMap((formField) => {
    if (formField.type !== ConfigFieldKind.MultipleScale) return [formField];

    const multipleScaleFields = formField as MultipleScaleConfig;

    return multipleScaleFields.scales.map<FormElementConfig>((multipleScaleField) => ({
      ...formField,
      name: multipleScaleField.key,
      type: ConfigFieldKind.Scale,
      label: `${formField.previewLabel ?? formField.label}: ${multipleScaleField.label}`,
      previewLabel: `${formField.previewLabel ?? formField.label}: ${multipleScaleField.label}`,
    }));
  });

export const prepareFields = (cfg: FormConfig | FormElementConfig[]): FormElementConfig[] =>
  explodeMultipleScaleTypeFields(flattenConfig(cfg));
