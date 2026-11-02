import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { CustomFormQuestion } from '@/corporateClients/types';
import Checkbox from '@/theme/checkbox';
import Input from '@/theme/input';
import { RawUserRole } from '@/users/types';
import styles from './CustomFormQuestionRow.module.scss';

interface CustomFormQuestionRowProps {
  sectionKey: RawUserRole;
  question: CustomFormQuestion;
  questionIndex: number;
  previousQuestionValue?: string;
}

const CustomFormQuestionRow = ({
  sectionKey,
  question,
  questionIndex,
  previousQuestionValue,
}: CustomFormQuestionRowProps): JSX.Element => {
  const { corporateClientStore } = useStores();
  const { setQuestionValue, toggleIsQuestionRequired } = corporateClientStore;

  const isDisabled = questionIndex > 0 && !previousQuestionValue;
  const isCheckboxDisabled = isDisabled || !question.value;

  useEffect(() => {
    if (isDisabled) setQuestionValue(sectionKey, question.id, '');
  }, [isDisabled, sectionKey, question.id, setQuestionValue]);

  useEffect(() => {
    if (!question.value && question.required) toggleIsQuestionRequired(sectionKey, question.id);
  }, [question.value, question.required, sectionKey, question.id, toggleIsQuestionRequired]);

  return (
    <div key={question.id} className={styles.root}>
      <Input
        name={`${sectionKey}-${question.id}`}
        maxWidth
        label={question.label}
        value={question.value}
        onChange={(e) => setQuestionValue(sectionKey, question.id, e.target.value)}
        disabled={isDisabled}
      />
      <div className={styles.checkboxContainer}>
        <Checkbox
          className={styles.checkbox}
          labelClassName={styles.checkboxLabel}
          name={`required-${sectionKey}-${question.id}`}
          checked={question.required}
          label="The question is required"
          onChange={() => toggleIsQuestionRequired(sectionKey, question.id)}
          disabled={isCheckboxDisabled}
        />
      </div>
    </div>
  );
};

export default observer(CustomFormQuestionRow);
