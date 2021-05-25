import React from 'react';
import { useUser } from 'reactfire';

const HomePage = () => {
  const { data: user } = useUser();
  return (
    <main>
      Ya inició sesión como {user.displayName}
    </main>
  )
}

export default HomePage;
