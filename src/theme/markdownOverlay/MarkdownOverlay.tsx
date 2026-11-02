import Marked from 'marked-react';
import styles from './MarkdownOverlay.module.scss';

const MarkdownOverlay = ({ value }: { value: string }): JSX.Element => {
  return (
    <div className={styles.root}>
      <Marked gfm breaks>
        {value}
      </Marked>
    </div>
  );
};

export default MarkdownOverlay;
