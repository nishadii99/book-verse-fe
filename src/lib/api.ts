const API_BASE_URL = 'https://book-verse-backend-beige.vercel.app/api/v1';

// Auth token management
export const getToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};
export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// API helpers
const authHeaders = () => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  return data;
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (email: string, password: string, firstname: string, lastname: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstname, lastname }),
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(response);
  },
};

// Books API
export const booksApi = {
  getAll: async (page = 1) => {
    const response = await fetch(`${API_BASE_URL}/book/all?page=${page}`);
    return handleResponse(response);
  },

  search: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/book/search?query=${encodeURIComponent(query)}`);
    return handleResponse(response);
  },

  create: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/book/create`, {
      method: 'POST',
      headers: { ...authHeaders() },
      body: formData,
    });
    return handleResponse(response);
  },

  update: async (id: string, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/book/${id}`, {
      method: 'POST',
      headers: { ...authHeaders() },
      body: formData,
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/book/${id}`, {
      method: 'DELETE',
      headers: { ...authHeaders() },
    });
    return handleResponse(response);
  },
};

// Orders API
export const ordersApi = {
  place: async (items: { bookId: string; quantity: number }[]) => {
    const response = await fetch(`${API_BASE_URL}/orders/place`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ items }),
    });
    return handleResponse(response);
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/all`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: { ...authHeaders() },
    });
    return handleResponse(response);
  },

  updateStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};

// Cart API
export const cartApi = {
  add: async (bookId: string, quantity: number) => {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ bookId, quantity }),
    });
    return handleResponse(response);
  },
};

// AI Recommend API
export const recommendApi = {
  search: async (text: string): Promise<{ data: string }> => {
    const response = await fetch(`${API_BASE_URL}/recommend/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ text }),
    });
    return handleResponse(response);
  },
};

// Types
export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  roles: string[];
}

export interface Book {
  _id: string;
  title: string;
  price: number;
  description: string;
  quantity?: number;
  author: string;
  imageURL: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  bookId: {
    _id: string;
    title: string;
    price: number;
    description?: string;
  } | null;
  quantity: number;
  _id: string;
}

export interface Order {
  _id: string;
  userId: {
    _id: string;
    email: string;
  };
  items: OrderItem[];
  totalCost: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
