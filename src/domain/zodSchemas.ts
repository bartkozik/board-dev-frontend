import { z } from 'zod';
import { formValidationMessages } from './formValidationMessages';

export const userFormSchema = z
  .object({
    email: z.string().min(1, formValidationMessages.EMAIL_REQUIRED).email(formValidationMessages.EMAIL_INVALID),
    name: z.string().min(1, formValidationMessages.NAME_REQUIRED),
    organizationName: z.string(),
    roles: z
      .array(
        z.enum(['TechLeader', 'NPO', 'Admin'], {
          errorMap: () => ({ message: formValidationMessages.ROLE_REQUIRED }),
        })
      )
      .min(1, formValidationMessages.ROLE_REQUIRED),
    corporateClientId: z.string().optional(),
  })
  .refine((data) => !(data.roles.includes('NPO') && !data.organizationName), {
    path: ['organizationName'],
    message: formValidationMessages.ORGANIZATION_NAME_REQUIRED,
  });

export const corporateClientFormSchema = z.object({
  name: z.string().min(1, formValidationMessages.COMPANY_NAME_REQUIRED),
});

export const trainingMaterialsSchema = z.object({
  trainingMaterialsUrl: z.union([
    z.literal(''),
    z.string().url("Please enter a valid URL starting with 'http://' or 'https://'."),
  ]),
  accessToTrainingMaterials: z.boolean().optional(),
  accessToCompanyTrainingMaterials: z.boolean().optional(),
});

export type TrainingMaterialsFormData = z.infer<typeof trainingMaterialsSchema>;
