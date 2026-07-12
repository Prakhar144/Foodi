import { createContext, useCallback, useContext, useState } from 'react';

const NoticeContext = createContext(null);

export const NoticeProvider = ({ children }) => {
  const [notice, setNotice] = useState(null);

  const showNotice = useCallback((type, text) => {
    setNotice({ type, text });
  }, []);

  const clearNotice = useCallback(() => {
    setNotice(null);
  }, []);

  return (
    <NoticeContext.Provider value={{ notice, showNotice, clearNotice }}>
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const ctx = useContext(NoticeContext);
  if (!ctx) throw new Error('useNotice must be used within a NoticeProvider');
  return ctx;
};
