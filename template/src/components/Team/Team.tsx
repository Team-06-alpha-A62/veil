import { useState, useEffect } from 'react';
import { Channel } from '../../models/Channel';
import { ChannelCategory } from '../../enums/ChannelCategory';
import { useNavigate, useParams } from 'react-router-dom';
import ChannelWindow from '../ChannelWindow/ChannelWindow';
import { listenToTeamChannels } from '../../services/teams.service';
import { listenToIndividualChannel } from '../../services/channel.service';

const Team: React.FC = () => {
  const { teamId, channelId } = useParams<{
    teamId: string;
    channelId: string;
  }>();
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

  const navigate = useNavigate();

  useEffect(() => {
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

  return (
    <div className="flex gap-10 rounded-3xl p-6 bg-base-300 bg-opacity-50 h-full">
      <div className="w-1/4 p-4 rounded-lg">
        <header className="flex justify-between mb-4">
          <h3 className="font-bold text-lg">Channels</h3>
        </header>
        {Object.entries(categorizedChannels).map(([category, channels]) => (
          <div key={category} className="mb-4">
            <div
              className="category-header flex justify-between items-center cursor-pointer p-2"
              onClick={() => handleCategoryToggle(category as ChannelCategory)}
            >
              <h4 className="font-bold text-md">{category}</h4>
              <span>
                {collapsedCategories[category as ChannelCategory] ? '+' : '-'}
              </span>
            </div>
            {!collapsedCategories[category as ChannelCategory] && (
              <ul className="pl-4">
                {channels.map(channel => (
                  <li
                    key={channel.id}
                    className={`p-2 cursor-pointer ${
                      channel.id === activeChannelId ? 'bg-gray-700' : ''
                    }`}
                    onClick={() => handleChannelClick(channel)}
                  >
                    #{channel.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div className="flex-1 p-4 rounded-lg">
        {activeChannel ? (
          <ChannelWindow channel={activeChannel} />
        ) : (
          <div className="text-center text-gray-400 mt-4">
            Please select a channel to view.
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
