import React from 'react';
import Button from 'react-bootstrap/Button';

import { loginWithGoogle } from '../functions/auth';

const LoginPage = () => (
  <main>
    <Button onClick={loginWithGoogle}>
      Iniciar sesión con Google
    </Button>
  </main>
)

export default LoginPage;
