import React, { useState } from 'react';
import { Channel } from '../../models/Channel';
import {
  updateParticipantRole,
  updateChannelName,
  changeChannelImage,
} from '../../services/channel.service';
import DragZone from '../DragZone/DragZone';
import { getChannelImage } from '../../utils/TransformDataHelpers';
import { uploadImage } from '../../services/storage.service';
import { UserRole } from '../../enums/UserRole';
import { Participant } from '../../models/Participant';

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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    channelState.imageUrl
  );

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
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-base-200 bg-opacity-75 flex justify-center items-center z-10">
      <div className="relative w-[400px] bg-base-300 rounded-3xl p-6 shadow-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl">
          &times;
        </button>
        <div className="flex flex-col items-center mb-6">
          <DragZone
            handleFileChange={handleFileChange}
            width={96}
            height={96}
            round={true}
            imageUrl={imagePreviewUrl || ''}
          />
          <input
            type="text"
            className="text-xl font-semibold mt-4"
            value={channelState.title || ''}
            onChange={handleTitleChange}
          />
          <button
            className="text-orange-500 mt-1 text-sm"
            onClick={handleRemoveImage}
          >
            Remove Image
          </button>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Participants</h3>
          <div className="flex flex-col gap-3">
            {Object.entries(channelState.participants).map(
              ([username, participant]) => (
                <div
                  key={username}
                  className="flex items-center justify-between bg-gray-100 rounded-full px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={participant.avatarUrl}
                      alt={username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {participant.role !== 'owner' && (
                      <>
                        <button
                          className="text-xs text-blue-500"
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
                      </>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div className="flex justify-between mt-6">
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
