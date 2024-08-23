import Chats from '../../components/Chats/Chats';
import Dashboard from '../../components/Dashboard/Dashboard';
import Friends from '../../components/Friends/Friends';
import Meetings from '../../components/Meetings/Meetings';
import Notes from '../../components/Notes/Notes';
import Notifications from '../../components/Notifications/Notifications';
import SidebarNavigation from '../../components/SidebarNavigation/Sidebar';
import Teams from '../../components/Teams/Teams';
import { Route, Routes } from 'react-router-dom';
import './AppContent.scss';

const AppContent = () => {
  return (
    <div className="flex gap-10 h-screen">
      <SidebarNavigation />
      <main className="basis-4/5 p-8 my-8 rounded-3xl overflow-y-auto">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="teams" element={<Teams />} />
          <Route path="chats" element={<Chats />} />
          <Route path="friends" element={<Friends />} />
          <Route path="notes" element={<Notes />} />
          <Route path="meetings" element={<Meetings />} />
        </Routes>
      </main>
      <div className="basis-1/5 rounded-3xl p-8 my-8 bg-base-200 mr-8 flex-shrink-0">
        A sidebar
      </div>
    </div>
  );
};

export default AppContent;
