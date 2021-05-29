import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import Map from "./pages/Map";

const App = () => {
  return (
  <Router>
  <Switch>
       {/* <Route path='/cameroon'>
            <Cameroon />
       </Route> */}
       <Route>
            <Map />
       </Route>
  </Switch>
</Router>)
}

export default App;
