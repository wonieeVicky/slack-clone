import React from 'react';
import { render } from 'react-dom';

import App from '@layouts/App';
import { BrowserRouter } from 'react-router-dom';
import SWRDevtools from '@jjordy/swr-devtools';

render(
  <BrowserRouter>
    {process.env.NODE_ENV === 'production' ? (
      <App />
    ) : (
      <SWRDevtools>
        <App />
      </SWRDevtools>
    )}
  </BrowserRouter>,
  document.querySelector('#app'),
);
