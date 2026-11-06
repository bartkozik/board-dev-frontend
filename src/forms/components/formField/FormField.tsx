import { z } from 'zod';
import { ChangeEvent, ReactNode } from 'react';
import { Control } from 'react-hook-form';
import {
  BASE_FOCUS_AREA_FORM_KEY,
  DELL_FOCUS_AREA_FORM_KEY,
  HIDDEN_FOR_DELL_FORM_FIELDS,
} from '@/corporateClients/CUSTOM_FORM_DATA_FOR_DELL_TECH/dellFormData';
import { NpoChecklist } from '@/forms/NPOform/types';
import { TechLeaderChecklist } from '@/forms/techLeaderForm/types';
import {
  ChecklistField,
  ConfigFieldKind,
  FormConfig,
  FormConfigSetup,
  FormElementConfig,
  NpoFormValueType,
  TechLeaderFormValueType,
} from '@/forms/types';
import Checkbox from '@/theme/checkbox';
import Checklist from '@/theme/checklist';
import FormScale from '@/theme/formScale';
import Input from '@/theme/input';
import RadioGroup from '@/theme/radioGroup';
import Select, { SelectOption } from '@/theme/select/Select';
import TextArea from '@/theme/textArea';
import ControlledFormField from '../controlledFormField';
import FormQuestion from '../formQuestion';
import OtherValueInput from '../otherValueInput';
import styles from './FormField.module.scss';

const checklistFieldValidation = z.record(z.boolean());

const EIN_LINK = 'https://www.irs.gov/businesses/non-profit-organizations/non-profit-organizations-ein';
const ROLE_DESCRIPTION_LINK = 'https://example.invalid/role-description';
const ROLE_DESCTIPTION_QUESTIONS_KEYS = ['roleDescriptionConcerns', 'roleDescriptionExcitement'];

interface DellFieldFlags {
  isHidden: boolean;
  isFocusAreaTextArea: boolean;
  isFocusAreaChecklist: boolean;
}

const getCustomForDellFieldFlags = (fieldKey: string, isDellUser: boolean): DellFieldFlags => ({
  isHidden: HIDDEN_FOR_DELL_FORM_FIELDS.includes(fieldKey) && isDellUser,
  isFocusAreaTextArea: fieldKey === DELL_FOCUS_AREA_FORM_KEY,
  isFocusAreaChecklist: fieldKey === BASE_FOCUS_AREA_FORM_KEY,
});

interface FormFieldProps<T extends NpoFormValueType | TechLeaderFormValueType> {
  item: FormElementConfig;
  control: Control;
  formSetup: FormConfigSetup;
  activeStep: number;
  getValues: (name: string) => string | string[];
  clearValidationErrors: (keys: string[]) => void;
  updateForm: (key: string, value: T) => void;
  updateUserFormField: (config: FormConfig, name: string, value: string | string[]) => void;
  isDellUser?: boolean;
}

const FormField = <T extends string | number | boolean | NpoChecklist | TechLeaderChecklist>({
  item,
  control,
  clearValidationErrors,
  updateForm,
  updateUserFormField,
  getValues,
  formSetup,
  activeStep,
  isDellUser = false,
}: FormFieldProps<T>): JSX.Element | null => {
  const organizationEinSublabel = (
    <span>
      (For US-based organizations. If you don't know, try looking up via{' '}
      <a href={EIN_LINK} target="_blank" rel="noopener noreferrer">
        Charity Navigator
      </a>
      )
    </span>
  );

  const replaceRoleDescriptionWithLink = (itemName: string, itemLabel: string): ReactNode => {
    if (ROLE_DESCTIPTION_QUESTIONS_KEYS.includes(itemName)) {
      const roleDescriptionSplitedStringArr = itemLabel.split('role description');

      return (
        <>
          {roleDescriptionSplitedStringArr[0]}
          <a href={ROLE_DESCRIPTION_LINK} target="_blank" rel="noopener noreferrer">
            role description
          </a>
          {roleDescriptionSplitedStringArr[1]}
        </>
      );
    }

    return itemLabel;
  };

  const { isHidden, isFocusAreaTextArea, isFocusAreaChecklist } = getCustomForDellFieldFlags(item.name, isDellUser);

  switch (item.type) {
    case ConfigFieldKind.Input:
      if (isHidden) return null;
      else
        return (
          <ControlledFormField name={item.name} control={control}>
            {(field, fieldState) => (
              <Input
                name={item.name}
                label={item.label}
                secondaryLabel={item.secondaryLabel ? organizationEinSublabel : null}
                maxWidth
                value={typeof field.value === 'string' ? field.value : ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  field.onChange(e);
                  clearValidationErrors([item.name]);
                  updateForm(item.name, e.target.value as T);
                  updateUserFormField(formSetup.config, item.name, getValues(item.name));
                }}
                error={fieldState.error?.message}
              />
            )}
          </ControlledFormField>
        );

    case ConfigFieldKind.Checkbox:
      return (
        <ControlledFormField name={item.name} control={control}>
          {(field, fieldState) => (
            <Checkbox
              label={item.label}
              checked={!!field.value}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const checked = e.target.checked;
                field.onChange(checked);
                clearValidationErrors([item.name]);
                updateForm(item.name, checked as T);
                updateUserFormField(formSetup.config, item.name, checked.toString());
              }}
              error={fieldState.error?.message}
              name={''}
            />
          )}
        </ControlledFormField>
      );

    case ConfigFieldKind.Textarea:
      if (isFocusAreaTextArea && !isDellUser) return null;
      else
        return (
          <ControlledFormField name={item.name} control={control}>
            {(field, fieldState) => (
              <TextArea
                name={item.name}
                label={<FormQuestion question={replaceRoleDescriptionWithLink(item.name, item.label)} />}
                value={typeof field.value === 'string' ? field.value : ''}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  field.onChange(e);
                  clearValidationErrors([item.name]);
                  updateForm(item.name, e.target.value as T);
                  updateUserFormField(formSetup.config, item.name, getValues(item.name));
                }}
                error={fieldState.error?.message}
              />
            )}
          </ControlledFormField>
        );

    case ConfigFieldKind.Radio:
      return (
        <ControlledFormField name={item.name} control={control}>
          {(field, fieldState) => {
            const isOtherSelected = field.value === 'other';
            const otherValue = getValues(`${item.name}OtherValue`);

            return (
              <RadioGroup
                name={item.name}
                groupLabel={<FormQuestion question={item.label} />}
                options={item.options}
                selectedValue={typeof field.value === 'string' ? field.value : ''}
                onChange={(value: string) => {
                  const newValue = isOtherSelected ? `other: ${otherValue}` : value;
                  field.onChange(value);
                  updateForm(item.name, value as T);

                  clearValidationErrors([item.name]);
                  clearValidationErrors([`${item.name}OtherValue`]);

                  updateUserFormField(formSetup.config, item.name, newValue);
                }}
                error={fieldState.error?.message}
              >
                {isOtherSelected && (
                  <OtherValueInput
                    formConfig={formSetup}
                    item={item}
                    onChange={(key: string, value: string) => {
                      updateForm(key, value as T);
                      updateUserFormField(formSetup.config, item.name, `other: ${value}`);
                    }}
                  />
                )}
              </RadioGroup>
            );
          }}
        </ControlledFormField>
      );

    case ConfigFieldKind.Select:
      if (isHidden) return null;
      else
        return (
          <ControlledFormField name={item.name} control={control}>
            {(field, fieldState) => {
              const isOtherSelected = field.value === 'other';
              const otherValue = getValues(`${item.name}OtherValue`);

              return (
                <Select
                  name={item.name}
                  label={item.label}
                  options={item.options}
                  value={typeof field.value === 'string' ? field.value : ''}
                  onSelect={(option: SelectOption) => {
                    const isOther = option.value === 'other';
                    const newValue = isOther ? `other: ${otherValue}` : option.value;
                    field.onChange(option.value);
                    updateForm(item.name, option.value as T);

                    clearValidationErrors([item.name]);
                    clearValidationErrors([`${item.name}OtherValue`]);

                    updateUserFormField(formSetup.config, item.name, newValue);
                  }}
                  error={fieldState.error?.message}
                >
                  {isOtherSelected && (
                    <OtherValueInput
                      formConfig={formSetup}
                      item={item}
                      onChange={(key: string, value: string) => {
                        updateForm(key, value as T);
                        updateUserFormField(formSetup.config, item.name, `other: ${value}`);
                      }}
                    />
                  )}
                </Select>
              );
            }}
          </ControlledFormField>
        );

    case ConfigFieldKind.Checklist:
      if (isFocusAreaChecklist && isDellUser) return null;
      else
        return (
          <ControlledFormField name={item.name} control={control}>
            {(field, fieldState) => {
              const checklistValue = checklistFieldValidation.safeParse(field.value);
              const values = checklistValue.success ? checklistValue.data : {};

              const fields = item.fields?.map((fieldItem: ChecklistField) => ({
                label: fieldItem.label,
                value: Boolean(values[fieldItem.key]),
                key: fieldItem.key,
              }));

              const isOtherSelected = Boolean(values['other']);
              const otherValue = getValues(`${item.name}OtherValue`);

              return (
                <Checklist
                  label={<FormQuestion question={item.label} instruction={item.instruction} />}
                  listItems={fields}
                  maxSelection={item.maxSelections}
                  onChange={(value: boolean, key: string) => {
                    const updatedChecklist: NpoChecklist | TechLeaderChecklist = {
                      ...values,
                      [key]: value,
                    };

                    field.onChange(updatedChecklist);
                    updateForm(item.name, updatedChecklist as T);

                    const selectedKeys = Object.keys(updatedChecklist).filter((checkKey) => updatedChecklist[checkKey]);

                    const values = selectedKeys.map((selectedKey) => {
                      if (selectedKey === 'other' && otherValue) return `other: ${otherValue}`;
                      else return selectedKey;
                    });

                    clearValidationErrors([item.name]);
                    if (!isOtherSelected) clearValidationErrors([`${item.name}OtherValue`]);

                    updateUserFormField(formSetup.config, item.name, values);
                  }}
                  error={fieldState.error?.message}
                  name={item.name}
                >
                  {isOtherSelected && (
                    <OtherValueInput
                      formConfig={formSetup}
                      item={item}
                      onChange={(key: string, value: string) => {
                        const selectedKeys = fields.filter((field) => field.value).map((field) => field.key);
                        updateForm(key, value as T);
                        updateUserFormField(formSetup.config, item.name, [...selectedKeys, `other: ${value}`]);
                      }}
                    />
                  )}
                </Checklist>
              );
            }}
          </ControlledFormField>
        );

    case ConfigFieldKind.Scale:
      return (
        <ControlledFormField name={item.name} control={control}>
          {(field, fieldState) => (
            <div className={styles.scaleSection}>
              {item.sectionTitle && <h2>{item.sectionTitle}</h2>}
              <FormQuestion question={item.label} />
              <FormScale
                scale={item.scale}
                selectedValue={typeof field.value === 'number' ? field.value : 0}
                onSelect={(value: number): void => {
                  field.onChange(value);
                  updateForm(item.name, value as T);
                  updateUserFormField(formSetup.config, item.name, value.toString());
                  clearValidationErrors([item.name]);
                }}
              />
              <span className={styles.error}>{fieldState.error?.message as string}</span>
            </div>
          )}
        </ControlledFormField>
      );

    case ConfigFieldKind.MultipleScale:
      return (
        <div className={styles.multipleScaleSection} key={item.name}>
          {activeStep === 2 && item.label.includes('1') && (
            <span className={styles.title}>How much do you agree or disagree with the following statements</span>
          )}
          <h2 className={styles.sectionTitle}>{item.label}</h2>
          {item.instruction && <div className={styles.itemSubtitle}>{item.instruction}</div>}
          {item.scales.map((scale) => (
            <ControlledFormField key={scale.key} name={scale.key} control={control}>
              {(field, fieldState) => (
                <div className={styles.scaleContainer}>
                  <FormQuestion question={scale.label} />
                  <FormScale
                    {...field}
                    onSelect={(value: number) => {
                      field.onChange(value);
                      clearValidationErrors([scale.key]);
                      updateForm(scale.key, value as T);
                      updateUserFormField(formSetup.config, scale.key, value.toString());
                    }}
                    selectedValue={typeof field.value === 'number' ? field.value : 0}
                  />
                  <span className={styles.error}>{fieldState.error?.message}</span>
                </div>
              )}
            </ControlledFormField>
          ))}
        </div>
      );

    default:
      return null;
  }
};

export default FormField;
