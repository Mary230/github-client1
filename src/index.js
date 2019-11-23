import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import App from './App';

import registerServiceWorker from './registerServiceWorker';
import NotFound from "./Components/NotFound";

const cache = new InMemoryCache();

const GITHUB_BASE_URL = 'https://api.github.com/graphql';

const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    authorization: `Bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`,
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/profile" children={()=><h2>profile</h2>} />
        <Route path="/contact" children={()=><h2>Contact</h2>} />
        <Route component={NotFound}/>
      </Switch>
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
);

registerServiceWorker();
