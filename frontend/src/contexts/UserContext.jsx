import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // Initialize state from localStorage or default values
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { _id: '', fullName: '', email: '' };
  });

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user._id) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
