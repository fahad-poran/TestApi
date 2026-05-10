const API_URL = 'http://localhost:5149/api';

// Mock data for offline development
const MOCK_USERS = {
  'admin': { token: 'mock-admin-token', role: 'Admin', username: 'admin' },
  'user': { token: 'mock-user-token', role: 'User', username: 'user' }
};

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
  role: string;
  username: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
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
  } catch (error) {
    // Fallback to mock authentication for demo credentials
    if (credentials.username === 'admin' && credentials.password === 'Hello@123') {
      const mockData = {
        token: MOCK_USERS['admin'].token,
        expiration: new Date(Date.now() + 60*60*1000).toISOString(),
        role: MOCK_USERS['admin'].role,
        username: MOCK_USERS['admin'].username
      };
      localStorage.setItem('token', mockData.token);
      localStorage.setItem('role', mockData.role);
      localStorage.setItem('username', mockData.username);
      return mockData as LoginResponse;
    } else if (credentials.username === 'user' && credentials.password === 'User@123') {
      const mockData = {
        token: MOCK_USERS['user'].token,
        expiration: new Date(Date.now() + 60*60*1000).toISOString(),
        role: MOCK_USERS['user'].role,
        username: MOCK_USERS['user'].username
      };
      localStorage.setItem('token', mockData.token);
      localStorage.setItem('role', mockData.role);
      localStorage.setItem('username', mockData.username);
      return mockData as LoginResponse;
    }
    throw error;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};
