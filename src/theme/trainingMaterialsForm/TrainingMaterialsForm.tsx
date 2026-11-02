import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TrainingMaterialsFormData } from '@/domain/zodSchemas';
import DetailsLayout from '@/theme/detailsLayout';
import LoadingArea from '@/theme/loadingArea';
import PageHeader from '@/theme/pageHeader';
import Input from '../input';
import styles from './TrainingMaterialsForm.module.scss';

interface TrainingMaterialsProps {
  title: string;
  subtitle?: string;
  formMethods: UseFormReturn<TrainingMaterialsFormData>;
  dataChangeDisabled?: boolean;
  children?: ReactNode;
  loading?: boolean;
}

const TrainingMaterialsForm = ({
  title,
  subtitle,
  formMethods,
  dataChangeDisabled,
  children,
  loading = false,
}: TrainingMaterialsProps): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = formMethods;

  return (
    <DetailsLayout loading={loading}>
      <LoadingArea loading={loading}>
        <PageHeader className={styles.title} title={title} titleSize="small" />
        <form className={styles.trainingMaterialsContainer}>
          {subtitle && <span>{subtitle}</span>}
          {children}
          <Input
            {...register('trainingMaterialsUrl')}
            name="trainingMaterialsUrl"
            label="Training materials URL:"
            error={errors.trainingMaterialsUrl?.message}
            disabled={dataChangeDisabled}
            maxWidth
          />
        </form>
      </LoadingArea>
    </DetailsLayout>
  );
};

export default TrainingMaterialsForm;
