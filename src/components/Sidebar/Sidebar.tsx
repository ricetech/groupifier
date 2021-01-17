import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface SidebarProps {
  name: String;
}
export const Sidebar: React.FC<SidebarProps> = ({ name }) => (
  <div className='sidebar'>
    <div className='sidebar-profile'>
      <div className='default-pfp'>{name}</div>
    </div>
  </div>
);
