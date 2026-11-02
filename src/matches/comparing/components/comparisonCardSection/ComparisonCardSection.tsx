import { Section } from '@/matches/types';
import { User } from '@/users/types';
import ComparisonFieldsGroup from '../comparisonFieldsGroup';

interface ComparisonCardSectionProps {
  section: Section;
  user?: User;
  isComparedCardSection?: boolean;
  rowHeights?: Record<string, number>;
}

const ComparisonCardSection = ({
  section,
  user,
  isComparedCardSection = false,
  rowHeights,
}: ComparisonCardSectionProps): JSX.Element => {
  const { title, fields, subsections } = section;
  const isSectionWithSubsections = Boolean(subsections?.length);

  return (
    <>
      <ComparisonFieldsGroup
        groupTitle={title}
        groupFields={fields || []}
        user={user}
        isComparedCardSection={isComparedCardSection}
        isSectionWithSubsections={isSectionWithSubsections}
        rowHeights={rowHeights}
      />

      {subsections?.map((subsection) => (
        <ComparisonFieldsGroup
          key={subsection.id}
          groupTitle={subsection.title}
          groupFields={subsection.fields || []}
          user={user}
          isComparedCardSection={isComparedCardSection}
          isSectionWithSubsections={isSectionWithSubsections}
          rowHeights={rowHeights}
          isSubsection
        />
      ))}
    </>
  );
};

export default ComparisonCardSection;
