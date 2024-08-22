import Chats from '../../components/Chats/Chats';
import Dashboard from '../../components/Dashboard/Dashboard';
import Friends from '../../components/Friends/Friends';
import Meetings from '../../components/Meetings/Meetings';
import Notes from '../../components/Notes/Notes';
import Notifications from '../../components/Notifications/Notifications';
import SidebarNavigation from '../../components/SidebarNavigation/Sidebar';
import Teams from '../../components/Teams/Teams';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
const AppContent = () => {
  return (
    <>
      <SidebarNavigation />;
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="teams" element={<Teams />} />
        <Route path="chats" element={<Chats />} />
        <Route path="friends" element={<Friends />} />
        <Route path="notes" element={<Notes />} />
        <Route path="meetings" element={<Meetings />} />
      </Routes>
    </>
  );
};

export default AppContent;
