const { createStore } = require('redux');
const CapsuleApp = require('.');
const should = require('chai').should();

describe('CapsuleApp unit testing', function() {

  it('should GET_USERNAME', function() {
    const currState = {
        username: ''
    };

    const store = createStore(CapsuleApp, currState);

    const action = {
      type: 'GET_USERNAME',
      username : 'Naincy'
    };

    store.dispatch(action);

    store.getState().should.have.property('username');
    store.getState().should.have.property('username').and.equal('Naincy');
    store.getState().should.have.property('screen');
    store.getState().should.have.property('screen').and.equal('WhatIsYourUsernameScreen');
  });

  it('should SET_USERNAME', function() {

    const currState = {
        username: ''
    };

    const store = createStore(CapsuleApp, currState);

    const action = {
      type: 'SET_USERNAME',
      username : 'Naincy'
    };

    store.dispatch(action);

    store.getState().should.have.property('username');
    store.getState().should.have.property('screen');
    store.getState().should.have.property('username').and.equal('Naincy');
    store.getState().should.have.property('screen').and.equal('ChatScreen');
  });

  it('should LOGOUT_USER', function() {
    const currState = {
        username: ''
    };

    const store = createStore(CapsuleApp, currState);

    const action = {
      type: 'LOGOUT_USER',
      username : ''
    };

    store.dispatch(action);

    store.getState().should.have.property('username');
    store.getState().should.have.property('username').and.equal('');
    store.getState().should.have.property('screen');
    store.getState().should.have.property('screen').and.equal('WhatIsYourUsernameScreen');
  });
})
