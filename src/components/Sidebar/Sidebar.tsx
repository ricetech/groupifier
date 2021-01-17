import React from 'react';

interface SidebarProps {
  name: String;
}
export const Sidebar: React.FC<SidebarProps> = ({ name }) => (
  <div className='sidebar'>
    <div className='sidebar-profile'>
      <div className='default-pfp' />
      <span className='username '>{name}</span>
    </div>
  </div>
);
