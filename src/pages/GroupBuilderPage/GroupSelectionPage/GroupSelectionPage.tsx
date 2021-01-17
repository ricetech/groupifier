import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHistory } from 'react-router-dom';
import { Participant } from '../../../interfaces';
import { functions } from '../../../firebase';

import { TeamCard } from '../../../components/TeamCard/TeamCard';

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

  const handleClick = () => {
    const updateParticipantPreferences = functions.httpsCallable(
      'updateParticipantPreferences'
    );
    const dreamParticipantsStrings = dreamTeam.map((p) => p.value);
    const nightmareParticipantsStrings = nightmareTeam.map((p) => p.value);
    updateParticipantPreferences({
      SessionUID: sessionUID,
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
