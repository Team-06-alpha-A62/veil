import React from 'react';
import './Friends.scss';
import { UserData } from '../../models/UserData';
import { FriendType } from '../../enums/FriendType';
import { UserRole } from '../../enums/UserRole';
import { UserStatus } from '../../enums/UserStatus';

const friendsData: UserData[] = [
  {
    id: '1',
    username: 'mi66o',
    firstName: 'Mihail',
    lastName: 'Petrov',
    email: 'mi66o@example.com',
    avatarUrl: 'https://via.placeholder.com/40',
    status: UserStatus.IN_MEETING,
    teams: {
      'Team 1': UserRole.MODERATOR,
    },
    channels: ['General', 'Development'],
    friends: {
      '2': FriendType.PENDING,
    },
    userSince: 1609459200000, // Unix timestamp for Jan 1, 2021
    notes: ['Met at a conference'],
  },
  {
    id: '2',
    username: 'Bojko',
    firstName: 'Bojidar',
    lastName: 'Ivanov',
    email: 'bojko@example.com',
    avatarUrl: 'https://via.placeholder.com/40',
    status: UserStatus.OFFLINE,
    teams: {
      'Team 2': UserRole.MODERATOR,
    },
    channels: ['Gaming', 'League of Legends'],
    friends: {
      '1': FriendType.PENDING,
    },
    userSince: 1612137600000, // Unix timestamp for Feb 1, 2021
    notes: ['League of Legends buddy'],
    activeDyteMeetingId: 'dyte12345',
    dyteParticipantId: 'participant12345',
  },
  {
    id: '3',
    username: 'Brainwashin',
    firstName: 'Nikolay',
    lastName: 'Dimitrov',
    email: 'brainwashin@example.com',
    avatarUrl: 'https://via.placeholder.com/40',
    status: UserStatus.BUSY,
    teams: {
      'Team 3': UserRole.MODERATOR,
    },
    channels: ['General', 'Random'],
    friends: {
      '1': FriendType.PENDING,
    },
    userSince: 1593561600000,
    notes: ['Shared interest in AI'],
  },
  {
    id: '4',
    username: 'DanielVelinov',
    firstName: 'Daniel',
    lastName: 'Velinov',
    email: 'daniel@example.com',
    avatarUrl: 'https://via.placeholder.com/40',
    status: UserStatus.BUSY,
    teams: {
      'Team 4': UserRole.OWNER,
    },
    channels: ['Work', 'Meetings'],
    friends: {
      '1': FriendType.FRIEND,
    },
    userSince: 1588291200000, // Unix timestamp for May 1, 2020
    notes: ['Always busy'],
  },
  {
    id: '5',
    username: 'Ivailo2111',
    firstName: 'Ivailo',
    lastName: 'Georgiev',
    email: 'ivailo@example.com',
    avatarUrl: 'https://via.placeholder.com/40',
    status: UserStatus.ONLINE,
    teams: {
      'Team 5': UserRole.OWNER,
    },
    channels: ['Development', 'Backend'],
    friends: {
      '1': FriendType.FRIEND,
    },
    userSince: 1596240000000,
    notes: ['Backend enthusiast'],
  },
  {
    id: '6',
    username: 'PlamenGanchev',
    firstName: 'Plamen',
    lastName: 'Ganchev',
    email: 'plamen@example.com',
    avatarUrl: 'https://via.placeholder.com/40',
    status: UserStatus.BUSY,
    teams: {
      'Team 6': UserRole.MEMBER,
    },
    channels: ['General', 'Music'],
    friends: {
      '1': FriendType.FRIEND,
    },
    userSince: 1601510400000, // Unix timestamp for October 1, 2020
    notes: ['Music lover'],
  },
];

const Friends: React.FC = () => {
  const renderStatus = (status: string) => {
    switch (status) {
      case 'Online':
        return (
          <span className="bg-green-500 w-3 h-3 rounded-full absolute bottom-0 right-0 border-2 border-gray-800" />
        );
      case 'DoNotDisturb':
        return (
          <span className="bg-red-500 w-3 h-3 rounded-full absolute bottom-0 right-0 border-2 border-gray-800" />
        );
      case 'Offline':
        return (
          <span className="bg-gray-500 w-3 h-3 rounded-full absolute bottom-0 right-0 border-2 border-gray-800" />
        );
      default:
        return (
          <span className="bg-gray-500 w-3 h-3 rounded-full absolute bottom-0 right-0 border-2 border-gray-800" />
        );
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white max-w-lg mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button className="text-sm font-semibold px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600">
            Online
          </button>
          <button className="text-sm font-semibold px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600">
            All
          </button>
          <button className="text-sm font-semibold px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600">
            Pending
          </button>
          <button className="text-sm font-semibold px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600">
            Suggestions
          </button>
          <button className="text-sm font-semibold px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600">
            Blocked
          </button>
        </div>
        <button className="text-sm font-semibold px-3 py-1 rounded-md bg-green-500 hover:bg-green-600">
          Add Friend
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        {friendsData.map(friend => (
          <div
            key={friend.id}
            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            <div className="relative">
              <img
                src={friend.avatarUrl || 'https://via.placeholder.com/40'}
                alt={friend.username}
                className="w-10 h-10 rounded-full"
              />
              {renderStatus(friend.status)}
            </div>
            <div className="ml-4 flex-1">
              <div className="font-semibold">{friend.username}</div>
              <div className="text-sm text-gray-400">{friend.status}</div>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-400 hover:text-white">💬</button>
              <button className="text-gray-400 hover:text-white">⋮</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Friends;
