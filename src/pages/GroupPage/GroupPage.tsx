import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Sidebar } from '../../components/Sidebar/Sidebar';
import { TeamCard } from '../../components/TeamCard/TeamCard';

export const GroupPage = () => (
  <Row className='full-row'>
    <Col xs={2}>
      <Sidebar name='Bob' />
    </Col>
    <Col xs={10}>
      <TeamCard
        teamCardOption='Dream Team'
      />
    </Col>
  </Row>
);
