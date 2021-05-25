import React from 'react';
import { useUser } from 'reactfire';
import Button from 'react-bootstrap/Button';

import { logout } from '../functions/auth';

const AccountPage = () => {
  const { data: user } = useUser();
  return (
    <section>
      <h2>Cuenta</h2>
      <p>Inició sesión como {user.displayName}</p>
      <Button onClick={logout} variant="danger">
        Cerrar sesión
      </Button>
    </section>
  )
}

export default AccountPage;
