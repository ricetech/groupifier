import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GroupBuilderSuccessPage } from './GroupBuilderSuccessPage/GroupBuilderSuccessPage';
import { GroupSelectionPage } from './GroupSelectionPage/GroupSelectionPage';

import { Participant } from '../../interfaces';

import { Sidebar } from '../../components/Sidebar/Sidebar';

import { auth, functions } from '../../firebase';

export const GroupBuilderPage = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [sessionUID, setSessionUID] = useState('');

  useEffect(() => {
    if (auth.isSignInWithEmailLink(window.location.href)) {
      let email = window.localStorage.getItem('pEmailForSignIn');
      if (!email) {
        email = window.prompt(
          'Please provide your email to complete the sign-in process.'
        );
      }

      if (!email) {
        email = '';
      }
      auth
        .signInWithEmailLink(email, window.location.href)
        .then(() => {
          window.localStorage.removeItem('pEmailForSignIn');

          const uid = new URL(window.location.href).searchParams.get('sid');
          console.log(uid);
          if (uid) {
            setSessionUID(uid);
          }

          history.replace(`/group-builder?sid=${uid}`);
          const setParticipantFirebaseUID = functions.httpsCallable(
            'setParticipantFirebaseUID'
          );
          setParticipantFirebaseUID().catch((e) => {
            console.log(e);
          });

          const getSessionParticipants = functions.httpsCallable(
            'getSessionParticipants'
          );
          getSessionParticipants({ SessionUID: uid })
            .then((result) => {
              console.log(result.data);

              const newParticipants: Participant[] = result.data.Participants.map(
                // eslint-disable-next-line
                (d: any) => ({
                  label: d.ParticipantName,
                  value: d.ParticipantID,
                })
              );
              setParticipants(newParticipants);
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((error) => {
          alert(error);
          auth.signOut().finally(() => history.push('/'));
        });
    }
  }, []);

  return (
    <div>
      <Row className='full-row'>
        <Col xs={2}>
          <Sidebar name='A' />
        </Col>
        <Col xs={10}>
          <Router>
            <Switch>
              <Route path={`${match.path}/success`}>
                <GroupBuilderSuccessPage />
              </Route>
              <Route path={`${match.path}/`}>
                <GroupSelectionPage
                  participants={participants}
                  sessionUID={sessionUID}
                />
              </Route>
            </Switch>
          </Router>
        </Col>
      </Row>
    </div>
  );
};
