import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
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
    <Card className='session-card'>
      <Card.Header className='session-card-header'>
        <h1 className={isSolved ? 'solved-session-name' : 'session-name'}>
          {' '}
          {sessionName}
        </h1>
        <p className='session-date'>{sessionDate}</p>
      </Card.Header>
      <Card.Body>
        <Button
          variant='secondary'
          className='session-fraction'
          onClick={handleClick}
        >
          {currentParticipants}/{totalParticipants}
        </Button>
      </Card.Body>
    </Card>
  );
};
