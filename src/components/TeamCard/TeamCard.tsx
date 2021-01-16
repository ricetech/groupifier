import React from 'react';

interface TeamCardProps {
  teamCardOption: String;
}

export const TeamCard: React.FC<TeamCardProps> = ({ teamCardOption }) => (
  <div className='team-card'>
    <img src='' />
    <h1 className='team-title'>Build Your</h1>
    <p className='team-option'>{teamCardOption}</p>
  </div>
);
