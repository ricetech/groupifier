import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHistory } from 'react-router-dom';
import { Participant } from '../../../interfaces';

import { TeamCard } from '../../../components/TeamCard/TeamCard';

const dummydata: Participant[] = [{ value: 'Bob@email.com', label: 'Bob' }];

export const GroupSelectionPage = () => {
  const history = useHistory();
  const handleClick = () => {
    history.push('/group-builder/success');
  };

  return (
    <div>
      <Row>
        <button type='button' className='button-success' onClick={handleClick}>
          Submit
        </button>
      </Row>

      <Row className='full-row'>
        <Col xs={10}>
          <TeamCard teamCardOption='Dream Team' data={dummydata} />
        </Col>
      </Row>
    </div>
  );
};
