import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import { useStores } from '@/RootStore';
import { RawCustomFormQuestion } from '@/corporateClients/types';
import { NPO_FORM_CONFIG, NPO_STEPS } from '@/forms/NPOform/npoFormConfig';
import { NpoChecklist, NpoFormType } from '@/forms/NPOform/types';
import { NPO_ESTIMATED_TIME_IN_MINUTES, TECH_LEADER_ESTIMATED_TIME_IN_MINUTES } from '@/forms/constants';
import { TECH_LEADER_FORM_CONFIG, TECH_LEADER_STEPS } from '@/forms/techLeaderForm/techLeaderFormConfig';
import { TechLeaderFormType } from '@/forms/techLeaderForm/types';
import { ADDITIONAL_QUESTIONS_KEY, FormConfig, Step } from '@/forms/types';
import { RawUserRole } from '@/users/types';
import { convertCustomQuestionsToFormConfig, createFormSchema } from '@/utils/helpers';

export interface FormConfigReturn {
  formConfig: FormConfig;
  steps: Step[];
  schema: z.ZodType<TechLeaderFormType | NpoFormType>;
  form: TechLeaderFormType | { [x: string]: string | number | boolean | NpoChecklist };
  estimatedTime: number;
}

export const useGenerateFormConfig = (
  customQuestions: RawCustomFormQuestion[],
  userRole: RawUserRole
): FormConfigReturn => {
  const { techLeaderFormStore, npoFormStore, formStore } = useStores();
  const { techLeaderForm } = techLeaderFormStore;
  const { initializeCustomFormStringFields } = formStore;
  const { npoForm } = npoFormStore;
  const isNPO = userRole === RawUserRole.NPO;

  const formConfig = { ...(isNPO ? NPO_FORM_CONFIG : TECH_LEADER_FORM_CONFIG) };

  const additionalQuestions = convertCustomQuestionsToFormConfig(customQuestions, userRole);

  const additionalQuestionKeys = useMemo(
    () => additionalQuestions.map((question) => question.name),
    [additionalQuestions]
  );

  useEffect(() => {
    if (additionalQuestions.length > 0) initializeCustomFormStringFields(additionalQuestionKeys, isNPO);
  }, [additionalQuestions]);

  const configKey = ADDITIONAL_QUESTIONS_KEY[userRole];

  if (formConfig[configKey]) formConfig[configKey] = [...additionalQuestions, ...formConfig[configKey]];

  const steps = isNPO ? NPO_STEPS : TECH_LEADER_STEPS;
  const schema = createFormSchema(customQuestions, userRole);

  const form = isNPO ? npoForm : techLeaderForm;
  const estimatedTime = isNPO ? NPO_ESTIMATED_TIME_IN_MINUTES : TECH_LEADER_ESTIMATED_TIME_IN_MINUTES;

  return { formConfig, steps, schema, form, estimatedTime };
};
