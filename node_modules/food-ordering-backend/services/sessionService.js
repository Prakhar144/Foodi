const sessions = new Map();

export const createSession = (user) => {
  const token = `demo_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  sessions.set(token, user.id);
  return token;
};

export const getSessionUserId = (token) => sessions.get(token);

export const deleteSession = (token) => {
  if (token) sessions.delete(token);
};
