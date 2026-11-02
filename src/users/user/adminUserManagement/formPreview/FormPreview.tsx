import { ReactElement, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { NPO_FORM_CONFIG } from '@/forms/NPOform/npoFormConfig';
import { TECH_LEADER_FORM_CONFIG } from '@/forms/techLeaderForm/techLeaderFormConfig';
import {
  ADDITIONAL_QUESTIONS_KEY,
  ChecklistConfig,
  ConfigFieldKind,
  FormConfig,
  FormConfigArray,
  FormElementConfig,
  MultipleScaleConfig,
  UserFormField,
} from '@/forms/types';
import Checkbox from '@/theme/checkbox/Checkbox';
import Chip from '@/theme/chip/Chip';
import DetailsTable, { Detail } from '@/theme/detailsTable';
import { RadioOption } from '@/theme/radioGroup/RadioGroup';
import RadioGroup from '@/theme/radioGroup/RadioGroup';
import { UserRole } from '@/users/types';
import { convertCustomQuestionsToFormConfig } from '@/utils/helpers';
import styles from './FormPreview.module.scss';

const generateDetailsFromConfig = ({
  config,
  selectedUserForm,
  additionalQuestions,
  isNpo,
}: {
  config: FormConfig;
  selectedUserForm: UserFormField[];
  additionalQuestions: FormConfigArray;
  isNpo: boolean;
}): Detail[] => {
  const userFormMap = new Map(selectedUserForm.map((uf) => [uf.key, uf]));
  const configKeyToAddQuestions = isNpo ? ADDITIONAL_QUESTIONS_KEY.NPO : ADDITIONAL_QUESTIONS_KEY.TechLeader;
  const updatedConfig = { ...config };

  if (updatedConfig[configKeyToAddQuestions])
    updatedConfig[configKeyToAddQuestions] = [...additionalQuestions, ...updatedConfig[configKeyToAddQuestions]];

  const allFields = Object.values(updatedConfig).flat();

  const details: Detail[] = allFields
    .filter((field) => !field.relatedWith)
    .map((field) => {
      const value = getValueForField(field, userFormMap, allFields);
      return { label: field.previewLabel || field.label, value };
    });

  return details;
};

const renderRelatedCheckboxes = (
  field: FormElementConfig,
  allFields: FormElementConfig[],
  userFormMap: Map<string, UserFormField>,
  userField: UserFormField | undefined
): ReactElement => {
  const relatedCheckboxes = allFields.filter((f) => f.relatedWith === field.name).map((f) => f.name);

  const checkboxValues = relatedCheckboxes.map((checkboxName) => {
    const checkboxField = userFormMap.get(checkboxName);
    const checkboxConfig = allFields.find((f) => f.name === checkboxName);

    return (
      <Checkbox
        key={checkboxName}
        name={checkboxName}
        label={checkboxConfig?.previewLabel || checkboxConfig?.label || 'Checkbox'}
        checked={checkboxField ? Boolean(checkboxField.value) : false}
        readonly
      />
    );
  });

  return (
    <div className={styles.value}>
      <span className={styles.number}>
        {userField && userField.value !== '' ? String(userField.value) : 'XX-XXXXXXX'}
      </span>
      <div className={styles.checkboxGroup}>{checkboxValues}</div>
    </div>
  );
};

const renderLink = (userField: UserFormField | undefined, emptyField: string): ReactElement | string => {
  return userField && userField.value !== '' ? (
    <a href={String(userField.value)} target="_blank" rel="noopener noreferrer">
      {String(userField.value)}
    </a>
  ) : (
    emptyField
  );
};

const renderScale = (userField: UserFormField | undefined, emptyField: string): ReactElement | string => {
  return userField ? (
    <div className={styles.scale}>
      <span>Selected scale (1-5):</span> <div className={styles.scaleValue}>{userField.value}</div>
    </div>
  ) : (
    emptyField
  );
};

const renderMultipleScale = (
  field: MultipleScaleConfig,
  userFormMap: Map<string, UserFormField>,
  emptyField: string
): ReactElement => {
  const scaleFields = field.scales.map((scale) => {
    const userScaleField = userFormMap.get(scale.key);
    return {
      label: scale.label,
      value: userScaleField ? String(userScaleField.value) : emptyField,
    };
  });

  return (
    <div className={styles.value}>
      {scaleFields.map((scaleField, index) => (
        <div key={index} className={styles.scaleField}>
          <div className={styles.scale}>
            <span>Question:</span> {scaleField.label}
          </div>
          <div className={styles.scale}>
            <span>Selected scale (1-5):</span> <div className={styles.scaleValue}>{scaleField.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const renderChecklist = (
  field: ChecklistConfig,
  userField: UserFormField | undefined,
  emptyField: string
): ReactElement | string => {
  if (userField && typeof userField.value === 'string') {
    const selectedKeys = userField.value.split(';');
    const otherEntry = selectedKeys.find((key) => key.startsWith('other:'));

    const selectedLabels = field.fields
      .map((f) => {
        if (f.key === 'other' && otherEntry) {
          const customValue = otherEntry.split(':')[1];
          return `${f.label}: ${customValue}`;
        }
        return selectedKeys.includes(f.key) ? f.label : null;
      })
      .filter((label) => label !== null);

    if (field.notChecklisted) {
      return (
        <div className={styles.value}>
          {selectedLabels.map((label, index) => (
            <Chip key={index} label={label} />
          ))}
        </div>
      );
    } else {
      return (
        <ul className={styles.value}>
          {selectedLabels.map((label, index) => (
            <li key={index} className={styles.listItem}>
              <span className={styles.dot} /> {label}
            </li>
          ))}
        </ul>
      );
    }
  } else return emptyField;
};

const getValueForField = (
  field: FormElementConfig,
  userFormMap: Map<string, UserFormField>,
  allFields: FormElementConfig[]
): string | ReactElement => {
  const emptyField = '---';
  const userField = userFormMap.get(field.name);

  const parseOtherValue = (value: string): string => {
    return value.startsWith('other:') ? `Other: ${value.replace('other:', '')}` : value;
  };

  switch (field.type) {
    case ConfigFieldKind.Input:
      if (field.relatedParent) return renderRelatedCheckboxes(field, allFields, userFormMap, userField);
      else if (field.link) return renderLink(userField, emptyField);
      else return userField && userField.value !== '' ? String(userField.value) : emptyField;

    case ConfigFieldKind.Textarea:
      return userField && userField.value !== '' ? String(userField.value) : emptyField;

    case ConfigFieldKind.Select:
      if (userField) {
        const selectedOption = field.options.find((option) => option.value === userField.value.split(':')[0]);
        const labelToShow = userField.value.startsWith('other:')
          ? parseOtherValue(userField.value)
          : (selectedOption && selectedOption.label) || '';
        return selectedOption ? labelToShow : emptyField;
      }
      return emptyField;

    case ConfigFieldKind.Radio: {
      let options = field.options as RadioOption[];
      let selectedValue = userField ? String(userField.value) : '';

      if (userField && userField.value.startsWith('other:')) {
        const otherValue = userField.value.split(':')[1];

        options = options.map((option) =>
          option.value === 'other' ? { ...option, label: `Other: ${otherValue}` } : option
        );

        selectedValue = 'other';
      }

      return <RadioGroup name={field.name} options={options} selectedValue={selectedValue} readonly />;
    }
    case ConfigFieldKind.Checkbox:
      return <Checkbox name={field.name} checked={userField ? Boolean(userField.value) : false} readonly />;

    case ConfigFieldKind.MultipleScale:
      return renderMultipleScale(field, userFormMap, emptyField);

    case ConfigFieldKind.Scale:
      return renderScale(userField, emptyField);

    case ConfigFieldKind.Checklist:
      return renderChecklist(field, userField, emptyField);

    default:
      return emptyField;
  }
};

const FormPreview = (): JSX.Element | null => {
  const { userStore, corporateClientStore } = useStores();
  const { selectedUser } = userStore;
  const { customQuestions, loadingQuestions, fetchCustomFormQuestions } = corporateClientStore;

  if (!selectedUser) return null;

  useEffect(() => {
    if (selectedUser.corporateClientId) fetchCustomFormQuestions(selectedUser.corporateClientId);
  }, [selectedUser, fetchCustomFormQuestions]);

  const isUserRoleNPO = selectedUser.type === UserRole.NPO;

  const additionalFormQuestions = convertCustomQuestionsToFormConfig(customQuestions, selectedUser.roles[0]);

  const userFormConfig = useMemo(() => {
    if (isUserRoleNPO) return NPO_FORM_CONFIG;

    const fieldToHide = selectedUser.isConnectedWithDellCompany ? 'nonprofitFocusAreas' : 'nonprofitFocusAreasDell';

    return {
      ...TECH_LEADER_FORM_CONFIG,
      1: TECH_LEADER_FORM_CONFIG[1].filter((f) => f.name !== fieldToHide),
    };
  }, [isUserRoleNPO, selectedUser.isConnectedWithDellCompany]);

  const detailsMap = generateDetailsFromConfig({
    config: userFormConfig,
    selectedUserForm: selectedUser.formattedFormData,
    additionalQuestions: additionalFormQuestions,
    isNpo: isUserRoleNPO,
  });

  return (
    <DetailsTable
      loading={loadingQuestions}
      details={detailsMap}
      className={styles.root}
      tableClassName={styles.formTable}
      isIncompleteData={!selectedUser.formCompleted}
      lastDataModification={selectedUser.formattedLastFormUpdateAt}
    />
  );
};

export default observer(FormPreview);
