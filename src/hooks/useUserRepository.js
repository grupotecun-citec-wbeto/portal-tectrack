import { useEffect, useState } from 'react';
import UserRepository from '../repositories/local/userRepository';

export function useUserRepository() {
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    const allUsers = UserRepository.findAll();
    setUsers(allUsers);
  };

  const createUser = (name, email) => {
    UserRepository.create(name, email);
    loadUsers();
  };

  const deleteUser = (id) => {
    UserRepository.deleteById(id);
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    createUser,
    deleteUser
  };
}
