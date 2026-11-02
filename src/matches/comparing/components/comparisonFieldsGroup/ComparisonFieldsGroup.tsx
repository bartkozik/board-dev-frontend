import clsx from 'clsx';
import { Section } from '@/matches/types';
import AlignmentBar from '@/theme/alignmentBar';
import Card from '@/theme/card';
import { User } from '@/users/types';
import FieldsTable from '../fieldsTable';
import styles from './ComparisonFieldsGroup.module.scss';

interface ComparisonFieldsGroupProps {
  groupTitle: string;
  groupFields: Section['fields'];
  user?: User;
  isComparedCardSection?: boolean;
  isSectionWithSubsections?: boolean;
  isSubsection?: boolean;
  rowHeights?: Record<string, number>;
}

export const ComparisonFieldsGroup = ({
  groupTitle,
  groupFields,
  user,
  isComparedCardSection,
  isSectionWithSubsections,
  isSubsection,
  rowHeights,
}: ComparisonFieldsGroupProps): JSX.Element => {
  return (
    <>
      <AlignmentBar
        title={!isComparedCardSection ? groupTitle : ''}
        className={clsx(styles.alignmentBar, {
          [styles.alignmentBarWithSubsections]: !isSectionWithSubsections,
          [styles.subsectionAlignmentBar]: isSubsection,
        })}
      />
      <Card.Section
        withoutBackground={isSectionWithSubsections && !isSubsection}
        className={clsx({ [styles.subSectionDetails]: isSubsection })}
      >
        <FieldsTable
          fields={groupFields || []}
          user={user}
          className={clsx(styles.table, {
            [styles.withoutFieldLabel]: isComparedCardSection,
          })}
          withoutFieldLabel={isComparedCardSection}
          rowHeights={rowHeights}
        />
      </Card.Section>
    </>
  );
};

export default ComparisonFieldsGroup;
