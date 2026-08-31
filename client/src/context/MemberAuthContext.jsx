import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const MemberAuthContext = createContext(null);

export function MemberAuthProvider({ children }) {
  const [member, setMember] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("memberToken")
  );
  const [loading, setLoading] = useState(true);

  const memberLogin = async (gymId, credentials) => {
    const response = await api.post(
      `/gyms/${gymId}/members/member-login`,
      credentials
    );

    const { token: newToken, member: loggedInMember } = response.data;

    localStorage.setItem("memberToken", newToken);

    setToken(newToken);
    setMember(loggedInMember);

    return loggedInMember;
  };

  const memberLogout = () => {
    localStorage.removeItem("memberToken");
    setToken(null);
    setMember(null);
  };

  const loadMember = async (currentToken) => {
    try {
      const gymId = getGymIdFromToken(currentToken);

      if (!gymId) {
        throw new Error("Invalid member token");
      }

      const response = await api.get(
        `/gyms/${gymId}/members/me`,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      setMember(response.data.member);
    } catch (error) {
      console.error("Member authentication error:", error);

      localStorage.removeItem("memberToken");
      setToken(null);
      setMember(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("memberToken");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    loadMember(storedToken);
  }, []);

  return (
    <MemberAuthContext.Provider
      value={{
        member,
        token,
        loading,
        isAuthenticated: !!member && !!token,
        memberLogin,
        memberLogout,
      }}
    >
      {children}
    </MemberAuthContext.Provider>
  );
}

function getGymIdFromToken(token) {
  try {
    const payload = JSON.parse(window.atob(token.split(".")[1]));
    return payload.gymId || null;
  } catch {
    return null;
  }
}

export function useMemberAuth() {
  const context = useContext(MemberAuthContext);

  if (!context) {
    throw new Error("useMemberAuth must be used inside MemberAuthProvider");
  }
  return context;
}