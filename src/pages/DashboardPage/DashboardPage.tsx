import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Sidebar } from '../../components/Sidebar/Sidebar';
import { SessionCard } from '../../components/SessionCard/SessionCard';

export const DashboardPage = () => (
  <Row className='full-row'>
    <Col xs={2}>
      <Sidebar name='Bob' />
    </Col>
    <Col xs={10}>
      <SessionCard
        sessionName='Bob'
        sessionDate='Jan 9th'
        currentParticipants={4}
        totalParticipants={5}
      />
    </Col>
  </Row>
);
