// const API_URL = 'http://localhost:5001/api';

 const API_URL = 'http://localhost:5149/api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  if (!response.ok) throw new Error('Login failed');
  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('role', data.role);
  localStorage.setItem('username', data.username);
  return data;
};
