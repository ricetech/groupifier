import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Participant } from '../../interfaces';

import { Sidebar } from '../../components/Sidebar/Sidebar';
import { TeamCard } from '../../components/TeamCard/TeamCard';

const dummydata: Participant[] = [{ value: 'Bob@email.com', label: 'Bob' }];

export const GroupBuilderPage = () => (
  <Row className='full-row'>
    <Col xs={2}>
      <Sidebar name='Bob' />
    </Col>
    <Col xs={10}>
      <TeamCard teamCardOption='Dream Team' data={dummydata} />
    </Col>
  </Row>
);
