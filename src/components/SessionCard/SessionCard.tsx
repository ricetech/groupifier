import React, { useState } from 'react';
import { functions } from '../../firebase';

interface SessionCardProps {
  sessionUID: String;
  sessionName: String;
  sessionDate: String;
  currentParticipants: Number;
  totalParticipants: Number;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  sessionUID,
  sessionName,
  sessionDate,
  currentParticipants,
  totalParticipants,
}) => {
  const [isSolved, setIsSolved] = useState(false);
  const handleClick = () => {
    const solveSession = functions.httpsCallable('solveSession');
    solveSession({ SessionUID: sessionUID })
      .then((sessionsResult) => {
        // console.log(result.data);
        setIsSolved(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className='session-card'>
      <div className='session-card-header'>
        <h1 className={isSolved ? 'solved-session-name' : 'session-name'}>
          {' '}
          {sessionName}
        </h1>
        <p className='session-date'>{sessionDate}</p>
      </div>
      <button className='session-fraction' type='button' onClick={handleClick}>
        {currentParticipants}/{totalParticipants}
      </button>
    </div>
  );
};
