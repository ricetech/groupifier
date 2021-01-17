import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
    // axios.defaults.headers.post['Content-Type'] = 'application/json';
    // axios
    //   .post(
    //     'https://us-central1-groupifier-htn20.cloudfunctions.net/createSession',
    //     {
    //       HostName: 'Test',
    //       HostEmail: 'trash@jpapineau.ca',
    //       SessionName: 'Testing',
    //       Participants: [
    //         {
    //           ParticipantName: 'Jonathan',
    //           ParticipantEmail: 'jonathan@jpapineau.ca',
    //         },
    //         {
    //           ParticipantName: 'Jonathan2',
    //           ParticipantEmail: 'jonapap2001@gmail.com',
    //         },
    //       ],
    //     },
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Accept: '*/*',
    //         Authorization:
    //           'eyJhbGciOiJSUzI1NiIsImtpZCI6IjVmOTcxMmEwODczMTcyMGQ2NmZkNGEyYTU5MmU0ZGZjMmI1ZGU1OTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ3JvdXBpZmllci1odG4yMCIsImF1ZCI6Imdyb3VwaWZpZXItaHRuMjAiLCJhdXRoX3RpbWUiOjE2MTA4NDgxOTgsInVzZXJfaWQiOiJBaXhxVzFXVFc2VUF6bXkza25uZW1kQXRDUkYzIiwic3ViIjoiQWl4cVcxV1RXNlVBem15M2tubmVtZEF0Q1JGMyIsImlhdCI6MTYxMDg0ODE5OSwiZXhwIjoxNjEwODUxNzk5LCJlbWFpbCI6ImpvbmF0aGFuQGpwYXBpbmVhdS5jYSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJqb25hdGhhbkBqcGFwaW5lYXUuY2EiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.t3n4v82ufjp-ygIrLbuw-sl2bDOBKtf8Pf_xBSFNEyLQhzY2F-V4OWJsG35a4EGN8QOa_T0gC_1dNZ-aNEeCGG-5J2LMlGl0f5OUCFM63xrfjVm58VoDO72w8Ltv676KD8nrX3VixuJaVRSSYyvZCxVoZG0nzs7HvKd_JSX6_lLxzkr6J-Z0ZrJfjv6GR6tRnMwTgx-cwzCw5y3Tz978V79mX4htsuG459gQ4mEmonIod5PHUlA9jXTP55uQP0KPdpd75qbQfhtdID07KQ5H3H1W-7v2Q_oqSFAz1aV1UoQolN39wiPczKbCkdbAYfcerZyA0HNJMhAB5zUvEKishg',
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res);
    //     console.log(res.data);
    //   });

    fetch(
      'https://us-central1-groupifier-htn20.cloudfunctions.net/createSession',
      {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'eyJhbGciOiJSUzI1NiIsImtpZCI6IjVmOTcxMmEwODczMTcyMGQ2NmZkNGEyYTU5MmU0ZGZjMmI1ZGU1OTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZ3JvdXBpZmllci1odG4yMCIsImF1ZCI6Imdyb3VwaWZpZXItaHRuMjAiLCJhdXRoX3RpbWUiOjE2MTA4NTAzMDcsInVzZXJfaWQiOiJBaXhxVzFXVFc2VUF6bXkza25uZW1kQXRDUkYzIiwic3ViIjoiQWl4cVcxV1RXNlVBem15M2tubmVtZEF0Q1JGMyIsImlhdCI6MTYxMDg1MDMwOCwiZXhwIjoxNjEwODUzOTA4LCJlbWFpbCI6ImpvbmF0aGFuQGpwYXBpbmVhdS5jYSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJqb25hdGhhbkBqcGFwaW5lYXUuY2EiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Nnjc2pmy8YpXjZ-LHpd3p4Ztf9mUXi3KnNEZp2nyx-zuyjQEtZBxi9YI6kShlATf_Nbi6RVlKfbCrpg4OE70PYJBAkFtXU_YbIFkW-SyH4tMpaiQUl4g7f-DBUdXS4dzNoXw_ZTld7KdbBYC6nM2VtF2vuJMqQZLI3Pupy8k5K9sUNLtw8-q_cHQYXtY-ARjyYg7goIE5DAARTnYUEgKoitkUa42-AYFiCB1nBI5IYBggXht8bNDtu6630moK-hdnyxrnRNFgHd_3F7Ciyj859dJSmIPAZYiuZiQ9Od_Z1LLsacuSTwrLCx9I0wfbcBj98sJyQqj8zIfJMpLAn4FYA',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
          HostName: 'Test',
          HostEmail: 'trash@jpapineau.ca',
          SessionName: 'Testing',
          Participants: [
            {
              ParticipantName: 'Jonathan',
              ParticipantEmail: 'jonathan@jpapineau.ca',
            },
            {
              ParticipantName: 'Jonathan2',
              ParticipantEmail: 'jonapap2001@gmail.com',
            },
          ],
        }), // body data type must match "Content-Type" header
      }
    );

    // fetch(
    //   'https://us-central1-groupifier-htn20.cloudfunctions.net/createSession',
    //   {
    //     method: 'post',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: {
    //       participants: sessionData,
    //     },
    //   }
    // );
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
