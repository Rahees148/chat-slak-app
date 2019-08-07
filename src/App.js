import React, { Component } from 'react'
import PropTypes from 'prop-types'
import UsernameForm from './components/UsernameForm'
import ChatScreen from './ChatsScreen'
import {connect} from 'react-redux'

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    screen: PropTypes.string,
  };

  constructor(props) {
    super(props)
    this.state = {
      currentUsername: ''
    }
    this.onUsernameSubmitted = this.onUsernameSubmitted.bind(this)
    this.onUserLogout = this.onUserLogout.bind(this)
  }

  onUsernameSubmitted(username) {
    this.props.dispatch({
      type: 'GET_USERNAME',
      username
    });
  }

  onUserLogout() {
    this.props.dispatch({
      type: 'LOGOUT_USER'
    });
    localStorage.removeItem('subscribedRooms');
    localStorage.removeItem('isLoggedIn');
  }

  render() {
    if (this.props.currentUsername && ! localStorage.getItem('isLoggedIn')) {
      localStorage.setItem('isLoggedIn', this.props.currentUsername);
    }
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if ( ! isLoggedIn) {
      localStorage.removeItem('subscribedRooms');
    }

    return (
      <div>{
        ! isLoggedIn ? <UsernameForm onSubmit={this.onUsernameSubmitted} />
          : <ChatScreen currentUsername={isLoggedIn} onLogout={this.onUserLogout} />
      }</div>
    )
  }
}

const mapStateToProps = (state) => ({
  screen: state.screen,
  currentUsername : state.username
});

export default connect(mapStateToProps) (App)
