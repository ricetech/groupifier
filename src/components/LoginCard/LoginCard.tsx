import React from 'react';
import Button from 'react-bootstrap/Button';

export const LoginCard = () => (
  <div className='LoginCard'>
    <img src='' />
    <h1 className='Title'>groupifier</h1>
    <p className='AboutText'>
      Groupifier is a web app that allows classrooms or teams to easily generate
      the optimal group assignments.
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
    <button type='button'>Email Auth Button</button>
  </div>
);
