import { UseFormReturn } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import Actions from '@/matches/match/components/actions';
import { MatchFormType } from '@/matches/types';
import CustomPrompt from '@/theme/customPrompt';
import MarkdownEditArea from '@/theme/markdownEditArea';
import SummaryPreview from '@/theme/summaryPreview';
import SummaryWrapper from '@/theme/summaryWrapper';
import styles from './SummaryForm.module.scss';

const SUMMARY_FORM_FIELDS = [
  { key: 'shortSummary', label: 'Short summary' },
  { key: 'longSummary', label: 'Long summary' },
] as const;

interface SummaryFormProps {
  formMethods: UseFormReturn<MatchFormType>;
  onChange: (match: Partial<MatchFormType>) => void;
}

const SummaryForm = ({ formMethods, onChange }: SummaryFormProps): JSX.Element => {
  const { matchStore } = useStores();
  const { generateSummary, submitting, match, isEditing } = matchStore;
  const {
    control,
    setValue,
    formState: { errors },
  } = formMethods;

  const handleClickRegenerate = (prompt: string): void => {
    generateSummary(prompt).then((summary) => {
      if (summary) {
        setValue('shortSummary', summary.shortSummary);
        setValue('longSummary', summary.longSummary);
        onChange({ shortSummary: summary.shortSummary, longSummary: summary.longSummary });
      }
    });
  };

  return (
    <SummaryWrapper>
      <div className={styles.root}>
        {isEditing && (
          <>
            <CustomPrompt onClick={handleClickRegenerate} loading={submitting} />
            {SUMMARY_FORM_FIELDS.map(({ key, label }) => (
              <MarkdownEditArea
                key={key}
                name={key}
                control={control}
                label={label}
                error={errors[key]?.message}
                defaultValue={formMethods.getValues(key)}
                onChange={(value) => {
                  formMethods.setValue(key, value);
                  onChange({ [key]: value });
                }}
              />
            ))}
          </>
        )}
        {!isEditing && <SummaryPreview long={match.longSummary} short={match.shortSummary} />}
        <Actions />
      </div>
    </SummaryWrapper>
  );
};

export default observer(SummaryForm);
