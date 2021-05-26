import React from 'react';
import { AuthCheck } from 'reactfire';
import Container from 'react-bootstrap/Container';

import LoginPage from './pages/Login';
import DocumentsPage from './pages/Documents';
import AccountPage from './pages/Account';
import StoreContextProvider from './components/Store';

function App() {
  return (
    <Container fluid className="pt-3 pb-3">
      <header>
        <h1>StudyLater App v0.2.0</h1>
        <p>Lleva contigo tus PDFs y estudia más tarde</p>
      </header>
      <AuthCheck fallback={<LoginPage />}>
        <StoreContextProvider>
          <DocumentsPage />
        </StoreContextProvider>
        <AccountPage />
      </AuthCheck>
    </Container>
  );
}

export default App;
