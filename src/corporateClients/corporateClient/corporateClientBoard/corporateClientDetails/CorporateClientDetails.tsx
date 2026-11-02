import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import DetailsTable, { Detail } from '@/theme/detailsTable';
import styles from './CorporateClientDetails.module.scss';

const CorporateClientDetails = (): JSX.Element | null => {
  const {
    corporateClientStore: { corporateClient },
  } = useStores();

  const detailsMap: Detail[] = [
    { label: 'Company name', value: corporateClient?.name || '---' },
    { label: 'Date created', value: corporateClient?.formatedCreatedAt || '---' },
  ];

  return (
    <div className={styles.root}>
      <div className={styles.corporateClientInfo}>
        <DetailsTable details={detailsMap} />
      </div>
    </div>
  );
};

export default observer(CorporateClientDetails);
