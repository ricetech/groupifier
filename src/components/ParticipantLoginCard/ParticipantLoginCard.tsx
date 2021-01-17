import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import FormText from 'react-bootstrap/FormText';
import Button from 'react-bootstrap/Button';

import Modal from 'react-bootstrap/Modal';
import logo from '../../assets/logo.png';

import { auth } from '../../firebase';

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: `https://groupifier.space/group-builder${window.location.search}`,
  handleCodeInApp: true,
};

export const ParticipantLoginCard = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [showFail, setShowFail] = useState(false);

  const handleClose = () => setShowSuccess(false);
  const handleCloseFail = () => setShowFail(false);

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleContinueClick = (event: React.FormEvent) => {
    event.preventDefault();
    auth
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('pEmailForSignIn', email);
        // Send successful!

        // Disable button
        setEmailSent(true);

        setShowSuccess(true);
      })
      .catch((error) => {
        setShowFail(true);
        console.log(error);
        // Send failed. Show code & message to user, also in a tooltip
      });
  };

  return (
    <div className='ParticipantLoginCard'>
      <img src={logo} className='logo' alt='logo' />
      <h1 className='Title'>groupifier</h1>
      <p className='AboutText'>
        A group generator that cares about the preferences of each person.
      </p>
      <Form>
        <FormGroup controlId='loginFormEmail'>
          <FormControl
            type='email'
            placeholder='Your email'
            value={email}
            onChange={handleChangeEmail}
          />
          <FormText className='text-muted'>
            NOTE: Only for Participants. Hosts should use homepage.
          </FormText>
        </FormGroup>

        <Button
          variant='primary'
          type='submit'
          disabled={emailSent}
          onClick={handleContinueClick}
        >
          Continue
        </Button>
      </Form>

      <Modal
        show={showSuccess}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Check your email for a link to continue the login process.
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showFail}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Error!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Error! There seems to be an issue. Try again.</Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={handleCloseFail}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
