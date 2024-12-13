import React, { createContext, useState, useContext } from 'react';

// Membuat context
const UpdateUserContext = createContext();

// Provider untuk context
export const UpdateUserProvider = ({ children }) => {
  const [isUpdateUserSuccess, setIsUpdateUserSuccess] = useState(false);

  return (
    <UpdateUserContext.Provider value={{ isUpdateUserSuccess, setIsUpdateUserSuccess }}>
      {children}
    </UpdateUserContext.Provider>
  );
};

// Hook untuk menggunakan context
export const useUpdateUserContext = () => {
  return useContext(UpdateUserContext);
};
