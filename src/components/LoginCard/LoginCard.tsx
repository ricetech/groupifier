import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormText from 'react-bootstrap/FormText';
import Button from 'react-bootstrap/Button';

export const LoginCard = () => {
  const [email, setEmail] = useState('');

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <div className='LoginCard'>
      <img src='' />
      <h1 className='Title'>groupifier</h1>
      <p className='AboutText'>
        Groupifier is a web app that allows classrooms or teams to easily
        generate the optimal group assignments.
      </p>
      <h2>Sign-up/sign-in as a Host</h2>
      <p className='SignInWarning'>
        Note: This sign-up/sign-in is for Hosts ONLY.
      </p>
      <p>
        <b>
          If you are a participant, please use the link sent to your email
          instead.
        </b>
      </p>
      <Form>
        <FormGroup controlId='loginFormEmail'>
          <FormLabel>Email Address</FormLabel>
          <FormControl
            type='email'
            placeholder='Your email'
            value={email}
            onChange={handleChangeEmail}
          />
          <FormText className='text-muted'>
            NOTE: Only for Hosts. Participants should use the link sent to their
            email.
          </FormText>
        </FormGroup>

        <Button variant='primary' type='submit'>
          Continue
        </Button>
      </Form>
    </div>
  );
};
