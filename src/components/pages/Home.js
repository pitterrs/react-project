import React from "react";
import "../../App.css";
import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

export default function Home() {
  const history = useHistory();
  const { oktaAuth, authState } = useOktaAuth();

  if (!authState) return null;

  const login = async () => history.push("/login");

  const logout = async () => oktaAuth.signOut();

  const button = authState.isAuthenticated ? (
    <button onClick={logout}>Logout</button>
  ) : (
    <button onClick={login}>Login</button>
  );
  return (
    <>
      {button}
      <h1 className="home">Home</h1>
    </>
  );
}
