import { supportInfo } from '@/domain/supportInfo';
import SupportInfo from '@/theme/supportInfo/SupportInfo';
import styles from '../Login.module.scss';

interface InvalidTokenMessageProps {
  errorMessage?: string;
}

const InvalidTokenMessage = ({ errorMessage }: InvalidTokenMessageProps): React.JSX.Element => {
  return (
    <>
      <div className={styles.error}>{errorMessage}</div>
      <SupportInfo supportInfo={supportInfo.CONTACT} />
    </>
  );
};
export default InvalidTokenMessage;
