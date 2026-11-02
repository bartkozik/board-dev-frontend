import { z } from 'zod';
import { CustomQuestionAnswerKey, CustomQuestionKey, RawCustomFormQuestion } from '@/corporateClients/types';
import { RawUserRole } from '@/users/types';
import { convertFirstLetterToLower } from './convertFirstLetterToLower';

export const createCustomQuestionsValidation = (
  customQuestions: RawCustomFormQuestion[],
  userRole: RawUserRole
): z.ZodRawShape => {
  return customQuestions
    .filter((question) => question.role === userRole && question.content)
    .reduce((acc, question) => {
      const { key, isRequired } = question;

      const keyName = Object.keys(CustomQuestionKey).find(
        (enumKey) => CustomQuestionKey[enumKey as keyof typeof CustomQuestionKey] === key
      );

      const answerKey = CustomQuestionAnswerKey[keyName as keyof typeof CustomQuestionAnswerKey];

      const validationKey = convertFirstLetterToLower(answerKey);

      const validation = isRequired ? z.string().min(1, 'This field is required') : z.string().optional();

      return { ...acc, [validationKey]: validation };
    }, {} as z.ZodRawShape);
};
