import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import { useHistory } from 'react-router-dom';
import { SessionCard } from '../../../components/SessionCard/SessionCard';

interface CurrentSessionsPageProps {
  // eslint-disable-next-line
  sessions: any[];
}

export const CurrentSessionsPage: React.FC<CurrentSessionsPageProps> = ({
  sessions,
}) => {
  const history = useHistory();
  const handleClick = () => {
    history.push('/dashboard/create');
  };

  useEffect(() => {
    console.log(sessions);
  }, [sessions]);

  const cards = sessions.map((session) => (
    <SessionCard
      key={session.SessionUID}
      sessionUID={session.SessionUID}
      sessionName={session.SessionName}
      sessionDate={new Date(1000 * session.SessionDatetime).toDateString()}
      currentParticipants={session.RespondedParticipants}
      totalParticipants={session.TotalParticipants}
    />
  ));

  return (
    <div className='current-session-body'>
      <Row className='button-container'>
        <button type='button' className='create-button' onClick={handleClick}>
          Create new Session
        </button>
      </Row>
      <Row className='session-card-container'>{cards}</Row>
    </div>
  );
};
