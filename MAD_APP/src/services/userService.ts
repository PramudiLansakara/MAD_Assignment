const API_URL = 'http://localhost:5000/api/auth'; 
interface ApiResponse {
  token: string;
}

// Register User
export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData.message || 'An error occurred';
    }

    const data: ApiResponse = await response.json();
    return data.token;

  } catch (error) {
    return 'An unexpected error occurred';
  }
};

// Login User
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData.message || 'An error occurred';
    }

    const data: ApiResponse = await response.json();
    return data.token;

  } catch (error) {
    return 'An unexpected error occurred';
  }
};
