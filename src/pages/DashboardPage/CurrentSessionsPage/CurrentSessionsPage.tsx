import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHistory } from 'react-router-dom';
import { SessionCard } from '../../../components/SessionCard/SessionCard';

export const CurrentSessionsPage = () => {
  const history = useHistory();
  const handleClick = () => {
    history.push('/dashboard/create');
  };

  return (
    <div>
      <Row>
        <button type='button' className='create-button' onClick={handleClick}>
          Create new Session
        </button>
      </Row>
      <Row>
        <SessionCard
          sessionName='Bob'
          sessionDate='Jan 9th'
          currentParticipants={4}
          totalParticipants={5}
        />
      </Row>
    </div>
  );
};
