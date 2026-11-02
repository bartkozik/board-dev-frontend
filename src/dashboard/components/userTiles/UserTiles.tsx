import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from '@/app/routes';
import Button from '@/theme/button';
import Icon, { icons, iconSize } from '@/theme/icon';
import Tile from '@/theme/tile';
import { User } from '@/users/types';
import { useUserRoles } from '@/utils/hooks';
import MessageWithInstructions from '../messageWithInstructions';
import styles from './UserTiles.module.scss';

interface UserTilesProps {
  user: User | null;
  formPercentageCompletion: number;
  userIsMatched: boolean;
}

const CompletedIcon = (): JSX.Element => (
  <div className={styles.filled}>
    <Icon icon={icons.tick} size={iconSize.small} />
    <span>completed</span>
  </div>
);

const UserTiles = ({ user, formPercentageCompletion, userIsMatched }: UserTilesProps): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isTechLeaderOrNPO, isNPO } = useUserRoles();

  const isFormCompleted = user?.formCompleted;

  if (!isTechLeaderOrNPO || pathname !== routes.Dashboard.path()) return <></>;
  const buttonCTA = 'Complete intake form';
  const isFormInProgress = !isFormCompleted && formPercentageCompletion > 0;

  const formCompletionDisplay =
    formPercentageCompletion < 100
      ? `Your application is ${formPercentageCompletion}% completed`
      : `Your application is complete, but you still need to submit it.`;
  const draftDescription = isFormInProgress ? formCompletionDisplay : '';

  const hasAccessAndTrainingMaterials = user?.accessToTrainingMaterials && user?.trainingMaterialsUrl;

  const tiles = [
    {
      condition: true,
      title: 'Intake form',
      description: !isFormCompleted ? draftDescription : <CompletedIcon />,
      children: !isFormCompleted ? (
        <Button text={buttonCTA} onClick={() => navigate(routes.Form.path('1'))} />
      ) : (
        <Button text="Review your answers" onClick={() => navigate(routes.Form.path('1'))} variant="secondary" />
      ),
    },
    {
      condition: hasAccessAndTrainingMaterials,
      title: 'Resources and trainings',
      description: isNPO ? '' : 'Prepare for your role',
      children: (
        <Button
          text={isNPO ? 'View resources' : 'Open learning resources'}
          disabled={!hasAccessAndTrainingMaterials}
          externalHref={user?.trainingMaterialsUrl}
          className={styles.externalHref}
        />
      ),
    },
    {
      condition: isFormCompleted,
      title: 'Your match',
      children: <p>{userIsMatched ? 'Your proposed match is ready' : 'In progress'}</p>,
    },
  ];

  const userTiles = tiles.filter((tiles) => tiles.condition);

  return (
    <>
      <MessageWithInstructions user={user} isUserMatched={userIsMatched} />

      <div className={styles.root}>
        {userTiles.map((tile) => (
          <Tile key={tile.title} {...tile} />
        ))}
      </div>
    </>
  );
};

export default UserTiles;
