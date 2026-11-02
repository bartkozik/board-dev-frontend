import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import Button from '@/theme/button';
import Icon, { icons, iconSize } from '@/theme/icon';
import styles from './AddCorporateClient.module.scss';
import AddCorporateClientModal from './components';

const AddCorporateClient = (): JSX.Element => {
  const { corporateClientsStore } = useStores();
  const { loading: loadingCorporateClients } = corporateClientsStore;
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Button
        className={styles.button}
        text="Add company"
        onClick={() => setIsModalOpen(true)}
        icon={<Icon ariaLabel="Add company" icon={icons.addUser} size={iconSize.medium} />}
        type="button"
        disabled={loadingCorporateClients}
      />
      <AddCorporateClientModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
    </>
  );
};

export default observer(AddCorporateClient);
