import clsx from 'clsx';
import Card from '@/theme/card';
import { User } from '@/users/types';
import { comparingSectionsConfig } from '../../comparingSectionsConfig';
import ComparisonCardSection from '../comparisonCardSection';
import styles from './ComparisonCard.module.scss';

interface ComparisonCardProps {
  user?: User;
  isComparedCard?: boolean;
  className?: string;
  rowHeights?: Record<string, number>;
}

const ComparisonCard = ({ user, isComparedCard, className, rowHeights }: ComparisonCardProps): JSX.Element => {
  if (!user) return <></>;

  const sections = user ? comparingSectionsConfig[user.roles[0]] : [];

  return (
    <Card className={clsx(styles.root, className)}>
      {sections.map((section) => (
        <ComparisonCardSection
          key={section.id}
          section={section}
          user={user}
          isComparedCardSection={isComparedCard}
          rowHeights={rowHeights}
        />
      ))}
    </Card>
  );
};

export default ComparisonCard;
