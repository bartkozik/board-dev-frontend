import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import styles from './Loader.module.scss';

interface LoaderProps {
  className?: string;
  loading: boolean;
  small?: boolean;
  white?: boolean;
}

const Loader = ({ className = '', loading, small = false, white = false }: LoaderProps): JSX.Element => {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition in={loading} timeout={2000} classNames="loader-transition" unmountOnExit nodeRef={nodeRef}>
      <div ref={nodeRef} className={clsx(styles.root, className)}>
        <span className={clsx(styles.loader, { [styles.small]: small, [styles.white]: white })} />
      </div>
    </CSSTransition>
  );
};

export default Loader;
