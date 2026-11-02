import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Card.module.scss';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps): JSX.Element => {
  return <div className={clsx(styles.root, className)}>{children}</div>;
};

interface SectionProps extends CardProps {
  withoutBackground?: boolean;
}

const Section = ({ children, withoutBackground, className }: SectionProps): JSX.Element => {
  return (
    <div className={clsx(styles.section, { [styles.sectionWithBackground]: !withoutBackground }, className)}>
      {children}
    </div>
  );
};

Card.Section = Section;

export default Card;
