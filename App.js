import * as React from 'react';
import { Provider } from 'react-redux'

import Store from './Store/configureStore'
import Route from './Navigation/Route'

export default function App() {
  return (
    <Provider store={Store}>
      <Route></Route>
    </Provider>
  );
}

