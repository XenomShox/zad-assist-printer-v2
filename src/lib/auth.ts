import { api } from "@/api";

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<User> => {
  const { data: loginData } = await api.post("/auth/jwt/create/", {
    email,
    password,
  });
  const { access, refresh } = loginData;

  localStorage.setItem("zad-assist-jwt-access", access);
  localStorage.setItem("zad-assist-jwt-refresh", refresh);

  const { data: user } = await api.get("/auth/users/me", {
    headers: { Authorization: `JWT ${access}` },
  });

  return user;
};

export const fetchCurrentUser = async (): Promise<User> => {
  const jwt = localStorage.getItem("zad-assist-jwt-access");
  if (!jwt) throw new Error("No token");

  const verify_res = await api.post("/auth/jwt/verify/", { token: jwt });
  if (verify_res.status === 401) {
    const refresh_jwt = localStorage.getItem("zad-assist-jwt-refresh");
    if (!refresh_jwt) throw new Error("No refresh token");

    const refresh_res = await api.post("/auth/jwt/refresh/", {
      refresh: refresh_jwt,
    });

    if (refresh_res.status === 401) throw new Error("Invalid refresh token");

    const { access } = refresh_res.data;
    localStorage.setItem("zad-assist-jwt-access", access);
  }

  const { data: user } = await api.get("/auth/users/me");

  return user;
};

export const logoutUser = () => {
  localStorage.removeItem("zad-assist-jwt-access");
  localStorage.removeItem("zad-assist-jwt-refresh");
};
