const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL;

export async function signIn(identifier: string, password: string) {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  if (!res.ok) {
    throw new Error('Invalid credentials');
  }

  return res.json();
}

export async function signUp(
  username: string,
  email: string,
  password: string
) {
  const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    throw new Error('Registration failed');
  }

  return res.json();
}
