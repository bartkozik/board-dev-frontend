import { CustomQuestionAnswerKey, CustomQuestionKey, RawCustomFormQuestion } from '@/corporateClients/types';
import { ConfigFieldKind, FormConfigArray } from '@/forms/types';
import { RawUserRole } from '@/users/types';
import { convertFirstLetterToLower } from './convertFirstLetterToLower';

export const convertCustomQuestionsToFormConfig = (
  customQuestions: RawCustomFormQuestion[],
  userRole: RawUserRole
): FormConfigArray => {
  return customQuestions
    .filter((customQuestion) => customQuestion.role === userRole && customQuestion.content)
    .sort((a, b) => {
      const numA = parseInt(a.key.replace('CustomQuestion', ''), 10);
      const numB = parseInt(b.key.replace('CustomQuestion', ''), 10);
      return numA - numB;
    })
    .map((customQuestion) => {
      const { key, content, isRequired } = customQuestion;

      const keyName = Object.keys(CustomQuestionKey).find(
        (enumKey) => CustomQuestionKey[enumKey as keyof typeof CustomQuestionKey] === key
      );

      const answerKey = CustomQuestionAnswerKey[keyName as keyof typeof CustomQuestionAnswerKey];

      const questionLabel = isRequired ? content : `${content} (optional)`;

      return {
        name: convertFirstLetterToLower(answerKey),
        type: ConfigFieldKind.Textarea,
        label: questionLabel,
        previewLabel: content,
        optional: !isRequired,
      };
    });
};
