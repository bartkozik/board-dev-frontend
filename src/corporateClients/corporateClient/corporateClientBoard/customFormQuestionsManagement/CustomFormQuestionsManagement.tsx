import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { CustomFormQuestion } from '@/corporateClients/types';
import DetailsLayout from '@/theme/detailsLayout';
import PageHeader from '@/theme/pageHeader';
import { RawUserRole } from '@/users/types';
import styles from './CustomFormQuestionsManagement.module.scss';
import CustomFormQuestionSection from './components/customFormQuestionSection';

export type CustomFormSection = {
  title: string;
  questions: CustomFormQuestion[];
  sectionKey: RawUserRole;
};

const CustomFormQuestionsManagement = (): JSX.Element => {
  const { userId: corporateClientId } = useParams();
  const { corporateClientStore } = useStores();
  const { customFormQuestions, fetchCustomFormQuestions } = corporateClientStore;

  useEffect(() => {
    if (corporateClientId) fetchCustomFormQuestions(corporateClientId);
  }, [corporateClientId, fetchCustomFormQuestions]);

  const sections: CustomFormSection[] = [
    {
      title: 'For tech leaders:',
      questions: customFormQuestions.techLeader,
      sectionKey: RawUserRole.TechLeader,
    },
    {
      title: 'For nonprofits:',
      questions: customFormQuestions.npo,
      sectionKey: RawUserRole.NPO,
    },
  ];

  return (
    <DetailsLayout>
      <PageHeader className={styles.title} title="You can add up to five questions to the form" titleSize="small" />
      {sections.map((section, sectionIndex) => (
        <CustomFormQuestionSection key={section.sectionKey} section={section} sectionIndex={sectionIndex} />
      ))}
    </DetailsLayout>
  );
};

export default observer(CustomFormQuestionsManagement);
