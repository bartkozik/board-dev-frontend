import { z, ZodType } from 'zod';
import { RawCustomFormQuestion } from '@/corporateClients/types';
import { NpoFormType } from '@/forms/NPOform/types';
import { TechLeaderFormType } from '@/forms/techLeaderForm/types';
import { npoFormSchemas, techLeaderFormSchemas } from '@/forms/zodSchemas';
import { RawUserRole } from '@/users/types';
import { createCustomQuestionsValidation } from './createCustomQuestionsValidation';

export const createFormSchema = (
  customQuestions: RawCustomFormQuestion[],
  userRole: RawUserRole
): ZodType<NpoFormType> | ZodType<TechLeaderFormType> => {
  const isNPO = userRole === RawUserRole.NPO;

  const baseSchema = isNPO ? npoFormSchemas : techLeaderFormSchemas;

  const baseSchemaShape = (baseSchema as z.AnyZodObject).shape;

  const customQuestionValidations = createCustomQuestionsValidation(customQuestions, userRole);

  const schemaObject: z.ZodRawShape = {
    ...baseSchemaShape,
    ...customQuestionValidations,
  };

  const schema = z.object(schemaObject);

  return schema as ZodType<NpoFormType> | ZodType<TechLeaderFormType>;
};
