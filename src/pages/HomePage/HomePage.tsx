import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { LoginCard } from '../../components/LoginCard/LoginCard';

export const HomePage = () => (
  <Row className='full-row justify-content-md-center'>
    <Col xs={12} md={8} lg={4} className='align-self-center'>
      <LoginCard />
    </Col>
  </Row>
);
