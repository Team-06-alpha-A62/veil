import React, { useState, useEffect } from 'react';
import { Team } from '../../models/Team';
import TeamCard from '../TeamCard/TeamCard';
import CreateTeamModal from '../CreateTeamModal/CreateTeamModal';
import {
  listenToTeamMemberStatusChanges,
  listenToTeamsChange,
} from '../../services/teams.service';
import { useAuth } from '../../providers/AuthProvider';

const Teams: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [joinedTeamsOnly, setJoinedTeamsOnly] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeMembersCountMap, setActiveMembersCountMap] = useState<
    Record<string, number>
  >({});
  const unsubscribeFunctions: Array<() => void> = [];

  useEffect(() => {
    const unsubscribeTeams = listenToTeamsChange(fetchedTeams => {
      setTeams(fetchedTeams);

      fetchedTeams.forEach(team => {
        const unsubscribe = listenToTeamMemberStatusChanges(
          team.id,
          team.members,
          (teamId, activeCount) => {
            setActiveMembersCountMap(prevVal => ({
              ...prevVal,
              [teamId]: activeCount,
            }));
          }
        );
        unsubscribeFunctions.push(unsubscribe);
      });
    });

    return () => {
      unsubscribeTeams();
      unsubscribeFunctions.forEach(unsub => unsub());
    };
  }, []);

  const filteredTeams = teams.filter(team => {
    const isJoinedTeam = team.members[currentUser.userData!.username];
    const matchesSearch = team.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return (joinedTeamsOnly ? isJoinedTeam : true) && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-10 rounded-3xl p-6 bg-base-300 bg-opacity-50 h-full">
      <div className="flex gap-10 items-center mb-4">
        <CreateTeamModal />
        <input
          type="text"
          placeholder="Search"
          className="w-2/4 px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-primary text-white"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <label className="flex self-end space-x-2 ml-auto">
          <span>Joined Teams</span>
          <input
            type="checkbox"
            className="toggle"
            checked={joinedTeamsOnly}
            onChange={() => setJoinedTeamsOnly(prev => !prev)}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredTeams.map(team => (
          <TeamCard
            key={team.id}
            team={team}
            onlineMembersCount={activeMembersCountMap[team.id] || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default Teams;
