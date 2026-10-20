import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type Auth = {
  user: User | null;
  loading: boolean;
  error: string;
  recovery: boolean;
};
const AuthContext = createContext<Auth>({
  user: null,
  loading: true,
  error: "",
  recovery: false,
});
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Auth>({
    user: null,
    loading: true,
    error: "",
    recovery: false,
  });
  const generation = useRef(0);
  useEffect(() => {
    const db = supabase;
    if (!db) {
      setState({ user: null, loading: false, error: "", recovery: false });
      return;
    }
    let live = true;
    // Defer getUser outside the auth callback to avoid holding Supabase's auth lock.
    const validate = (recovery = false) => {
      const current = ++generation.current;
      void db.auth
        .getUser()
        .then(({ data, error }) => {
          if (live && current === generation.current)
            setState((previous) => ({
              user: data.user,
              loading: false,
              error:
                error && error.name !== "AuthSessionMissingError"
                  ? "Your session could not be verified. Please sign in again."
                  : "",
              recovery: recovery || previous.recovery,
            }));
        })
        .catch(() => {
          if (live && current === generation.current)
            setState({
              user: null,
              loading: false,
              error:
                "Could not verify your session. Check your connection and reload.",
              recovery: false,
            });
        });
    };
    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((event, session) => {
      if (!session) {
        generation.current++;
        setState({ user: null, loading: false, error: "", recovery: false });
      } else {
        setTimeout(() => {
          if (live) validate(event === "PASSWORD_RECOVERY");
        }, 0);
      }
    });
    validate();
    return () => {
      live = false;
      generation.current++;
      subscription.unsubscribe();
    };
  }, []);
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
