const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL;

export type AuthResponse = {
  jwt: string;
  user: any;
};

function saveSession(data: AuthResponse) {
  localStorage.setItem("jwt", data.jwt);
  localStorage.setItem("user", JSON.stringify(data.user));
}

export async function signIn(identifier: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${STRAPI_URL}/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await res.json();
  saveSession(data);
  return data;
}

export async function signUp(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${STRAPI_URL}/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  const data = await res.json();
  saveSession(data);
  return data;
}

export function logout() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
  window.location.href = "/";
}

export function isLoggedIn(): boolean {
  return Boolean(localStorage.getItem("jwt"));
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function getToken(): string | null {
  return localStorage.getItem("jwt");
}
