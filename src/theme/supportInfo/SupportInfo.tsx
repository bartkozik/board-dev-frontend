import React from 'react';
import clsx from 'clsx';
import { SupportInfoType } from '@/domain/supportInfo';
import Button from '@/theme/button';
import styles from './SupportInfo.module.scss';

interface SupportInfoProps {
  supportInfo: SupportInfoType;
  className?: string;
}

const SupportInfo = ({ supportInfo: { text, link, buttonText }, className }: SupportInfoProps): React.JSX.Element => (
  <div className={clsx(styles.support, className)}>
    <p>{text}</p>
    <Button className={clsx(styles.supportButton)} text={buttonText} to={link} variant="text" />
  </div>
);

export default SupportInfo;
