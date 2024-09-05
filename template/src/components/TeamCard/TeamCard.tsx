import { useNavigate } from 'react-router-dom';
import { Team } from '../../models/Team';
import { useAuth } from '../../providers/AuthProvider';

interface TeamCardProps {
  team: Team;
  onlineMembersCount: number;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onlineMembersCount }) => {
  const { currentUser } = useAuth();
  const isOwner = team.owner === currentUser.userData!.username;
  const isModerator =
    team.members[currentUser.userData!.username]?.role === 'moderator';

  const navigate = useNavigate();
  const handleGoToTeamClick = () => {
    navigate(`/app/teams/${team.id}`);
  };

  // Calculate the total number of channels across all categories
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
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg"
          onClick={handleGoToTeamClick}
        >
          Go to Team
        </button>
        {(isOwner || isModerator) && (
          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-lg">
            Change Info
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
