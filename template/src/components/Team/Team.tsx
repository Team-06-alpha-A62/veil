import { useState, useEffect } from 'react';
import { Channel } from '../../models/Channel';
import { ChannelCategory } from '../../enums/ChannelCategory';
import { useNavigate, useParams } from 'react-router-dom';
import ChannelWindow from '../ChannelWindow/ChannelWindow';
import {
  listenToTeamChannels,
  getTeamById,
} from '../../services/teams.service';
import { listenToIndividualChannel } from '../../services/channel.service';
import ChannelCard from '../ChannelCard/ChannelCard';
import { BsArrowLeftCircle } from 'react-icons/bs';
import CreateTeamChannelModal from '../CreateTeamChannelModal/CreateTeamChannelModal';
import { Team as TeamData } from '../../models/Team';
import { useAuth } from '../../providers/AuthProvider';
import { UserRole } from '../../enums/UserRole';

const Team: React.FC = () => {
  const { currentUser } = useAuth();
  const { teamId, channelId } = useParams<{
    teamId: string;
    channelId: string;
  }>();
  const [team, setTeam] = useState<TeamData | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(
    channelId || null
  );
  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<ChannelCategory, boolean>
  >({
    [ChannelCategory.INFORMATION]: false,
    [ChannelCategory.TEXT_CHANNELS]: false,
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isParticipant, setIsParticipant] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeam = async () => {
      if (teamId) {
        setIsLoading(true);
        const fetchedTeam = await getTeamById(teamId);
        setIsLoading(false);

        if (fetchedTeam) {
          setTeam(fetchedTeam);

          if (!fetchedTeam.members[currentUser.userData!.username]) {
            setIsParticipant(false);
            return;
          }
        } else {
          console.log('Team not found');
        }
      }
    };

    fetchTeam();

    if (teamId) {
      const handleChannelsChange = (channels: Channel[]) => {
        setChannels(channels);
        channels.forEach(channel => {
          listenToIndividualChannel(channel.id, updatedChannel => {
            setChannels(prevChannels =>
              prevChannels.map(ch =>
                ch.id === updatedChannel.id ? updatedChannel : ch
              )
            );
          });
        });
      };

      const unsubscribe = listenToTeamChannels(teamId, handleChannelsChange);
      return () => unsubscribe();
    }
  }, [teamId]);

  const categorizedChannels = channels.reduce<
    Record<ChannelCategory, Channel[]>
  >(
    (acc, channel) => {
      if (channel.category) {
        if (!acc[channel.category]) {
          acc[channel.category] = [];
        }
        acc[channel.category].push(channel);
      }
      return acc;
    },
    {
      [ChannelCategory.INFORMATION]: [],
      [ChannelCategory.TEXT_CHANNELS]: [],
    }
  );

  const handleChannelClick = (channel: Channel) => {
    setActiveChannelId(channel.id);
    navigate(`/app/teams/${teamId}/channels/${channel.id}`);
  };

  const handleCategoryToggle = (category: ChannelCategory) => {
    setCollapsedCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const activeChannel = channels.find(
    channel => channel.id === activeChannelId
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <h2 className="text-lg font-semibold">Loading...</h2>
      </div>
    );
  }

  if (!isParticipant) {
    return (
      <div className="flex flex-col gap-4 rounded-3xl items-center justify-center bg-base-300 bg-opacity-50 h-full">
        <h2 className="text-3xl font-semibold text-primary">
          Access Denied: You are not a participant in this team.
        </h2>
        <button
          onClick={() => navigate('/app/teams')}
          className="text-base pt-4 text-primary-content underline hover:text-primary"
        >
          Return to Teams
        </button>
      </div>
    );
  }
  return (
    <div className="flex gap-10 rounded-3xl p-6 bg-base-300   h-full">
      <div className="w-1/4 rounded-lg pr-4 overflow-y-scroll">
        <header className="flex justify-between items-center mb-4">
          <button
            className="text-base-content hover:text-primary rounded-full p-2"
            onClick={() => navigate('/app/teams')}
          >
            <BsArrowLeftCircle size={30} />
          </button>
          {(team?.owner === currentUser.userData?.username ||
            team?.members[currentUser.userData!.username].role ===
              UserRole.MODERATOR) && (
            <button
              className="text-sm font-semibold px-3 py-1 rounded-3xl bg-success hover:bg-opacity-75 text-white"
              onClick={() => setIsModalOpen(true)}
            >
              Add Channel
            </button>
          )}
        </header>
        <div className="overflow-y-auto">
          {Object.entries(categorizedChannels).map(([category, channels]) => (
            <div key={category} className="mb-4">
              <div
                className="category-header flex justify-between items-center cursor-pointer p-2"
                onClick={() =>
                  handleCategoryToggle(category as ChannelCategory)
                }
              >
                <h4 className="font-bold text-md text-base-content">
                  {category}
                </h4>
                <span className="text-base-content">
                  {collapsedCategories[category as ChannelCategory] ? '+' : '-'}
                </span>
              </div>
              {!collapsedCategories[category as ChannelCategory] && (
                <ul className="pl-4">
                  {channels.map(channel => {
                    return (
                      <ChannelCard
                        key={channel.id}
                        channel={channel}
                        handleClick={handleChannelClick}
                        isTeamChannel={true}
                        isTeamOwner={
                          team?.owner === currentUser.userData?.username
                        }
                      />
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
      <main className="basis-3/4 mb-12">
        {activeChannel ? (
          <ChannelWindow
            channel={activeChannel}
            teamMembers={Object.keys(team?.members || {}).filter(
              member => member !== currentUser.userData?.username
            )}
          />
        ) : (
          <div className="text-center text-primary mt-4">
            Please select a channel to view.
          </div>
        )}
      </main>
      {isModalOpen && team && (
        <CreateTeamChannelModal
          teamId={teamId!}
          teamMembers={[...Object.keys(team.members)]}
          channelOwner={team.owner}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Team;
