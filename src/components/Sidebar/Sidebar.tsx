import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface SidebarProps {
    name: String
}
export const Sidebar: React.FC<SidebarProps> = ({name}) => {
    const defaultPfp = require('../../assets/default_pfp.svg');
    return (
        <div className="sidebar">
            <div className="sidebar-profile">
                
                <div className="default-pfp"></div>
                <span className="username ">{name}</span>
            </div>
        </div>
    )
}