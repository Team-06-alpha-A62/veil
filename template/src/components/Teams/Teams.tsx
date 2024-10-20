import { useState, useEffect } from 'react';
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
  const [, setActiveMembersCountMap] = useState<Record<string, number>>({});
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
    <div className="flex flex-col gap-10 rounded-3xl p-6 bg-base-300 h-full">
      <div className="flex gap-10 items-center mb-4">
        <CreateTeamModal />
        <input
          type="text"
          placeholder="Search"
          className="w-2/4 px-4 py-2 rounded-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary text-base-content"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <label className="flex self-end space-x-2 ml-auto">
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={joinedTeamsOnly}
            onChange={() => setJoinedTeamsOnly(prev => !prev)}
          />
          <span className="text-base-content text-sm">Joined Teams</span>
        </label>
      </div>

      <div className="grid grid-cols-1  md:grid-cols-4 gap-4">
        {filteredTeams.map(team => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
};

export default Teams;
