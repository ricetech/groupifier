import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormText from 'react-bootstrap/FormText';
import Button from 'react-bootstrap/Button';

import { auth } from '../../firebase';

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'https://groupifier.space/dashboard',
  handleCodeInApp: true,
};

export const LoginCard = () => {
  const [email, setEmail] = useState('');

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleContinueClick = (event: React.FormEvent) => {
    event.preventDefault();
    auth
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
        // Send successful!
        // Disable button
        // Show tooltip telling user to check their email
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMsg = error.message;
        // Send failed. Show code & message to user, also in a tooltip
      });
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

        <Button variant='primary' type='submit' onClick={handleContinueClick}>
          Continue
        </Button>
      </Form>
    </div>
  );
};
