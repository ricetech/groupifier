import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Papa from 'papaparse';
import axios from 'axios';
import { functions } from '../../../firebase';

export const CreateSessionPage = () => {
  const [sessionName, setSessionName] = useState('');
  const [sessionData, setSessionData] = useState([
    { partipantEmail: '', participantName: '' },
  ]);

  useEffect(() => {
    console.log(sessionData);
  }, [sessionData]);

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSessionName(event.target.value);
  };

  const handleChangeData = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      // eslint-disable-next-line
      let newData: any[] = [];
      await Papa.parse(event.target.files[0], {
        complete: (results) => {
          if (results.data) {
            newData = results.data.map((row) => {
              // eslint-disable-next-line
              const row2 = row as any[];
              return {
                partipantEmail: row2[0],
                participantName: row2[1],
              };
            });
            setSessionData(newData);
          }
        },
      });
    }
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const createSession = functions.httpsCallable('createSession');
    createSession({ Participants: sessionData })
      .then((result) => {
        const sanitizedMessage = result.data.text;
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className='form-card'>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control
            type='text'
            value={sessionName}
            name='name'
            placeholder='Session Name'
            onChange={handleChangeName}
          />
          <Form.File
            id='exampleFormControlFile1'
            label='Upload CSV'
            onChange={handleChangeData}
          />
        </Form.Group>
        <Button variant='light' size='sm' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
  );
};
