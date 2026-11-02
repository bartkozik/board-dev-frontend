import { ReactPortal } from 'react';
import { createPortal } from 'react-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import styles from './Toasts.module.scss';
import Toast from './toast';

const Toasts = (): ReactPortal => {
  const { toastsStore } = useStores();
  const { toasts } = toastsStore;

  return createPortal(
    <div className={styles.root}>
      {toasts.map(({ id, content, type, timeout }) => (
        <Toast key={id} id={id} type={type} timeout={timeout}>
          {content}
        </Toast>
      ))}
    </div>,
    document.body
  );
};

export default observer(Toasts);
