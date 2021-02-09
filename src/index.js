import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import rootReducer from './reducers'
import * as actions from './actions'
import {onAuthStateChanged} from './helpers'
import { syncAllPlans } from 'helpers/syncStore';

export const store = createStore(rootReducer)

onAuthStateChanged((isAuthenticated) => {
  store.dispatch({type: actions.IS_AUTHENTICATE, isAuthenticated})
  syncAllPlans()
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
})

// store.subscribe(() => console.log('State', store.getState()))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
