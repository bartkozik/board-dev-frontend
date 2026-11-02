import { ReactNode } from 'react';
import styles from './FormQuestion.module.scss';

interface FormQuestionProps {
  question: ReactNode;
  instruction?: string;
}

const FormQuestion = ({ question, instruction }: FormQuestionProps): JSX.Element => {
  return (
    <div>
      <p className={styles.question}>{question}</p>
      {instruction && <p className={styles.instruction}>{instruction}</p>}
    </div>
  );
};

export default FormQuestion;
