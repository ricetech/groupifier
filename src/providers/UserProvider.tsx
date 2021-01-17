import React, { Component, createContext } from 'react';
import 'firebase/auth';
import firebase from 'firebase';

interface State {
  user: firebase.User | null;
}

export const UserContext = createContext<State>({ user: null });

class UserProvider extends Component {
  userState: State;

  constructor() {
    super({});
    this.userState = {
      user: null,
    };
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((userAuth) => {
      // eslint-disable-next-line no-use-before-define
      this.setState({ user: userAuth });
    });
  };

  render() {
    return (
      <UserContext.Provider value={this.userState}>
        {' '}
        {this.props.children}{' '}
      </UserContext.Provider>
    );
  }
}

export default UserProvider;
