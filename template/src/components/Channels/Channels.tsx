import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CreateChannelModal from '../CreateChannelModal/CreateChannelModal.tsx';
import ChannelCard from '../ChannelCard/ChannelCard.tsx';
import { Channel } from '../../models/Channel.ts';
import { useAuth } from '../../providers/AuthProvider.tsx';
import {
  listenToChannelChange,
  listenToIndividualChannel,
} from '../../services/channel.service.ts';
import ChannelWindow from '../ChannelWindow/ChannelWindow.tsx';
import { ChannelType } from '../../enums/ChannelType.ts';
import NotificationBadge from '../NotificationBadge/NotificationBadge.tsx';
import { NotificationType } from '../../enums/NotificationType.ts';
import { clearUnreadNotifications } from '../../services/user.service.ts';

const Channels: React.FC = () => {
  const { currentUser } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [channelsData, setChannelsData] = useState<Channel[]>([]);
  const [listeners, setListeners] = useState<Array<() => void>>([]);
  const [openedChannel, setOpenedChannel] = useState<string | null>(id || null);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    ChannelType.GROUP
  );

  useEffect(() => {
    setOpenedChannel(id || null);
  }, [id]);

  useEffect(() => {
    const handleChannelsChange = (channels: Channel[]) => {
      setChannelsData([...channels]);
      const newListeners: Array<() => void> = channels.map(channel => {
        const cleanupListener = listenToIndividualChannel(
          channel.id,
          updatedChannel => {
            setChannelsData(prevChannels =>
              prevChannels.map(ch =>
                ch.id === updatedChannel.id ? updatedChannel : ch
              )
            );
          }
        );
        return cleanupListener;
      });

      setListeners(newListeners);
    };
    const cleanupChannelsListener = listenToChannelChange(
      currentUser.userData!.username,
      handleChannelsChange
    );

    return () => {
      cleanupChannelsListener();
      listeners.forEach(cleanup => cleanup());
    };
  }, [currentUser]);

  const handleOpenChannelClick = (channel: Channel): void => {
    const channelTypePath =
      channel.type === ChannelType.DIRECT ? 'direct' : 'group';
    navigate(`/app/chats/${channelTypePath}/${channel.id}`);
  };

  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    if (category === 'group' && currentUser) {
      await clearUnreadNotifications(
        currentUser.userData!.username,
        NotificationType.CHANNEL
      );
    }
  };

  const filteredChannels = useMemo(() => {
    return selectedCategory === ChannelType.GROUP
      ? channelsData.filter(channel => channel.type === ChannelType.GROUP)
      : channelsData.filter(channel => channel.type === ChannelType.DIRECT);
  }, [selectedCategory, channelsData]);

  const activeChannel: Channel | undefined = channelsData.find(
    channel => channel.id === openedChannel
  );

  return (
    <div className="flex gap-10 rounded-3xl p-6 bg-base-300 bg-opacity-50 h-full z-0">
      <div className="flex flex-col basis-1/4 h-full">
        <header className="flex justify-between mb-6">
          <div className="flex space-x-2 text-white">
            {['Group', 'Direct'].map(category => (
              <div key={category} className="relative">
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category.toLowerCase())}
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    selectedCategory === category.toLowerCase()
                      ? 'bg-primary'
                      : 'bg-gray-700 bg-opacity-50'
                  } hover:bg-gray-600 transition-colors`}
                >
                  {category}
                </button>
                {category === 'group' && (
                  <NotificationBadge
                    type={NotificationType.CHANNEL}
                    isViewActive={selectedCategory === 'Group'}
                  />
                )}
              </div>
            ))}
          </div>
          {selectedCategory !== ChannelType.DIRECT && <CreateChannelModal />}
        </header>
        <div className="flex-grow overflow-y-auto overflow-x-clip max-h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-gray-600">
          {filteredChannels.length ? (
            filteredChannels.map(channel => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                handleClick={handleOpenChannelClick}
                isTeamChannel={false}
              />
            ))
          ) : (
            <div className="text-center text-gray-400">No Channels Found.</div>
          )}
        </div>
      </div>
      <main className="basis-3/4 mb-12">
        {activeChannel ? (
          <ChannelWindow channel={activeChannel} />
        ) : (
          <div className="text-center text-primary mt-4">
            Please select a channel to view.
          </div>
        )}
      </main>
    </div>
  );
};

export default Channels;
