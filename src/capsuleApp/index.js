function CapsuleApp(currState, action) {

  switch(action.type) {
    case 'LOGOUT_USER':
      return Object.assign({}, {
        username: '',
        screen: 'WhatIsYourUsernameScreen'
      })

    case 'GET_USERNAME':
      return Object.assign({}, {
        username: action.username,
        screen: 'WhatIsYourUsernameScreen'
      })

    case 'SET_USERNAME':
      return Object.assign({}, {
        screen: 'ChatScreen',
        username: action.username
      })

    default:
      return currState;
  }
}

module.exports = CapsuleApp;
