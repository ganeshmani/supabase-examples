import { useState, useEffect } from "react";
import { supabaseClient } from "../lib/supabaseClient";
const useUser = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<any>(null);

  useEffect(() => {
    const supabaseSession = supabaseClient.auth.session();
    console.log("supabaseSession", supabaseSession);
    if (supabaseSession?.user?.id) {
      setUser(supabaseSession.user);
      setToken(supabaseSession.access_token);
    }
    setLoading(false);

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.id) {
        setUser(session.user);
        setToken(session.access_token);
      }
      setLoading(false);
    });
  }, [supabaseClient]);

  return {
    user,
    isLoading,
    token,
  };
};

export default useUser;
