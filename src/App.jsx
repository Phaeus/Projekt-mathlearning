import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import history from './history';
import Collection from './components/Collection/Collection';
import CreateCollection from './components/Collection/CreateCollection';
import MainPage from './components/MainPage';
import Login from './components/User/Login';
import User from './components/User/User';
import Signin from './components/User/Signin';
import GameResults from './components/Collection/GameResults';
import EditCollection from './components/Collection/EditCollection';

//<Route path="/collections/:id/:username" exact component={UserstatsAccordion} />
function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={MainPage} />
        <Route path="/collections/:id" exact component={Collection} />
        <Route path="/createCollection" exact component={CreateCollection} />
        <Route path="/user" exact component={User} />
        <Route path="/login" exact component={Login} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/user/:username" exact component={User} />
        <Route path="/collection/:id/gameresults" exact component={GameResults} />
        <Route path="/user/:username/editCollection/:id" exact component={EditCollection} />
      </Switch>
    </Router>
  );
}

export default App;
