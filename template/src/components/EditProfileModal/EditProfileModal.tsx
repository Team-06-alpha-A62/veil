import React, { useState, useEffect } from 'react';
import { UserStatus } from '../../enums/UserStatus';
import DragZone from '../DragZone/DragZone';
import {
  updateUserProfile,
  getUserByHandle,
} from '../../services/user.service';
import { FaPencilAlt } from 'react-icons/fa';
import { UserData } from '../../models/UserData';
import { uploadImage } from '../../services/storage.service';
import UserStatusIndicator from '../UserStatusIndicator/UserStatusIndicator';

interface EditProfileModalProps {
  username: string;
  onClose: () => void;
  onSave: (updatedProfile: Partial<UserData>) => void;
}

const statusOptions = [
  {
    label: 'Online',
    value: UserStatus.ONLINE,
    color: 'bg-green-500',
    description: 'You are online.',
  },
  {
    label: 'Away',
    value: UserStatus.AWAY,
    color: 'bg-yellow-500',
    description: 'You are idle.',
  },
  {
    label: 'Do Not Disturb',
    value: UserStatus.BUSY,
    color: 'bg-red-500',
    description: 'You will not receive any notifications.',
  },
  {
    label: 'Offline',
    value: UserStatus.OFFLINE,
    color: 'bg-gray-500',
    description: 'You appear offline.',
  },
];

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  username,
  onClose,
  onSave,
}) => {
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditingAvatar, setIsEditingAvatar] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserByHandle(username);
        setUserData(data);
        setNewAvatarUrl(data.avatarUrl || null);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchData();
  }, [username]);

  const handleSaveChanges = async () => {
    try {
      let updatedAvatarUrl = newAvatarUrl;

      if (imageFile) {
        updatedAvatarUrl = await uploadImage(imageFile);
        setNewAvatarUrl(updatedAvatarUrl);
      }

      const updatedProfile: Partial<UserData> = {
        avatarUrl: updatedAvatarUrl,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        status: userData.status,
      };

      // Use the existing updateUserProfile function
      await updateUserProfile(username, updatedProfile);
      onSave(updatedProfile);
      onClose(); // Ensure the modal closes after saving
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setNewAvatarUrl(previewUrl);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-base-200 bg-opacity-75 flex justify-center items-center z-10">
      <div className="relative bg-base-100 flex flex-col gap-5 rounded-3xl p-6 shadow-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl">
          &times;
        </button>

        <div className="flex gap-5">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative mb-4">
              {!isEditingAvatar ? (
                <div className="relative">
                  <img
                    src={newAvatarUrl || userData.avatarUrl || ''}
                    alt="Avatar"
                    className="w-36 h-36 rounded-full object-cover"
                  />
                  <button
                    onClick={() => setIsEditingAvatar(true)}
                    className="absolute bottom-2 right-2 bg-base-300 p-2 rounded-full"
                  >
                    <FaPencilAlt className="text-white" />
                  </button>
                </div>
              ) : (
                <div className="relative flex flex-col items-center">
                  <DragZone
                    handleFileChange={handleFileChange}
                    width={144}
                    height={144}
                    imageUrl={newAvatarUrl || userData.avatarUrl || ''}
                    round={true}
                  />
                  <button
                    className="absolute -bottom-6 text-error text-sm"
                    onClick={() => {
                      setIsEditingAvatar(false);
                      setImageFile(null);
                      setNewAvatarUrl(userData.avatarUrl || null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={userData.firstName || ''}
              onChange={e =>
                setUserData(prev => ({ ...prev, firstName: e.target.value }))
              }
              placeholder="First Name"
            />
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={userData.lastName || ''}
              onChange={e =>
                setUserData(prev => ({ ...prev, lastName: e.target.value }))
              }
              placeholder="Last Name"
            />
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={userData.phoneNumber || ''}
              onChange={e =>
                setUserData(prev => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
              placeholder="Phone Number"
            />
          </div>

          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-semibold">Change Status</h3>
            <div className="space-y-3">
              {statusOptions.map(option => (
                <div
                  key={option.value}
                  className="relative flex items-center justify-between p-3 bg-base-200 rounded-lg cursor-pointer"
                  onClick={() =>
                    setUserData(prev => ({ ...prev, status: option.value }))
                  }
                >
                  <div className="flex items-center space-x-3">
                    <UserStatusIndicator
                      status={option.value}
                      absolute={false}
                    />
                    <span>{option.label}</span>
                  </div>
                  {userData.status === option.value && (
                    <FaPencilAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-success" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            className="text-sm bg-error text-white px-4 py-2 rounded-full"
            onClick={onClose}
          >
            Cancel
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

export default EditProfileModal;
