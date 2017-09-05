import React, { Component } from 'react';
import { auth, provider} from './rebase.js';
import {Button, Image, Dropdown, MenuItem} from 'react-bootstrap';
import LOG from './logger.js';


class Auth extends Component {
    
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
          if (user) {
            if(user.providerData[0].photoURL !== user.photoURL)
              user.updateProfile({
                photoURL: user.providerData[0].photoURL
               });
            if(user.providerData[0].displayName !== user.displayName)
              user.updateProfile({
                displayName: user.providerData[0].displayName
               });
            this.props.isAuthenticated(true, user);
          } 
        });
      }
      login = () =>{
        provider.addScope('https://www.googleapis.com/auth/plus.login');
        auth.signInWithPopup(provider)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            LOG(errorCode+", "+errorMessage+", "+email+", "+credential);
            alert('Error in the login');
          });
      }
    
      logout = () => {
        auth.signOut()
          .then(() => {
            this.props.isAuthenticated(false, null);
          });
      }
      render () {
          return (
              auth.currentUser ?
              <span>
                  <Dropdown id="userLogin" pullRight>
                      <Dropdown.Toggle noCaret className="loginPicture">
                          <Image src={auth.currentUser.photoURL} responsive circle /> 
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          <MenuItem header>{auth.currentUser.displayName}</MenuItem>
                          <MenuItem divider />
                          <MenuItem eventKey="1" onClick={this.logout}>Logout</MenuItem>
                      </Dropdown.Menu>
                  </Dropdown>
                  </span>
                  :
                  <Button bsStyle="primary" bsSize="small" onClick={this.login}>Log In</Button>

          );
      }
}

export default Auth;