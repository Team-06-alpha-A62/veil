import { useEffect, useState } from 'react';
import CreateChannelButton from '../CreateChannelButton/CreateChannelButton.tsx';
import { createChannel } from '../../services/channel.service.ts';
import { useAuth } from '../../providers/AuthProvider.tsx';
import { ChannelType } from '../../enums/ChannelType.ts';
import ParticipantsInput from '../ParticipantInput/ParticipantsInput.tsx';

interface Channel {
  title: string;
  isPrivate: boolean;
}

const initialChannelData = {
  title: '',
  isPrivate: true,
};

const CreateChannelModal: React.FC = () => {
  const { currentUser } = useAuth();
  const [showChannelModal, setShowChannelModal] = useState<boolean>(false);
  const [participants, setParticipants] = useState<string[]>([]);

  const [channelData, setChannelData] = useState<Channel>(initialChannelData);

  const handleCreateChannelClick = async (): Promise<void> => {
    await createChannel(
      channelData.title ? channelData.title : null,
      currentUser.userData!.username,
      [...participants, currentUser.userData!.username],
      ChannelType.GROUP,
      channelData.isPrivate
    );

    setChannelData(initialChannelData);
    setParticipants([]);
    handleModalToggle();
  };

  const handleModalToggle = (): void => {
    setShowChannelModal(prevValue => !prevValue);
  };

  const handleInputChange =
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setChannelData({
        ...channelData,
        [key]: event.target.value,
      });
    };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowChannelModal(false);
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <>
      <CreateChannelButton handleClick={handleModalToggle} />
      {showChannelModal && (
        <div className="h-screen w-full fixed top-0 left-0 flex justify-center items-center bg-base-200 bg-opacity-75 z-10">
          <div className="w-96 h-auto relative bg-base-300 rounded-3xl flex flex-col gap-5 p-4">
            <button
              onClick={handleModalToggle}
              className="absolute top-5 right-5"
            >
              &times;
            </button>
            <div>
              <h2 className="text-xl font-semibold">Create Channel</h2>
            </div>
            <div className="flex flex-col gap-4">
              <label className="form-control w-full gap-1">
                <div className="label">
                  <span className="label-text">Title</span>
                  <span className="badge badge-accent badge-outline text-accent">
                    Optional
                  </span>
                </div>
                <input
                  autoFocus
                  placeholder={participants
                    .join(', ')
                    .concat(
                      participants.length > 1
                        ? ` and ${currentUser.userData!.username}`
                        : ''
                    )}
                  value={channelData.title}
                  onChange={handleInputChange('title')}
                  type="text"
                  className="input input-sm w-full rounded-3xl bg-base-200 bg-opacity-50 focus:border-transparent focus:outline-accent"
                />
              </label>
              <ParticipantsInput
                participants={participants}
                setParticipants={setParticipants}
              />
              <div className="form-control items-start">
                <label className="label cursor-pointer flex gap-4">
                  <span className="label-text">Private</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    defaultChecked
                  />
                </label>
              </div>
            </div>
            <button
              className="text-sm font-semibold px-3 py-1 rounded-full bg-success hover:bg-accent-focus transition-colors text-white"
              onClick={handleCreateChannelClick}
            >
              Start New Conversation
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateChannelModal;
