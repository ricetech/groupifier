import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Papa from 'papaparse';
import { functions } from '../../../firebase';

interface CreateSessionPageProps {
  hostName: String;
}

export const CreateSessionPage: React.FC<CreateSessionPageProps> = ({
  hostName,
}) => {
  const history = useHistory();
  const [sessionName, setSessionName] = useState('');
  const [sessionGroupSize, setSessionGroupSize] = useState(1);
  const [sessionData, setSessionData] = useState([
    { partipantEmail: '', participantName: '' },
  ]);

  useEffect(() => {
    console.log(sessionData);
  }, [sessionData]);

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSessionName(event.target.value);
  };

  const handleChangeSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSessionGroupSize(+event.target.value);
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
                ParticipantEmail: row2[1],
                ParticipantName: row2[0],
              };
            });
            setSessionData(newData.slice(0, -1));
          }
        },
      });
    }
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const createSession = functions.httpsCallable('createSession');
    createSession({
      SessionName: sessionName,
      HostName: hostName,
      Participants: sessionData,
      GroupSize: sessionGroupSize,
    })
      .then(() => {
        history.push('/dashboard');
      })
      .catch((err) => alert(`Error. Please try again:\n${err}`));
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
          <Form.Control
            type='number'
            value={sessionGroupSize}
            name='name'
            placeholder='Group Size'
            onChange={handleChangeSize}
          />
        </Form.Group>
        <Button variant='light' size='sm' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
  );
};
