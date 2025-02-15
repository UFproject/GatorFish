import React from 'react';
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { Provider } from 'react-redux'
import store from './store'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  // <App />
  <Provider store={store}>
    <RouterProvider router={router}></RouterProvider>
  </Provider>
  
);


