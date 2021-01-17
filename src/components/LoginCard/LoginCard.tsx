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
      Groupifier is a web app that allows classrooms or teams to easily generate
      the optimal group for you!.
    </p>
    <Form>
      <FormGroup controlId='loginFormEmail'>
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
  </div>
);
