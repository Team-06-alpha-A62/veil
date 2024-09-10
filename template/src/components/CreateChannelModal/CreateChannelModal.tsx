import { useEffect, useState } from 'react';
import CreateChannelButton from '../CreateChannelButton/CreateChannelButton.tsx';
import { createChannel } from '../../services/channel.service.ts';
import { useAuth } from '../../providers/AuthProvider.tsx';
import { ChannelType } from '../../enums/ChannelType.ts';
import ParticipantsInput from '../ParticipantInput/ParticipantsInput.tsx';
import { uploadImage } from '../../services/storage.service.ts';
import DragZone from '../DragZone/DragZone.tsx';
import { NotificationType } from '../../enums/NotificationType.ts';
import { NotificationMessageType } from '../../enums/NotificationMessageType.ts';
import { createNotification } from '../../services/notification.service.ts';

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleCreateChannelClick = async (): Promise<void> => {
    let imageUrl = '';

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    await createChannel(
      channelData.title ? channelData.title : null,
      currentUser.userData!.username,
      [...participants, currentUser.userData!.username],
      ChannelType.GROUP,
      channelData.isPrivate,
      null,
      undefined,
      imageUrl
    );

    participants.forEach(async participant => {
      await createNotification(
        currentUser.userData!.username,
        participant,
        NotificationType.CHANNEL,
        `${currentUser.userData!.username} added you to a channel`,
        NotificationMessageType.ALERT_INFO
      );
    });

    setChannelData(initialChannelData);
    setParticipants([]);
    setImageFile(null);
    setImagePreviewUrl(null);
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

  const handleFileChange = (file: File) => {
    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
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
        <div className="h-screen w-full fixed top-0 left-0 flex justify-center items-center bg-base-300 bg-opacity-75 z-10">
          <div className="w-96 h-auto relative bg-base-100 rounded-3xl flex flex-col gap-5 p-4">
            <button
              onClick={handleModalToggle}
              className="absolute top-5 right-5"
            >
              &times;
            </button>
            <div>
              <h2 className="text-xl font-semibold text-base-content">
                Create Channel
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <label className="form-control w-full gap-1">
                <div className="label">
                  <span className="label-text text-base-content">Title</span>
                  <span className="badge badge-primary badge-outline text-primary">
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
                  className="flex-1 px-4 py-2 rounded-3xl bg-base-200 input-sm placeholder-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:ring-dashed caret-primary"
                />
              </label>
              <ParticipantsInput
                participants={participants}
                setParticipants={setParticipants}
              />
              <div className="form-control items-start">
                <label className="label cursor-pointer flex gap-4">
                  <span className="label-text text-base-content">Private</span>
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

              <div className="flex items-center justify-between px-1">
                <span className="label-text text-base-content">
                  Upload Channel Image
                </span>
                <DragZone
                  handleFileChange={handleFileChange}
                  width={100}
                  height={100}
                  round={true}
                  imageUrl={imagePreviewUrl}
                />
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
