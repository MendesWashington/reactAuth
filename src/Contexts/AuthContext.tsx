import { createContext, ReactNode, useEffect, useState } from "react";

import { useHistory } from "react-router-dom";

import { api } from "../services/api";

type User = {
  email: string;
  roles: string[];
  permissions: string[];
};
type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const history = useHistory();
  const [user, setUser] = useState<User>({} as User);
  const isAuthenticated = !!user;

  useEffect(() => {
    const token = localStorage.getItem("@authReact:token") || "";

    if (token) {
      setUser({
        email: "mendesswashington@gmail.com",
        roles: ["Administrador", "Usuário"],
        permissions: ["Administrador.editar, Usuário.editar"],
      });
      console.log("tem token");
    } else {
      console.log("Nao tem token");
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const roles = ["Administrador", "Usuário"];
      const permissions = ["Administrador.editar, Usuário.editar"];
      const token = "asdfujsdnbfçlsdhnfosdfhnsldfkhnsdolf";
      const refreshToken = "asdfpsuidgybfsd7pfujds";
      console.log({ email, password });

      localStorage.setItem("@authReact:token", token);
      localStorage.setItem("@authReact:refresh-token", refreshToken);

      setUser({ email, roles, permissions });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      history.push("/Dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
