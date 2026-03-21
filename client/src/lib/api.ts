import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

export interface SearchResponse {
  success: boolean;
  data: {
    results: SearchResult[];
    searchInformation: any;
    searchParameters: any;
    query: string;
    page: number;
    timestamp: string;
  };
}

export interface HistoryItem {
  _id: string;
  query: string;
  timestamp: string;
  resultCount: number;
  searchTime: number;
}

export interface HistoryResponse {
  success: boolean;
  data: {
    searches: HistoryItem[];
    totalPages: number;
    currentPage: number;
    total: number;
  };
}

export const searchAPI = {
  performSearch: async (query: string, page: number = 1): Promise<SearchResponse> => {
    const response = await api.post('/search', { query, page });
    return response.data;
  },

  getSearchHistory: async (page: number = 1, limit: number = 20): Promise<HistoryResponse> => {
    const response = await api.get(`/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  deleteSearchHistory: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/history/${id}`);
    return response.data;
  },

  clearAllHistory: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete('/history');
    return response.data;
  }
};

export default api;
