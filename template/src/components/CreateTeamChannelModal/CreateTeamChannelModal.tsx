import { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider.tsx';
import { createChannel } from '../../services/channel.service.ts';
import { ChannelType } from '../../enums/ChannelType.ts';
import { ChannelCategory } from '../../enums/ChannelCategory.ts';
import ParticipantsInput from '../ParticipantInput/ParticipantsInput.tsx';

interface CreateTeamChannelModalProps {
  teamId: string;
  teamMembers: string[];
  onClose: () => void;
}

const initialChannelData = {
  title: '',
  isPrivate: true,
  category: ChannelCategory.TEXT_CHANNELS,
};

const CreateTeamChannelModal: React.FC<CreateTeamChannelModalProps> = ({
  teamId,
  teamMembers,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const [participants, setParticipants] = useState<string[]>([]);
  const [channelData, setChannelData] =
    useState<typeof initialChannelData>(initialChannelData);
  const [isTitleValid, setIsTitleValid] = useState<boolean>(true);

  useEffect(() => {
    if (channelData.isPrivate) {
      setParticipants([]);
    } else {
      setParticipants([]);
    }
  }, [channelData.isPrivate, teamMembers]);

  const handleCreateChannelClick = async (): Promise<void> => {
    if (!channelData.title.trim()) {
      setIsTitleValid(false);
      return;
    }

    const finalParticipants = channelData.isPrivate
      ? [...participants, currentUser.userData!.username]
      : teamMembers;

    await createChannel(
      channelData.title ? channelData.title : null,
      currentUser.userData!.username,
      finalParticipants,
      ChannelType.TEAM,
      channelData.isPrivate,
      teamId,
      channelData.category
    );

    setChannelData(initialChannelData);
    setParticipants([]);
    onClose();
  };

  const handleInputChange =
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setChannelData({
        ...channelData,
        [key]: event.target.value,
      });
    };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setChannelData({
      ...channelData,
      category: event.target.value as ChannelCategory,
    });
  };

  return (
    <div className="h-screen w-full fixed top-0 left-0 flex justify-center items-center bg-base-200 bg-opacity-75 z-10">
      <div className="w-96 h-auto relative bg-base-300 rounded-3xl flex flex-col gap-5 p-4">
        <button onClick={onClose} className="absolute top-5 right-5">
          &times;
        </button>
        <div>
          <h2 className="text-xl font-semibold">Create Team Channel</h2>
        </div>
        <div className="flex flex-col gap-4">
          <label className="form-control w-full gap-1">
            <div className="label">
              <span className="label-text">Title</span>
            </div>
            <input
              autoFocus
              placeholder="Enter channel name"
              value={channelData.title}
              onChange={handleInputChange('title')}
              type="text"
              className={`input input-sm w-full rounded-3xl bg-base-200 bg-opacity-50 focus:border-transparent focus:outline-accent ${
                isTitleValid ? '' : 'input-error'
              }`}
            />
            {!isTitleValid && (
              <span className="text-red-500 text-xs mt-1">
                Title is required
              </span>
            )}
          </label>
          <ParticipantsInput
            participants={participants}
            setParticipants={setParticipants}
            teamMembers={teamMembers.filter(
              member => member !== currentUser.userData!.username
            )}
            disabled={!channelData.isPrivate}
          />
          <div className="form-control items-start">
            <label className="label cursor-pointer flex gap-4">
              <span className="label-text">Private</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={channelData.isPrivate}
                onChange={() =>
                  setChannelData(prev => ({
                    ...prev,
                    isPrivate: !prev.isPrivate,
                  }))
                }
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={channelData.category}
              onChange={handleCategoryChange}
            >
              <option value={ChannelCategory.INFORMATION}>Information</option>
              <option value={ChannelCategory.TEXT_CHANNELS}>
                Text Channels
              </option>
            </select>
          </div>
        </div>
        <button
          className="text-sm font-semibold px-3 py-1 rounded-full bg-success hover:bg-accent-focus transition-colors text-white"
          onClick={handleCreateChannelClick}
        >
          Create Channel
        </button>
      </div>
    </div>
  );
};

export default CreateTeamChannelModal;