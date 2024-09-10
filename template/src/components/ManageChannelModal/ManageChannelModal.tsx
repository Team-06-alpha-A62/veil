import React, { useState } from 'react';
import { Channel } from '../../models/Channel';
import {
  updateParticipantRole,
  updateChannelName,
  changeChannelImage,
  deleteChannel,
} from '../../services/channel.service';
import DragZone from '../DragZone/DragZone';
import { getChannelImage } from '../../utils/TransformDataHelpers';
import { uploadImage } from '../../services/storage.service';
import { UserRole } from '../../enums/UserRole';
import { Participant } from '../../models/Participant';
import { FaUserGroup } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';

interface ManageChannelModalProps {
  channel: Channel;
  onClose: () => void;
  currentUsername: string;
}

interface ChannelState {
  imageUrl: string | null;
  title: string | null;
  participants: {
    [username: string]: Participant;
  };
}

const ManageChannelModal: React.FC<ManageChannelModalProps> = ({
  channel,
  onClose,
  currentUsername,
}) => {
  const [channelState, setChannelState] = useState<ChannelState>({
    imageUrl: getChannelImage(channel, currentUsername),
    title: channel.name,
    participants: { ...channel.participants },
  });

  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    channelState.imageUrl
  );

  const isOwner = channel.owner === currentUsername;

  const location = useLocation();

  const handleFileChange = (file: File) => {
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
    setChannelState(prevState => ({
      ...prevState,
      imageUrl: previewUrl,
    }));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setChannelState(prevState => ({
      ...prevState,
      title: value,
    }));
  };

  const handleRoleChange = (username: string, newRole: UserRole) => {
    setChannelState(prevState => ({
      ...prevState,
      participants: {
        ...prevState.participants,
        [username]: {
          ...prevState.participants[username],
          role: newRole,
        },
      },
    }));
  };

  const handleSaveChanges = async () => {
    let updatedImageUrl = channelState.imageUrl;

    if (imageFile) {
      updatedImageUrl = await uploadImage(imageFile);
      await changeChannelImage(channel.id, updatedImageUrl);
      setChannelState(prevState => ({
        ...prevState,
        imageUrl: updatedImageUrl,
      }));
    } else if (!imageFile && !imagePreviewUrl) {
      await changeChannelImage(channel.id, '');
      setChannelState(prevState => ({
        ...prevState,
        imageUrl: '',
      }));
    }

    if (channelState.title && channelState.title !== channel.name) {
      await updateChannelName(channel.id, channelState.title);
    }

    Object.keys(channel.participants).forEach(async username => {
      if (
        channel.participants[username].role !==
        channelState.participants[username].role
      ) {
        await updateParticipantRole(
          channel.id,
          username,
          channelState.participants[username].role
        );
      }
    });

    onClose();
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setChannelState(prevState => ({
      ...prevState,
      imageUrl: '',
    }));
    setIsEditingImage(false);
  };

  const handleDeleteChannel = async () => {
    if (isOwner) {
      await deleteChannel(channel.id);
      onClose();
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredParticipants = Object.entries(channelState.participants).filter(
    ([username]) => username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isTeamChannel = location.pathname.includes('teams');

  return (
    <div className="h-screen w-full fixed top-0 left-0 flex justify-center items-center bg-base-300 bg-opacity-75 z-10">
      <div className="relative w-[400px] bg-base-100 flex flex-col gap-5 rounded-3xl p-6 shadow-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl">
          &times;
        </button>
        <div className="flex flex-col mb-6">
          {!isTeamChannel &&
            (isEditingImage ? (
              <div className="flex gap-3 items-center">
                <DragZone
                  handleFileChange={handleFileChange}
                  width={96}
                  height={96}
                  round={true}
                  imageUrl={imagePreviewUrl || ''}
                />
                <div className="flex flex-col mt-2 space-x-2">
                  <button
                    className="text-primary text-sm"
                    onClick={handleRemoveImage}
                  >
                    Remove Image
                  </button>
                  <button
                    className="text-error text-sm"
                    onClick={() => {
                      setIsEditingImage(false);
                      setImageFile(null);
                      setImagePreviewUrl(channelState.imageUrl);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex relative justify-between items-center w-1/2 space-x-3">
                <div className="flex-1 avatar placeholder">
                  <div className="bg-base-300 text-neutral-content w-24 h-24 rounded-full flex items-center justify-center">
                    {channelState.imageUrl ? (
                      <img
                        src={channelState.imageUrl}
                        alt="Channel"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUserGroup className="text-3xl text-neutral-content" />
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingImage(true)}
                  className="flex-1 text-base-content"
                >
                  edit
                </button>
              </div>
            ))}
          <div className="flex gap-3 mt-6 w-1/2">
            <input
              type="text"
              className={`text-l font-semibold rounded-full  focus:outline-none px-2 py-1 border-none ${
                isEditingTitle
                  ? 'bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary'
                  : 'bg-base-100'
              } `}
              value={channelState.title || ''}
              onChange={handleTitleChange}
              readOnly={!isEditingTitle}
              style={{ width: `${channelState.title!.length + 1}ch` }}
            />
            {!isEditingTitle && (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="flex-1"
              >
                edit
              </button>
            )}
            {isEditingTitle && (
              <button
                className="text-error text-sm"
                onClick={() => {
                  setIsEditingTitle(false);
                  setChannelState(prevState => ({
                    ...prevState,
                    title: channel.name,
                  }));
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Participants</h3>
          <div className="flex flex-col relative gap-3 bg-base-200 p-3 rounded-xl h-[300px] overflow-y-auto">
            <div className="sticky top-0 z-10">
              <input
                type="text"
                placeholder="Search participants..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="input input-sm rounded-full w-full bg-base-200"
              />
            </div>

            {filteredParticipants
              .sort(([usernameA, participantA], [usernameB, participantB]) =>
                participantA.role === UserRole.OWNER
                  ? -1
                  : participantB.role === UserRole.OWNER
                  ? 1
                  : 0
              )
              .map(([username, participant]) => (
                <div
                  key={username}
                  className="flex items-center justify-between bg-base-300 rounded-full px-4 py-2 hover:bg-base-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <div className="avatar">
                      <div className="w-9 rounded-full">
                        {participant.avatarUrl ? (
                          <img
                            src={participant.avatarUrl}
                            alt="User Avatar"
                            className="rounded-full"
                          />
                        ) : (
                          <div className="bg-gray-500 w-9 h-9 flex items-center justify-center rounded-full text-white">
                            {username[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base text-white font-semibold">
                        {username}
                      </span>
                      {participant.role === UserRole.OWNER && (
                        <span className="text-xs text-gray-400">Owner</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {participant.role !== UserRole.OWNER &&
                      username !== currentUsername && (
                        <button
                          className="text-sm text-blue-500 hover:underline"
                          onClick={() =>
                            handleRoleChange(
                              username,
                              participant.role === UserRole.MODERATOR
                                ? UserRole.MEMBER
                                : UserRole.MODERATOR
                            )
                          }
                        >
                          {participant.role === UserRole.MODERATOR
                            ? 'Remove Moderator'
                            : 'Make Moderator'}
                        </button>
                      )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            className="text-sm bg-error text-white px-4 py-2 rounded-full"
            disabled={!isOwner}
            onClick={handleDeleteChannel}
            title={!isOwner ? 'Only the owner can delete this channel' : ''}
          >
            Delete Channel
          </button>
          <button
            className="text-sm bg-success text-white px-4 py-2 rounded-full"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageChannelModal;
