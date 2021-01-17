import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHistory } from 'react-router-dom';
import { Participant } from '../../../interfaces';

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
    history.push('/group-builder/success');
  };

  return (
    <div>
      <Row className='groupifier-container'>groupifier</Row>
      <Row>
        <Col xs={10} className='team-card-container'>
          <TeamCard teamCardOption='Dream Team' data={dummydata} />
          <TeamCard teamCardOption='Nightmare Team' data={dummydata} />
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
