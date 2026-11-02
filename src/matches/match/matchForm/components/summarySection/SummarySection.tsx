import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { Actions, SummaryForm } from '@/matches/match/components';
import { MatchFormType } from '@/matches/types';
import DetailsLayout from '@/theme/detailsLayout';
import LoadingArea from '@/theme/loadingArea';
import styles from './SummarySection.module.scss';

interface SummarySectionProps {
  areUsersSelected: boolean;
  formMethods: UseFormReturn<MatchFormType>;
  loading: boolean;
}

const SummarySection = ({ areUsersSelected, formMethods, loading }: SummarySectionProps): JSX.Element => {
  const { matchStore } = useStores();
  const { match, generateSummary, setIsEditing, updateMatch } = matchStore;

  const updateSummaries = (summary?: { shortSummary: string; longSummary: string }): void => {
    const shortSummary = summary?.shortSummary || '';
    const longSummary = summary?.longSummary || '';
    formMethods.setValue('shortSummary', shortSummary);
    formMethods.setValue('longSummary', longSummary);
    updateMatch({ shortSummary, longSummary });
  };

  const generateSummaryAndSetValues = (): void => {
    generateSummary('').then((summary) => summary && updateSummaries(summary));
  };

  useEffect(() => {
    if (areUsersSelected && (!match.shortSummary || !match.longSummary)) {
      generateSummaryAndSetValues();
      setIsEditing(true);
    }
  }, [areUsersSelected]);

  if (!areUsersSelected) return <></>;

  return (
    <LoadingArea loading={loading} text="Generating the summary">
      <Actions withoutBorder rightAligned withoutEditButton />
      <DetailsLayout className={styles.detailsLayout}>
        <SummaryForm formMethods={formMethods} onChange={updateMatch} />
      </DetailsLayout>
    </LoadingArea>
  );
};

export default observer(SummarySection);
