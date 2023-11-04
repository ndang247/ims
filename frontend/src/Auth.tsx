import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { User, postLogin, postLogout, postSignUp } from "./api";
import { IUser } from "./types";

interface AuthContextInterface {
  currentUser: IUser | null;
  /**
   * @summary Signs in a user via their email and password.
   * @param {string} username The user's email address.
   * @param {string} password The user's password.
   * @returns Promise
   */
  login: (username: string, password: string) => void;

  signup: (
    fullname: string,
    username: string,
    password: string,
    role: string,
    email: string,
    phone: string,
    abn: string,
    address: string
  ) => void;

  /**
   * @summary Signs out the currently authenticated user.
   * @returns Promise
   */
  logout: () => void;

  /**
   * @summary Loading state when fetching user
   * @description This often appears when user reload the pages
   *
   */
  loading: boolean;
}

const AuthContext = createContext<AuthContextInterface>({
  currentUser: null,
  login(username, password) {
    console.log("nothing login", username, password);
  },
  signup(fullname, username, password, role, email, phone, abn, address) {
    console.log(
      "nothing signup",
      fullname,
      username,
      password,
      role,
      email,
      phone,
      abn,
      address
    );
  },
  logout() {
    console.log("nothin logout");
  },
  loading: false,
});

/**
 * @returns currentUser => The currently logged in user.
 * @returns register(name, phone, email, password) => Function for creating a new member.
 * @returns login(email, password) => Funtion for signing a user into the application.
 * @returns logout() => Funtion for signing a user out.
 */
export const useAuth = () => useContext(AuthContext);

/**
 * @summary Wrapper which provides access to the auth context.
 *
 * @description
 * Using this context as a wrapper around the app's router
 * allows routes to access currentUser and authentication methods.
 */
export function AuthProvider({ children }: { children?: React.ReactNode }) {
  const [currentUser, setcurrentUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string) => {
    const { user } = await postLogin(username, password);
    if (user) {
      setcurrentUser({ ...user });
    }
  };

  const signup = async (
    fullname: string,
    username: string,
    password: string,
    role: string,
    email: string,
    phone: string,
    abn: string,
    address: string
  ) => {
    const { user } = await postSignUp(
      fullname,
      username,
      password,
      role,
      email,
      phone,
      abn,
      address
    );
    if (user) {
      setcurrentUser({ ...user });
    }
  };

  const logout = async () => {
    postLogout();
    setcurrentUser(null);
  };

  /**
   * When a user signs in, their details are set in the { currentUser } object.
   * When a user signs out, { currentUser } is set to null.
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setcurrentUser(null);
    } else {
      setLoading(true);
      User.getCurrent()
        .then((user) => {
          setcurrentUser(user);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const contextValues = useMemo<AuthContextInterface>(
    () => ({
      currentUser,
      login,
      signup,
      logout,
      loading,
    }),
    [currentUser, loading]
  );

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
}
