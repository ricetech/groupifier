import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Papa from 'papaparse';

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
  const buttonRef = React.createRef();
  return (
    <div className='form-card'>
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
    </div>
  );
};
