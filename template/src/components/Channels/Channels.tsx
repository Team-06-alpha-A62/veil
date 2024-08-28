import React, { useEffect, useState } from 'react';
import CreateChannelModal from '../CreateChannelModal/CreateChannelModal.tsx';
import ChannelCard from '../ChannelCard/ChannelCard.tsx';
import { Channel } from '../../models/Channel.ts';
import { useAuth } from '../../providers/AuthProvider.tsx';
import {
  listenToChannelChange,
  listenToIndividualChannel,
} from '../../services/channel.service.ts';
import ChannelWindow from '../ChannelWindow/ChannelWindow.tsx';

const Channels: React.FC = () => {
  const { currentUser } = useAuth();
  const [channelsData, setChannelsData] = useState<Channel[]>([]);
  const [listeners, setListeners] = useState<Array<() => void>>([]);
  const [openedChannel, setOpenedChannel] = useState<Channel | null>(null);

  //handleNewMessgae() =>
  //

  const handleOpenChannelClick = (channel: Channel): void => {
    setOpenedChannel(channel);
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <>
      <div className="flex gap-10 rounded-3xl p-6 my-8 bg-base-300 bg-opacity-50 h-full">
        <div className="basis-1/4">
          <header className="flex flex-row-reverse mb-6">
            <CreateChannelModal />
          </header>
          <div className="max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
            {channelsData.length ? (
              channelsData.map(channel => {
                console.log(channel);
                return (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    handleClick={handleOpenChannelClick}
                  />
                );
              })
            ) : (
              <div className="text-center text-gray-400">
                No Channels Found.
              </div>
            )}
          </div>
        </div>
        <main className="basis-3/4">
          <ChannelWindow channel={openedChannel!} />
        </main>
      </div>
    </>
  );
};

export default Channels;
