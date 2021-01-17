import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Papa from 'papaparse';
import axios from 'axios';

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post(
        'https://us-central1-groupifier-htn20.cloudfunctions.net/createSession',
        { participants: sessionData }
      )
      .then((res) => {
        console.log(res);
        console.log(res.data);
      });
  };

  return (
    <div className='form-card'>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={sessionName}
          name='name'
          placeholder='Session Name'
          onChange={handleChangeName}
        />
        <input type='file' name='file' onChange={handleChangeData} />
        <input type='submit' value='Submit' />
      </form>
    </div>
  );
};
