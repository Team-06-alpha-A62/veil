import React, { useState } from 'react';
import { UserData } from '../../models/UserData';
import { FriendType } from '../../enums/FriendType';
import { UserRole } from '../../enums/UserRole';
import { UserStatus } from '../../enums/UserStatus';
import './Sidebar.scss';
import UserStatusIndicator from '../UserStatusIndicator/UserStatusIndicator';

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
    userSince: 1609459200000,
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
    userSince: 1612137600000,
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
    userSince: 1588291200000,
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
    userSince: 1601510400000,
    notes: ['Music lover'],
  },
];

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Online');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFriends = friendsData.filter(friend => {
    const matchesCategory =
      selectedCategory === 'All' ||
      friend.status.toUpperCase() === selectedCategory.toUpperCase();
    const matchesSearch = friend.username
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="basis-1/5 rounded-3xl p-6 my-8 bg-base-300 bg-opacity-50 mr-8 flex-shrink-0 text-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          {['Online', 'All', 'Pending'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-sm font-semibold px-3 py-1 rounded-lg ${
                selectedCategory === category ? '#fe764c' : 'bg-gray-700'
              } hover:bg-gray-600 transition-colors`}
            >
              {category}
            </button>
          ))}
        </div>
        <button className="text-sm font-semibold px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 transition-colors">
          Add Friend
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
      </div>

      <div className="space-y-4 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
        {filteredFriends.length ? (
          filteredFriends.map(friend => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-4 bg-secondary rounded-lg shadow hover:bg-secondary-focus transition-colors"
            >
              <div className="relative flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={friend.avatarUrl || 'https://via.placeholder.com/40'}
                    alt={friend.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <UserStatusIndicator status={friend.status} absolute={true} />
                </div>
                <div>
                  <div className="font-semibold">{friend.username}</div>
                  <div className="text-sm text-gray-400">
                    {friend.status.toLowerCase()}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-white">💬</button>
                <button className="text-gray-400 hover:text-white">⋮</button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No friends found.</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
