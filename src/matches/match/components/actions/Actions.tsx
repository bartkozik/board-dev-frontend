import { Tooltip } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { useStores } from '@/RootStore';
import { routes } from '@/app/routes';
import { INSTRUCTIONS } from '@/domain/instructions';
import Button from '@/theme/button';
import styles from './Actions.module.scss';

interface ActionsProps {
  withoutBorder?: boolean;
  rightAligned?: boolean;
  withoutEditButton?: boolean;
}

const Actions = ({
  withoutBorder = false,
  rightAligned = false,
  withoutEditButton = false,
}: ActionsProps): JSX.Element => {
  const { matchStore } = useStores();
  const { isEditing, submitting, areUsersSelected, setIsEditing, saveDraft } = matchStore;
  const navigate = useNavigate();
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  if (!areUsersSelected) return <></>;

  const handleClickDraft = (): void => {
    setClickedButton('draft');
    saveDraft().then(() => navigate(routes.Matches.path('drafts')));
  };

  const handleClickEdit = (): void => {
    setClickedButton('edit');
    setIsEditing(true);
  };

  return (
    <div className={clsx(styles.root, { [styles.rightAligned]: rightAligned })}>
      {isEditing && (
        <Button
          name="draft"
          variant="secondary"
          text="Save a draft"
          onClick={handleClickDraft}
          loading={clickedButton === 'draft' && submitting}
          disabled={submitting}
          className={clsx(styles.saveButton, {
            [styles.withoutBorder]: withoutBorder,
          })}
        />
      )}
      {!isEditing && !withoutEditButton && (
        <Button
          variant="secondary"
          name="edit"
          text="Edit summary"
          onClick={handleClickEdit}
          loading={clickedButton === 'edit' && submitting}
          disabled={submitting}
          className={clsx(styles.saveButton, {
            [styles.withoutBorder]: withoutBorder,
          })}
        />
      )}
      <Tooltip label={INSTRUCTIONS.match.sendToCRM} withArrow>
        <Button
          name="send"
          variant="primary"
          text="Save and send to CRM"
          onClick={() => setClickedButton('send')}
          loading={clickedButton === 'send' && submitting}
          disabled={submitting}
          className={styles.saveButton}
          type="submit"
        />
      </Tooltip>
    </div>
  );
};

export default observer(Actions);
