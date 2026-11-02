import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { CustomFormSection } from '../../CustomFormQuestionsManagement';
import CustomFormQuestionRow from '../customFormQuestionRow';
import styles from './CustomFormQuestionSection.module.scss';

interface CustomFormQuestionSectionProps {
  section: CustomFormSection;
  sectionIndex: number;
}

const CustomFormQuestionSection = ({ section, sectionIndex }: CustomFormQuestionSectionProps): JSX.Element => (
  <div
    key={section.sectionKey}
    className={clsx(styles.root, {
      [styles.sectionWithTopBorder]: sectionIndex % 2 === 1,
    })}
  >
    <h3 className={styles.sectionTitle}>{section.title}</h3>
    {section.questions.map((question, questionIndex) => {
      const previousQuestionValue = section.questions[questionIndex - 1]?.value;
      return (
        <CustomFormQuestionRow
          key={question.id}
          sectionKey={section.sectionKey}
          question={question}
          questionIndex={questionIndex}
          previousQuestionValue={previousQuestionValue}
        />
      );
    })}
  </div>
);

export default observer(CustomFormQuestionSection);
