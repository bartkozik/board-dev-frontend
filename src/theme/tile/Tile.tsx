import { ReactNode } from 'react';
import styles from './Tile.module.scss';

interface TileProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

const Tile = ({ title, description, children }: TileProps): JSX.Element => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
export default Tile;
