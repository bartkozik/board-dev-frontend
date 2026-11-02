import { ReactNode, useRef } from 'react';
import ReactDOM from 'react-dom';
import { RemoveScroll } from 'react-remove-scroll';
import clsx from 'clsx';
import Icon, { icons } from '@/theme/icon';
import { useOnClickOutside } from '@/utils/hooks';
import styles from './Modal.module.scss';

interface ModalProps {
  children: ReactNode;
  className?: string;
  close: () => void;
  isOpen: boolean;
  title?: string;
}

function Modal({ children, className = '', close, isOpen, title }: ModalProps): JSX.Element | null {
  const modalRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside({ ref: modalRef, handler: close });

  if (isOpen) {
    const component = (
      <RemoveScroll>
        <div className={styles.overlay}>
          <div
            className={clsx(styles.modal, className, { [styles.active]: isOpen })}
            ref={modalRef}
            aria-modal="true"
            role="dialog"
          >
            {title && <h2 className={styles.title}>{title}</h2>}
            <button onClick={close} className={styles.closeBtn}>
              <Icon icon={icons.close} />
            </button>

            {children}
          </div>
        </div>
      </RemoveScroll>
    );

    return ReactDOM.createPortal(component, document.body);
  }

  return null;
}

export default Modal;
