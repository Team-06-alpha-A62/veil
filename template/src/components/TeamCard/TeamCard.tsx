import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Team } from '../../models/Team';
import { useAuth } from '../../providers/AuthProvider';
import ManageTeamModal from '../ManageTeamModal/ManageTeamModal';
import { createJoinRequest } from '../../services/teams.service';

interface TeamCardProps {
  team: Team;
  onlineMembersCount: number;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onlineMembersCount }) => {
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
  };
  const handleManageTeamClick = () => {
    setIsManageTeamModalOpen(true);
  };

  const totalChannels = Object.values(team.channels || {}).reduce(
    (count, category) => count + Object.keys(category).length,
    0
  );

  return (
    <div className="relative bg-gray-800 text-white rounded-lg p-3 w-full shadow-lg flex flex-col items-center group">
      <h3 className="text-xl font-bold pb-2">{team.name}</h3>
      <div
        className="w-full h-36 bg-cover bg-center mb-4"
        style={{
          backgroundImage: `url(${team.imageUrl || '/default-avatar.png'})`,
        }}
      ></div>
      <div className="flex justify-between w-full p-4">
        <div className="text-center">
          <p className="font-semibold">{totalChannels}</p>
          <p className="text-gray-400">Channels</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">{Object.keys(team.members).length}</p>
          <p className="text-gray-400">Members</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">{onlineMembersCount}</p>
          <p className="text-gray-400">Online</p>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-80 flex items-center justify-center space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex-col">
        {hasJoined || isPrivateTeam ? (
          <button
            className="px-4 py-2  w-1/2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg"
            onClick={handleGoToTeamClick}
          >
            Go to Team
          </button>
        ) : (
          <button
            className="px-4 py-2 w-1/2 bg-green-500 hover:bg-green-400 text-white rounded-lg"
            onClick={handleRequestJoinClick}
          >
            Request to Join
          </button>
        )}
        {(isOwner || isModerator) && hasJoined && (
          <button
            className="px-4 py-2 w-1/2 bg-orange-500 hover:bg-orange-400 text-white rounded-lg"
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
