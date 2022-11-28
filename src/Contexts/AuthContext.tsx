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
  signOut(): void;
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
      //Adicionar api
      api
        .get("/me")
        .then((reponse) => {
          const { email, permissions, roles } = reponse.data;
          setUser({ email, permissions, roles });
        })
        .catch(() => {
          signOut();
        });
    } else {
      console.log("Nao tem token");
      signOut();
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      api
        .post("/sessions", { email, password })
        .then((reponse) => {
          const { token, refreshToken, permissions, roles } = reponse.data;
          setUser({ email, permissions, roles });
          localStorage.setItem("@authReact:token", token);
          localStorage.setItem("@authReact:refresh-token", refreshToken);

          setUser({ email, roles, permissions });

          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          history.push("/dashboard");
        })
        .catch(() => {
          signOut();
        });
    } catch (error) {
      console.log(error);
    }
  }
  function signOut() {
    localStorage.removeItem("@authReact:token");
    localStorage.removeItem("@authReact:refresh-token");
    history.push("/");
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
