import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'http://192.168.1.13:5000/api/auth';

interface ApiResponse {
  token: string;
}


export const registerUser = async (name: string, email: string, password: string): Promise<string> => {
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
      throw new Error(errorData.message || 'An error occurred');
    }

    const data: ApiResponse = await response.json();
    return data.token;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'An unexpected error occurred');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Login User
export const loginuser = async (email: string, password: string) => {
  const response = await fetch("http://192.168.1.13:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to sign in. Please check your credentials.");
  }

  const data = await response.json();
  return data; // Assuming the data contains token and possibly other information
};
