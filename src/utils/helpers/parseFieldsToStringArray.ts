import { NPO_CAUSES } from '@/forms/NPOform/npoFormConfig';
import { TECH_LEADER_FOCUS_AREAS } from '@/forms/techLeaderForm/techLeaderFormConfig';
import { UserFormField } from '@/forms/types';

export enum SpecialKeys {
  Causes = 'causes',
  NonprofitFocusAreas = 'nonprofitFocusAreas',
  NonprofitFocusAreasDell = 'nonprofitFocusAreasDell',
}

const getLabelByKey = (key: string, config: { key: string; label: string }[]): string | null => {
  const match = config.find((item) => item.key === key);
  return match ? match.label : null;
};

const capitalizeFirstLetter = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

export const parseFieldsToStringArray = (fields: UserFormField[], isUserConnectedWithDell: boolean): string[] => {
  return fields.flatMap((field) => {
    const { key, value } = field;

    if (isUserConnectedWithDell && key === SpecialKeys.NonprofitFocusAreasDell) {
      return [capitalizeFirstLetter(value)];
    }

    const isRelevantKey =
      !isUserConnectedWithDell && (key === SpecialKeys.Causes || key === SpecialKeys.NonprofitFocusAreas);

    if (isRelevantKey) {
      return value.split(';').map((item) => {
        const trimmed = item.trim();
        const label = getLabelByKey(trimmed, NPO_CAUSES) || getLabelByKey(trimmed, TECH_LEADER_FOCUS_AREAS);

        return label || capitalizeFirstLetter(trimmed);
      });
    }

    return [];
  });
};
