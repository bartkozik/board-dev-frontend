import React from 'react';
import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import Logo from '@/theme/logo';
import styles from './Layout.module.scss';
import Navbar from './navbar';
import UserMenu from './userMenu';

const Layout = (): React.JSX.Element => {
  const { authStore } = useStores();

  return (
    <div className={styles.root}>
      <nav className={styles.navbar}>
        <Logo size="small" />
        <Navbar />
        {authStore.isAuthenticated && <UserMenu />}
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default observer(Layout);
