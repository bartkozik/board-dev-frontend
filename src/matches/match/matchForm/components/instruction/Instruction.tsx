import { INSTRUCTIONS } from '@/domain/instructions';
import styles from './Instruction.module.scss';

const Instruction = ({ areUsersSelected }: { areUsersSelected: boolean }): JSX.Element => {
  if (areUsersSelected) return <></>;
  return <div className={styles.root}>{INSTRUCTIONS.match.create}</div>;
};

export default Instruction;
