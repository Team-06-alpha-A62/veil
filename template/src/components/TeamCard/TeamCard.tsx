import { Team } from '../../models/Team';
import { useAuth } from '../../providers/AuthProvider';

interface TeamCardProps {
  team: Team;
  onlineMembersCount: number;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onlineMembersCount }) => {
  const { currentUser } = useAuth();
  const isOwner = team.owner === currentUser.userData!.username;

  return (
    <div className="bg-gray-800 text-white rounded-lg p-3 shadow-lg flex flex-col items-center">
      <h3 className="text-xl font-bold pb-2">{team.name}</h3>
      <div
        className="w-full h-28  bg-cover bg-center mb-4"
        style={{
          backgroundImage: `url(${team.imageUrl || '/default-avatar.png'})`,
        }}
      ></div>
      <div className="flex justify-between w-full p-4">
        <div className="text-center">
          <p className="font-semibold">{Object.keys(team.channels).length}</p>
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
      {isOwner && (
        <button className="mt-6 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-lg">
          Change Info
        </button>
      )}
    </div>
  );
};

export default TeamCard;
