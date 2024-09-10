import Chats from '../../components/Channels/Channels';
import Dashboard from '../../components/Dashboard/Dashboard';
import Meetings from '../../components/Meetings/Meetings';
import Notes from '../../components/Notes/Notes';
import SidebarNavigation from '../../components/SidebarNavigation/Sidebar';
import Teams from '../../components/Teams/Teams';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../hoc/ProtectedRoute';
import Sidebar from '../../components/Sidebar/Sidebar';
import Team from '../../components/Team/Team';
import NotificationToasts from '../../components/NotificationToasts/NotificationToasts';

const AppContent = () => {
  return (
    <ProtectedRoute>
      <div className="flex gap-10 h-screen p-8">
        <SidebarNavigation />
        <main className="basis-4/5 flex flex-col">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="teams" element={<Teams />} />
            <Route path="teams/:teamId" element={<Team />} />
            <Route
              path="teams/:teamId/channels/:channelId"
              element={<Team />}
            />
            <Route path="chats" element={<Chats />}>
              <Route path="" element={<Chats />} />
              <Route path="group/:id" element={<Chats />} />
              <Route path="direct/:id" element={<Chats />} />
            </Route>
            <Route path="notes" element={<Notes />} />
            <Route path="meetings" element={<Meetings />} />
          </Routes>
        </main>
        <Sidebar />
        <NotificationToasts />
      </div>
    </ProtectedRoute>
  );
};

export default AppContent;
