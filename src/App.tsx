import React from 'react';
import { AuthCheck } from 'reactfire';
import Container from 'react-bootstrap/Container';

import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import AccountPage from './pages/Account';

function App() {
  return (
    <Container fluid className="pt-3 pb-3">
      <header>
        <h1>StudyLater App v0.1.1</h1>
        <p>Lleva contigo tus PDFs y estudia más tarde</p>
      </header>
      <AuthCheck fallback={<LoginPage />}>
        <HomePage />
        <AccountPage />
      </AuthCheck>
    </Container>
  );
}

export default App;
