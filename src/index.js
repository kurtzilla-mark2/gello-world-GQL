import 'dotenv/config';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloProvider,
  ApolloClient,
  createNetworkInterface,
} from 'react-apollo';

import 'antd/dist/antd.css';
import Routes from './routes';

const networkInterface = createNetworkInterface({
  uri:
    process.env.ENVIRONMENT !== 'development'
      ? `${process.env.SERVER_GRAPHQL_ENDPOINT}`
      : `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}${process.env
          .SERVER_GRAPHQL_ENDPOINT}`,
});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }
      req.options.headers['x-token'] = localStorage.getItem('token');
      req.options.headers['x-refresh-token'] = localStorage.getItem(
        'refreshToken',
      );
      next();
    },
  },
]);

networkInterface.useAfter([
  {
    applyAfterware({ response: { headers } }, next) {
      const token = headers.get('x-token');
      const refreshToken = headers.get('x-refresh-token');
      if (token) {
        localStorage.setItem('token', token);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      next();
    },
  },
]);

const client = new ApolloClient({
  networkInterface,
});

const App = () => (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
