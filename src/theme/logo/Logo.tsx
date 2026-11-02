import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { routes } from '@/app/routes';
import styles from './Logo.module.scss';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  withoutRedirect?: boolean;
}

const Logo = ({ withoutRedirect = false, size = 'medium' }: LogoProps = {}): JSX.Element => {
  const redirectTo = withoutRedirect ? '' : routes.Dashboard.path();

  return (
    <Link className={clsx(styles.root, styles[size], { [styles.noCursor]: withoutRedirect })} to={redirectTo}>
      <img src="/boardDev.png" alt="logo" />
    </Link>
  );
};

export default Logo;
