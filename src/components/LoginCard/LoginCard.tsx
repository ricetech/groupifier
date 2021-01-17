import React from 'react';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import FormText from 'react-bootstrap/FormText';
import Button from 'react-bootstrap/Button';

export const LoginCard = () => (
  <div className='LoginCard'>
    <img src='' />
    <h1 className='Title'>groupifier</h1>
    <p className='AboutText'>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unk
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
        <FormControl type='email' placeholder='Your email' />
        <FormText className='text-muted'>
          NOTE: Only for Hosts. Participants should use the link sent to their
          email.
        </FormText>
      </FormGroup>

      <Button variant='primary' type='submit'>
        Continue
      </Button>
    </Form>
    <button type='button'>Email Auth Button</button>
  </div>
);
