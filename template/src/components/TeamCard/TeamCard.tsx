import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Team } from '../../models/Team';
import { useAuth } from '../../providers/AuthProvider';
import ManageTeamModal from '../ManageTeamModal/ManageTeamModal';
import { createJoinRequest } from '../../services/teams.service';
import { createNotification } from '../../services/notification.service.ts';
import { NotificationType } from '../../enums/NotificationType.ts';
import { NotificationMessageType } from '../../enums/NotificationMessageType.ts';

interface TeamCardProps {
  team: Team;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const { currentUser } = useAuth();
  const [isManageTeamModalOpen, setIsManageTeamModalOpen] = useState(false);
  const isOwner = team.owner === currentUser.userData!.username;
  const isModerator =
    team.members[currentUser.userData!.username]?.role === 'moderator';
  const hasJoined = !!team.members[currentUser.userData!.username];
  const isPrivateTeam = team.isPrivate;

  const navigate = useNavigate();

  const handleGoToTeamClick = () => {
    navigate(`/app/teams/${team.id}`);
  };

  const handleRequestJoinClick = async () => {
    await createJoinRequest(team.id, currentUser.userData!.username);
    await createNotification(
      currentUser.userData!.username,
      team.owner,
      NotificationType.TEAM,
      `${currentUser.userData!.username} has requested to join team ${
        team.name
      }`,
      NotificationMessageType.ALERT_INFO
    );
  };
  const handleManageTeamClick = () => {
    setIsManageTeamModalOpen(true);
  };

  const totalChannels = Object.values(team.channels || {}).reduce(
    (count, category) => count + Object.keys(category).length,
    0
  );

  return (
    <div className="relative bg-base-100 text-white rounded-3xl w-full shadow-lg flex flex-col items-center group">
      <div className="w-full">
        <img
          className="w-full h-36 object-cover rounded-t-3xl object-center mb-4"
          src={team.imageUrl || '/default-avatar.png'}
          alt="Team Avatar"
        />
      </div>
      <h3 className="text-xl text-base-content font-bold py-2">{team.name}</h3>
      <div className="flex justify-around w-full p-4">
        <div className="text-center">
          <p className="font-semibold text-base-content">{totalChannels}</p>
          <p className="font-semibold text-base-content">Channels</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-base-content">
            {Object.keys(team.members).length}
          </p>
          <p className="font-semibold text-base-content ">Members</p>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-base-200 bg-opacity-80 flex items-center justify-center space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl flex-col">
        {hasJoined || isPrivateTeam ? (
          <button
            className="px-4 py-2  w-1/2 bg-primary hover:bg-opacity-75 text-white rounded-full"
            onClick={handleGoToTeamClick}
          >
            Go to Team
          </button>
        ) : (
          <button
            className="px-4 py-2 w-1/2 bg-success hover:bg-opacity-75 text-white rounded-full"
            onClick={handleRequestJoinClick}
          >
            Request to Join
          </button>
        )}
        {(isOwner || isModerator) && hasJoined && (
          <button
            className="px-4 py-2 w-1/2 bg-success hover:bg-opacity-75 text-white rounded-full"
            onClick={handleManageTeamClick}
          >
            Manage Team
          </button>
        )}
      </div>

      {isManageTeamModalOpen && (
        <ManageTeamModal
          team={team}
          onClose={() => setIsManageTeamModalOpen(false)}
          currentUsername={currentUser.userData!.username}
        />
      )}
    </div>
  );
};

export default TeamCard;
