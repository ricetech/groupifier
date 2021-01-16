import React from 'react';

interface SessionCardProps {
  sessionName: String;
  sessionDate: String;
  currentParticipants: Number;
  totalParticipants: Number;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  sessionName,
  sessionDate,
  currentParticipants,
  totalParticipants,
}) => (
  <div className='session-card'>
    <img src='' />
    <h1 className='session-name'> {sessionName}</h1>
    <p className='session-date'>{sessionDate}</p>
    <p className='session-fraction'>
      {currentParticipants}/{totalParticipants}
    </p>
  </div>
);
