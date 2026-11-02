import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { useStores } from '@/RootStore';
import Icon, { icons, iconSize } from '@/theme/icon';
import IconButton from '@/theme/iconButton';
import { ToastType } from '../types';
import styles from './Toast.module.scss';

interface ToastProps {
  children: React.ReactNode;
  id: string;
  timeout?: number;
  type?: ToastType;
}

const ICON_MAP = {
  error: <Icon icon={icons.sad} />,
  success: <Icon icon={icons.tick} size={iconSize.medium} />,
  warning: <Icon icon={icons.exclamationMark} />,
};

const LABEL_MAP = {
  error: 'Error',
  success: 'Confirmation',
  warning: 'Warning',
};

function Toast({ children, id, timeout = 6000, type = 'success' }: ToastProps): JSX.Element {
  const { toastsStore } = useStores();
  const { removeToast } = toastsStore;

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), timeout);
    return () => clearTimeout(timer);
  }, [id, removeToast, timeout]);

  return (
    <div className={clsx(styles.root, styles[type])}>
      <IconButton icon={icons.close} className={styles.closeIcon} onClick={() => removeToast(id)} />
      <div className={clsx(styles.icon, styles[`icon-${type}`])}>{ICON_MAP[type]}</div>
      <div className={styles.textContainer}>
        <span className={clsx(styles.label, styles[`text-${type}`])}>{LABEL_MAP[type]}</span>
        <div className={clsx(styles.childrenContainer, styles[`text-${type}`])}>{children}</div>
      </div>
    </div>
  );
}

export default observer(Toast);
