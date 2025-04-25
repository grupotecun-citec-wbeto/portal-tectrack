import React, { useState } from 'react';
import { useUserRepository } from '../hooks/useUserRepository';

import { Button, Input } from '@chakra-ui/react';
import { use } from 'react';

export default function UserList() {
  const { users, createUser, deleteUser } = useUserRepository();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div>
      <h2>Users</h2>
      <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <Button bg="red" onClick={() => {
        createUser(name, email);
        setName('');
        setEmail('');
      }}>Add</Button>

      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email}) ({user.id})
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
