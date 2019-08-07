import { takeLatest, call, put } from "redux-saga/effects";
import { getUsers } from './services';

export default function* sagas() {
  yield takeLatest("GET_USERNAME", takeChatDashboard);
  yield takeLatest("LOGOUT_USER", logoutUser);
}

// worker saga: makes the api call when watcher saga sees the action
function* takeChatDashboard(action) {
  try {
    const username = yield call(getUsers, action.username);
    yield put({ type: 'SET_USERNAME', username })
  } catch (error) {
    yield put({ type: "API_CALL_FAILURE", error });
  }
}

function* logoutUser() {
}
    