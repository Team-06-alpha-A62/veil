import { useState, useRef, useEffect } from 'react';
import {
  BsThreeDotsVertical,
  BsXCircle,
  BsCheckCircle,
  BsLock,
} from 'react-icons/bs';
import { Channel } from '../../models/Channel.ts';
import { useAuth } from '../../providers/AuthProvider';
import { leaveChannel } from '../../services/user.service.ts';
import { ChannelType } from '../../enums/ChannelType.ts';
import {
  getChannelImage,
  getChannelName,
} from '../../utils/TransformDataHelpers.ts';
import ChannelCardMenu from '../ChannelCardMenu/ChannelCardMenu.tsx';
import DragZone from '../DragZone/DragZone.tsx';
import { FaUserGroup } from 'react-icons/fa6';
import { uploadImage, deleteImage } from '../../services/storage.service.ts';
import { changeChannelImage } from '../../services/channel.service.ts';
import ManageChannelModal from '../ManageChannelModal/ManageChannelModal.tsx';

interface ChannelCardProps {
  channel: Channel;
  handleClick: (channel: Channel) => void;
  isTeamChannel?: boolean;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  handleClick,
  isTeamChannel = false,
}) => {
  const { currentUser } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [isManageChannelModalOpen, setIsManageChannelModalOpen] =
    useState(false);
  console.log(channel.participants);
  const threeDotsButtonRef = useRef<HTMLButtonElement>(null);
  const channelCardMenuRef = useRef<HTMLDivElement>(null);
  const currentUsername = currentUser.userData!.username;

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      threeDotsButtonRef.current &&
      !threeDotsButtonRef.current.contains(event.target as Node) &&
      channelCardMenuRef.current &&
      !channelCardMenuRef.current.contains(event.target as Node)
    ) {
      setIsMenuVisible(false);
    }
  };

  useEffect(() => {
    if (isMenuVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuVisible]);

  const onLeaveChannel = async () => {
    await leaveChannel(channel.id, currentUser.userData!.username);
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
    setIsImageRemoved(false);
  };

  const onSaveImage = async () => {
    if (isImageRemoved) {
      if (channel.imageUrl) await deleteImage(channel.imageUrl);
      await changeChannelImage(channel.id, '');
    } else if (imageFile) {
      const imageUrl = await uploadImage(imageFile);
      await changeChannelImage(channel.id, imageUrl);
    }
    setImagePreviewUrl(null);
    setIsEditingImage(false);
    setIsImageRemoved(false);
  };

  const onRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setIsImageRemoved(true);
  };

  const userRole = channel.participants[currentUser.userData!.username].role;

  const isGroup = channel.type === ChannelType.GROUP;
  const channelImage = getChannelImage(channel, currentUsername);

  const isParticipant = channel.participants?.[currentUsername];
  const isPrivateChannel = channel.isPrivate;

  return (
    <div
      className={`flex relative items-center p-6 border-b-2 border-base-100 justify-between 
    ${
      isPrivateChannel && !isParticipant
        ? 'cursor-not-allowed'
        : 'cursor-pointer'
    } 
    hover:bg-base-300 hover:bg-opacity-50 active:bg-opacity-0 transition-colors`}
      onClick={() => !isEditingImage && isParticipant && handleClick(channel)}
    >
      <div
        className={`flex items-center ${
          isTeamChannel ? 'space-x-1' : 'space-x-4'
        }`}
      >
        {!isTeamChannel && !isEditingImage ? (
          <div className="avatar placeholder">
            <div className="bg-base-300 text-neutral-content w-14 rounded-full">
              {channelImage && !isImageRemoved ? (
                channelImage.startsWith('http') ? (
                  <img src={channelImage} alt="Channel" />
                ) : (
                  <span className="text-3xl">{channelImage}</span>
                )
              ) : (
                <span className="text-3xl">
                  <FaUserGroup />
                </span>
              )}
            </div>
          </div>
        ) : (
          isEditingImage && (
            <DragZone
              handleFileChange={handleFileChange}
              width={56}
              height={56}
              round={true}
              imageUrl={imagePreviewUrl || (isImageRemoved ? '' : channelImage)}
            />
          )
        )}
        <div>
          <h2 className="font-semibold text-m">
            {isEditingImage
              ? 'Choose Image'
              : getChannelName(currentUsername, channel)}
          </h2>
          {isEditingImage && (
            <button
              className="text-orange-500 mt-1 text-sm"
              onClick={event => {
                event.stopPropagation();
                onRemoveImage();
              }}
            >
              Remove Image
            </button>
          )}
        </div>
      </div>
      <div className="flex space-x-2 relative">
        {isEditingImage ? (
          <div className="pr-1 flex flex-col gap-2">
            <button
              className="text-success"
              onClick={event => {
                event.stopPropagation();
                onSaveImage();
              }}
            >
              <BsCheckCircle size={20} />
            </button>
            <button
              className="text-error"
              onClick={event => {
                event.stopPropagation();
                setIsEditingImage(false);
                setImagePreviewUrl(null);
                setIsImageRemoved(false);
              }}
            >
              <BsXCircle size={20} />
            </button>
          </div>
        ) : (
          <>
            {isPrivateChannel && !isParticipant ? (
              <BsLock size={20} className="text-gray-400" />
            ) : (
              <button
                className="text-gray-400 hover:text-primary-content"
                onClick={event => {
                  event.stopPropagation();
                  setIsMenuVisible(prev => !prev);
                }}
                ref={threeDotsButtonRef}
              >
                <BsThreeDotsVertical size={20} />
              </button>
            )}
            <div ref={channelCardMenuRef}>
              {isMenuVisible && (
                <ChannelCardMenu
                  isTeamChannel={isTeamChannel}
                  userRole={userRole}
                  isGroup={isGroup}
                  onLeaveChannel={onLeaveChannel}
                  onChangeIcon={() => {
                    setIsEditingImage(true);
                    setIsMenuVisible(false);
                  }}
                  onManageChannel={() => {
                    setIsManageChannelModalOpen(true);
                    setIsMenuVisible(false);
                  }}
                />
              )}
            </div>
            {isManageChannelModalOpen && (
              <ManageChannelModal
                channel={channel}
                onClose={() => setIsManageChannelModalOpen(false)}
                currentUsername={currentUsername}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChannelCard;
