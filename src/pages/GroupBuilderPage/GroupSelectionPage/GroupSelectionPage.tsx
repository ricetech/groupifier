import React, { useState, useEffect } from 'react';
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

interface GroupSelectionPageProps {
  participants: Participant[];
  sessionUID: String;
}

export const GroupSelectionPage: React.FC<GroupSelectionPageProps> = ({
  participants,
  sessionUID,
}) => {
  const history = useHistory();
  const [dreamTeam, setDreamTeam] = useState<Participant[]>([]);
  const [nightmareTeam, setNightmareTeam] = useState<Participant[]>([]);
  useEffect(() => {}, []);

  const handleClick = () => {
    const updateParticipantPreferences = functions.httpsCallable(
      'updateParticipantPreferences'
    );
    const dreamParticipantsStrings = dreamTeam.map((p) => p.label);
    const nightmareParticipantsStrings = nightmareTeam.map((p) => p.label);
    updateParticipantPreferences({
      sessionUID,
      DreamParticipants: dreamParticipantsStrings,
      NightmareParticipants: nightmareParticipantsStrings,
    })
      .then((result) => {
        console.log(result);
        history.push('/group-builder/success');
      })
      .catch((e) => console.log(e));
  };

  return (
    <div>
      <Row className='groupifier-container'>groupifier</Row>
      <Row>
        <Col xs={12} className='team-card-container'>
          <TeamCard
            teamCardOption='Dream Team'
            data={participants}
            setTeam={setDreamTeam}
          />
          <TeamCard
            teamCardOption='Nightmare Team'
            data={participants}
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
