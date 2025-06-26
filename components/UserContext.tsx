import React, { createContext, ReactNode, useContext, useState } from 'react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  joinDate: string;
}

interface UserContextType {
  user: UserProfile | null;
  updateProfile: (profile: Partial<UserProfile>) => void;
  logout: () => void;
  setUser: (user: UserProfile) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    address: '123 Main St, City, Country',
    avatar: 'https://via.placeholder.com/150',
    joinDate: new Date().toISOString(),
  });

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      return { ...currentUser, ...profile };
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateProfile,
        logout,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 