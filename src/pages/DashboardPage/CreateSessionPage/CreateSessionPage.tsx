import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const CreateSessionPage = () => {
  const [sessionName, setSessionName] = useState('');
  const [sessionData, setSessionData] = useState(new File([''], 'filename'));

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSessionName(event.target.value);
  };

  const handleChangeData = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSessionData(event.target.files[0]);
    }
  };

  return (
    <Row className='full-row'>
      <Col xs={4}>
        <form>
          <input
            type='text'
            value={sessionName}
            name='name'
            placeholder='Session Name'
            onChange={handleChangeName}
          />
          <input type='file' name='file' onChange={handleChangeData} />
        </form>
      </Col>
    </Row>
  );
};
