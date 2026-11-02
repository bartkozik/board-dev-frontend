import { config as npoFormConfig } from '@/forms/NPOform/constants';
import { config as techLeaderFormConfig } from '@/forms/techLeaderForm/constants';
import { ChecklistConfig, ConfigFieldKind, SelectConfig } from '@/forms/types';
import { comparingSectionsConfig } from '@/matches/comparing/comparingSectionsConfig';
import { getValueByKeyName } from '@/matches/comparing/utils';
import { Field, Section, Subsection } from '@/matches/types';
import { NonAdminUserRole, RawUserRole, User, UserRole } from '@/users/types';
import { downloadXLS, getUserFormData } from '@/utils/helpers';

interface UseExportComparisonToXLSReturn {
  exportComparisonToXLS: (options: ExportOptions) => void;
}

export interface ExportOptions {
  baseUser: User;
  comparedUsers: User[];
}

const generateHeaders = (comparedUsers: User[]): string =>
  comparedUsers.map((user) => `<th style="width: 150px;">${user.name} (${UserRole[user.roles[0]]})</th>`).join('');

const getFieldLabels = (keyName: string, user: User, type: ConfigFieldKind): string => {
  const userAnswers = getUserFormData(user, keyName)?.value.split(';') || [];
  const flattenedConfig = user.roles[0] === RawUserRole.TechLeader ? techLeaderFormConfig : npoFormConfig;
  const lowerKey = keyName.toLowerCase();
  const configField = flattenedConfig.find((field) => field.name.toLowerCase() === lowerKey) as
    | ChecklistConfig
    | SelectConfig;

  if (!configField) return '';

  const getChecklistLabels = (checklist: ChecklistConfig): string =>
    userAnswers
      .map((selectedKey: string) => checklist.fields?.find((opt) => opt.key === selectedKey)?.label || selectedKey)
      .join('<br />');

  const getSelectLabels = (select: SelectConfig): string =>
    select.options
      ?.filter((opt) => userAnswers.includes(opt.value))
      .map((opt) => opt.label)
      .join('<br />') || '';

  return type === ConfigFieldKind.Checklist
    ? getChecklistLabels(configField as ChecklistConfig)
    : getSelectLabels(configField as SelectConfig);
};

const getValue = (field: Field, user: User): string => {
  if (field.keyName === 'RequireBoardMembersLocation') {
    const userAnswers = getUserFormData(user, 'RequireBoardMembersLocation')?.value.split(';') || [];
    const require = userAnswers[0] === 'yes' ? '' : 'do not ';
    return `${require}require board members to be located in this city`;
  }
  return field.type === ConfigFieldKind.Checklist || field.type === ConfigFieldKind.Select
    ? getFieldLabels(field.keyName, user, field.type)
    : getValueByKeyName(field.keyName, user)?.toString() || '';
};

const generateSectionRows = (
  section: Section,
  comparedSection: Section,
  baseUser: User,
  comparedUsers: User[]
): string =>
  section.fields
    ?.map((field: Field, index) => {
      const comparedField = comparedSection?.fields?.[index];
      const baseValue = getValue(field, baseUser);
      const comparedValues = comparedUsers
        .map(
          (user) => `<td valign="top" style="width: 150px;">${comparedField ? getValue(comparedField, user) : ''}</td>`
        )
        .join('');

      return `<tr>
        <td valign="top" style="width: 200px;">${field.label}</td>
        <td valign="top" style="width: 150px;">${baseValue}</td>
        ${comparedValues}
      </tr>`;
    })
    .join('') || '';

const generateSubsectionRows = (
  subsections: Subsection[],
  comparedSubsections: Subsection[],
  baseUser: User,
  comparedUsers: User[]
): string =>
  subsections
    .map((subsection: Subsection) => {
      const comparedSubsection = comparedSubsections.find((sub) => sub.id === subsection.id) as Subsection;
      const subsectionRows = generateSectionRows(subsection, comparedSubsection, baseUser, comparedUsers);
      return `<tr>
        <td colspan="${comparedUsers.length + 2}" style="width: 100%;"><strong>${subsection.title}</strong></td>
      </tr>${subsectionRows}`;
    })
    .join('');

const generateRoleRows = (role: NonAdminUserRole, baseUser: User, comparedUsers: User[]): string => {
  const sections = comparingSectionsConfig[role];

  return sections
    .map((section: Section) => {
      const comparedSection = comparingSectionsConfig[comparedUsers[0].roles[0] as NonAdminUserRole].find(
        (sec) => sec.id === section.id
      ) as Section;
      const sectionHeader = `<tr>
        <td colspan="${comparedUsers.length + 2}" style="width: 100%;"><strong>${section.title}</strong></td>
      </tr>`;
      const sectionRows = section.fields ? generateSectionRows(section, comparedSection, baseUser, comparedUsers) : '';
      const subsectionRows =
        section.subsections && comparedSection.subsections
          ? generateSubsectionRows(section.subsections, comparedSection.subsections, baseUser, comparedUsers)
          : '';

      return sectionHeader + sectionRows + subsectionRows;
    })
    .join('');
};

const createTableContent = (baseUser: User, comparedUsers: User[]): string => {
  const colgroup = `
    <colgroup>
      <col style="width: 200px;">
      <col style="width: 150px;">
      ${comparedUsers.map(() => '<col style="width: 150px;">').join('')}
    </colgroup>
  `;

  const headers = `
    <tr>
      <th style="width: 200px;">Field / Name</th>
      <th style="width: 150px;">${baseUser.name} (${UserRole[baseUser.roles[0]]})</th>
      ${generateHeaders(comparedUsers)}
    </tr>
  `;

  const rows = generateRoleRows(baseUser.roles[0] as NonAdminUserRole, baseUser, comparedUsers);

  return `<table border="1">${colgroup}${headers}${rows}</table>`;
};

export const useExportComparisonToXLS = (): UseExportComparisonToXLSReturn => {
  const exportComparisonToXLS = ({ baseUser, comparedUsers }: ExportOptions): void => {
    const tableContent = createTableContent(baseUser, comparedUsers);
    const fileName = `comparison-${baseUser.name}.xls`;
    downloadXLS(tableContent, fileName);
  };

  return { exportComparisonToXLS };
};
