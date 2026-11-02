import { ReactNode } from 'react';
import clsx from 'clsx';
import Tooltip from '../tooltip';
import styles from './Label.module.scss';

interface LabelProps {
  label: ReactNode;
  name?: string;
  className?: string;
  tooltipText?: string;
  secondaryLabel?: React.ReactNode;
}

const Label = ({ label, name, className, tooltipText, secondaryLabel }: LabelProps): JSX.Element => {
  const regularLabel = (
    <>
      <label
        className={clsx(styles.label, { [styles.labelWithoutTooltip]: !tooltipText }, !tooltipText && className)}
        htmlFor={name}
      >
        {label}
        {secondaryLabel && <span className={styles.secondaryLabel}>{secondaryLabel}</span>}
      </label>
    </>
  );

  const labelWithImportantIcon = (
    <div className={clsx({ [styles.labelHeader]: tooltipText }, className)}>
      {label}
      {tooltipText && <Tooltip tooltipText={tooltipText} />}
    </div>
  );

  const labelDisplayed = tooltipText ? labelWithImportantIcon : regularLabel;

  return <>{labelDisplayed}</>;
};

export default Label;
