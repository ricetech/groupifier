import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHistory } from 'react-router-dom';
import { Participant } from '../../../interfaces';
import { functions } from '../../../firebase';

import { TeamCard } from '../../../components/TeamCard/TeamCard';

const dummydata: Participant[] = [
  { value: 'Bob@email.com', label: 'Bob' },
  { value: 'qwd@email.com', label: 'Bewe' },
  { value: 'Bqwdob@email.com', label: 'afdsf' },
  { value: 'ergre@email.com', label: 'qwdqwdqwdqwdqwdqwddwqwdqw' },
  { value: 'Bergob@email.com', label: '23rqwd23' },
  { value: 'reg@email.com', label: 'wefewqdqwdqwdwf' },
  { value: 'Bob@email.com', label: '6' },
  { value: 'Bregrob@email.com', label: 'wef' },
];

export const GroupSelectionPage = () => {
  const history = useHistory();
  const handleClick = () => {
    const updateParticipantPreferences = functions.httpsCallable(
      'updateParticipantPreferences'
    );
    updateParticipantPreferences({}).then((result) => {
      // Read result of the Cloud Function.
      const sanitizedMessage = result.data.text;
    });
    history.push('/group-builder/success');
  };

  const [dreamTeam, setDreamTeam] = useState<Participant[]>([]);
  const [nightmareTeam, setNightmareTeam] = useState<Participant[]>([]);

  return (
    <div>
      <Row className='groupifier-container'>groupifier</Row>
      <Row>
        <Col xs={10} className='team-card-container'>
          <TeamCard
            teamCardOption='Dream Team'
            data={dummydata}
            setTeam={setDreamTeam}
          />
          <TeamCard
            teamCardOption='Nightmare Team'
            data={dummydata}
            setTeam={setNightmareTeam}
          />
        </Col>
      </Row>
      <Row>
        <button
          type='button'
          className='button-submit-group'
          onClick={handleClick}
        >
          Submit
        </button>
      </Row>
    </div>
  );
};
