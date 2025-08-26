import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }) {
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  const openSubscribeModal = () => setIsSubscribeModalOpen(true);
  const closeSubscribeModal = () => setIsSubscribeModalOpen(false);

  const value = {
    isSubscribeModalOpen,
    openSubscribeModal,
    closeSubscribeModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}