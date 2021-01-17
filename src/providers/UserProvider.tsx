import React, { Component, createContext } from 'react';
import 'firebase/auth';
import firebase from 'firebase';

interface State {
  user: firebase.User | null;
}

export const UserContext = createContext<State>({ user: null });

class UserProvider extends Component {
  state: State = {
    user: null,
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((userAuth) => {
      this.setState({ user: userAuth });
    });
  };
  render() {
    return (
      <UserContext.Provider value={this.state}>
        {' '}
        {this.props.children}{' '}
      </UserContext.Provider>
    );
  }
}

export default UserProvider;
