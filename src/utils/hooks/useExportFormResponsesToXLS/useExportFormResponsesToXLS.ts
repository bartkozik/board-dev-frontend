import { NPO_FORM_CONFIG as npoFormConfig } from '@/forms/NPOform/npoFormConfig';
import { TECH_LEADER_FORM_CONFIG as techLeaderFormConfig } from '@/forms/techLeaderForm/techLeaderFormConfig';
import { FormElementConfig } from '@/forms/types';
import { RawUserRole, User } from '@/users/types';
import { downloadXLS } from '@/utils/helpers';
import { prepareFields, formatValue } from '@/utils/helpers/xlsTableFieldFormatter';

interface UseExportFormResponsesToXLSReturn {
  exportFormResponsesToXLS: (users: User[]) => void;
}

const htmlTable = (users: User[], fields: FormElementConfig[]): string => {
  const colgroup =
    '<colgroup><col style="width:280px">' + users.map(() => '<col style="width:160px">').join('') + '</colgroup>';

  const head = '<tr><th>Question</th>' + users.map((u) => `<th>${u.name}</th>`).join('') + '</tr>';

  const body = fields
    .map((f) => {
      const rowVals = users
        .map((u) => {
          const map = new Map([...(u.formattedFormData ?? []), ...(u.formData ?? [])].map((v) => [v.key, v]));
          return `<td>${formatValue(f, map)}</td>`;
        })
        .join('');
      return `<tr><td>${f.previewLabel ?? f.label}</td>${rowVals}</tr>`;
    })
    .join('\n');

  return `<table border="1">${colgroup}${head}${body}</table>`;
};

export const useExportFormResponsesToXLS = (): UseExportFormResponsesToXLSReturn => {
  const exportFormResponsesToXLS = (users: User[]): void => {
    if (!users.length) return;

    const tech = users.filter((u) => u.roles.includes(RawUserRole.TechLeader));
    const npo = users.filter((u) => u.roles.includes(RawUserRole.NPO));

    if (tech.length) {
      const table = htmlTable(tech, prepareFields(techLeaderFormConfig));
      downloadXLS(table, 'tech-leader-form-responses.xls');
    }

    if (npo.length) {
      const table = htmlTable(npo, prepareFields(npoFormConfig));
      downloadXLS(table, 'npo-form-responses.xls');
    }
  };

  return { exportFormResponsesToXLS };
};
