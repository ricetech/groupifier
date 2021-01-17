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
    <div className='current-session-body'>
      <Row className='button-container'>
        <button type='button' className='create-button' onClick={handleClick}>
          Create new Session
        </button>
      </Row>
      <Row className='session-card-container'>
        <SessionCard
          sessionName='Bob'
          sessionDate='Jan 9th'
          currentParticipants={4}
          totalParticipants={5}
        />
        <SessionCard
          sessionName='Bean'
          sessionDate='Jan 12th'
          currentParticipants={4}
          totalParticipants={20}
        />
      </Row>
    </div>
  );
};
