import { useState } from 'react';
import Button from '../button';
import TextArea from '../textArea';
import styles from './CustomPrompt.module.scss';

interface CustomPromptProps {
  onClick: (prompt: string) => void;
  loading?: boolean;
}

const CustomPrompt = ({ onClick, loading }: CustomPromptProps): JSX.Element => {
  const [prompt, setPrompt] = useState('');

  return (
    <>
      <TextArea
        placeholder="Enter custom prompt"
        label="Prompt"
        name="prompt"
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />
      <Button text="Regenerate" onClick={() => onClick(prompt)} loading={loading} className={styles.button} />
    </>
  );
};

export default CustomPrompt;
