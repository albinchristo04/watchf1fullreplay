import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { DashboardIcon } from '../../components/icons/DashboardIcon';
import { VideoIcon } from '../../components/icons/VideoIcon';
import { DocumentTextIcon } from '../../components/icons/DocumentTextIcon';
import { CogIcon } from '../../components/icons/CogIcon';

const AdminLayout: React.FC = () => {
  const baseLinkClass = "flex items-center px-4 py-3 text-gray-300 hover:bg-f1-gray hover:text-white rounded-lg transition-colors";
  const activeLinkClass = "bg-f1-red text-white";

  return (
    <div className="container mx-auto flex flex-col md:flex-row gap-8 p-4 sm:p-6 lg:p-8">
      <aside className="md:w-64 flex-shrink-0 bg-f1-light-dark p-4 rounded-lg shadow-lg">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">Admin Menu</h2>
        <nav className="flex flex-row md:flex-col gap-2">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`}
          >
            <DashboardIcon className="mr-3" />
            <span className="font-semibold">Dashboard</span>
          </NavLink>
          <NavLink 
            to="/admin/replays"
            className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`}
          >
            <VideoIcon className="mr-3" />
             <span className="font-semibold">Replays</span>
          </NavLink>
          <NavLink 
            to="/admin/articles"
            className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`}
          >
            <DocumentTextIcon className="mr-3" />
             <span className="font-semibold">Articles</span>
          </NavLink>
          <NavLink 
            to="/admin/settings"
            className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`}
          >
            <CogIcon className="mr-3" />
             <span className="font-semibold">Settings</span>
          </NavLink>
        </nav>
      </aside>
      <div className="flex-grow bg-f1-light-dark p-6 rounded-lg shadow-lg min-h-[60vh]">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
