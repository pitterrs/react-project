import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import React from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import Home from "./components/pages/Home";
import { BrowserRouter as Router, useHistory, Switch, Route } from "react-router-dom";
import Schedules from "./components/pages/Schedules";
import Help from "./components/pages/Help";
import ContactUs from "./components/pages/ContactUs";
import "./test.css"
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import Login from './Login';
import { oktaAuthConfig, oktaSignInConfig } from './config'; 

function App() {
  const history = useHistory();
  const oktaAuth = new OktaAuth(oktaAuthConfig);
  const customAuthHandler = () => {
    history.push('/login');
  };
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || "/", window.location.origin));
  };


  return (
    <div className="d-flex">
      <div className="uxf-sticky-footer">
        <div className="uxf-main-content">
          <Router>
            <Navbar />
            <Security
              oktaAuth={oktaAuth}
              onAuthRequired={customAuthHandler}
              restoreOriginalUri={restoreOriginalUri}
            >
              <Switch>
              <Route
                  path="/"
                  render={({ match: { url } }) => (
                <>
                <Route path="/" exact={true} component={Home} />
                <SecureRoute path={"/schedules"} exact={true} component={Schedules} />
                <SecureRoute path="/help" component={Help} />
                <Route path="/contact-us" component={ContactUs} />
                <Route path='/login' render={() => <Login config={oktaSignInConfig} />} />
                <Route path='/login/callback' component={LoginCallback} />
                </>
                )}
                />
              </Switch>
            </Security>
          </Router>
        </div>
      </div>
    </div>
  );
}

export default App;
