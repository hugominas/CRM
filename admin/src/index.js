/* eslint-disable import/default */

import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import configureStore from './store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';

require('./favicon.ico'); // Tell webpack to load favicon.ico
import './assets/styles/styles.scss'; // Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.
import './assets/styles/react-redux-toastr.min.css'

const store = configureStore();

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <div>
      <Router history={history} routes={routes} />
      <ReduxToastr
       timeOut={4000}
       newestOnTop={false}
       preventDuplicates={true}
       position="top-right"
       transitionIn="bounceIn"
       transitionOut="bounceOut"
       progressBar/>
     </div>
  </Provider>, document.getElementById('app')
);
