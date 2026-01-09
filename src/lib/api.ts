import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

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

// Helper to extract error message from axios error
export const getErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error)) {
    // Check for response error message
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    // Network error
    if (error.message) {
      return error.message;
    }
  }
  // Fallback
  return error?.message || 'An unexpected error occurred';
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // No refresh token available, clear tokens and reject
        clearTokens();
        processQueue(error, null);
        isRefreshing = false;

        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        console.log('Attempting to refresh token...');

        // Use a separate axios instance to avoid interceptor loop
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Refresh response:', refreshResponse.data);

        // Handle different possible response structures
        const responseData = refreshResponse.data.data || refreshResponse.data;
        const { accessToken, refreshToken: newRefreshToken } = responseData;

        if (!accessToken) {
          throw new Error('No access token in refresh response');
        }

        // Store new tokens
        setTokens(accessToken, newRefreshToken || refreshToken);
        console.log('Tokens refreshed successfully');

        // Update the authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Process queued requests
        processQueue(null, accessToken);

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        console.error('Token refresh failed:', refreshError.response?.data || refreshError.message);

        // Refresh failed, clear tokens and redirect to login
        processQueue(refreshError as AxiosError, null);
        clearTokens();

        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string, firstname: string, lastname: string) => {
    const response = await apiClient.post('/auth/register', { email, password, firstname, lastname });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Books API
export const booksApi = {
  getAll: async (page = 1) => {
    const response = await apiClient.get(`/book/all?page=${page}`);
    return response.data;
  },

  search: async (query: string) => {
    const response = await apiClient.get(`/book/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await apiClient.post('/book/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData) => {
    const response = await apiClient.post(`/book/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/book/${id}`);
    return response.data;
  },
};

// Orders API
export const ordersApi = {
  place: async (items: { bookId: string; quantity: number }[]) => {
    const response = await apiClient.post('/orders/place', { items });
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get('/orders/all');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
};

// Cart API
export const cartApi = {
  add: async (bookId: string, quantity: number) => {
    const response = await apiClient.post('/cart/add', { bookId, quantity });
    return response.data;
  },
};

// AI Recommend API
export const recommendApi = {
  search: async (text: string): Promise<{ data: string }> => {
    const response = await apiClient.post('/recommend/search', { text });
    return response.data;
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
