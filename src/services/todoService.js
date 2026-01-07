const API_URL = "https://69583b896c3282d9f1d4a368.mockapi.io/api/v1/todos";

/**
 * Utility for making requests with retries on network or server errors (5xx).
 * Uses exponential backoff.
 */
const fetchWithRetry = async (
  url,
  options = {},
  retries = 3,
  backoff = 1000
) => {
  try {
    const response = await fetch(url, options);

    // Only 5xx errors warrant a retry
    if (response.status >= 500 && retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }

    return response;
  } catch (error) {
    // Network errors (internet connection, timeouts)
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "Something went wrong within the API call");
  }
  return response.json();
};

export const todoService = {
  getAll: async () => {
    const response = await fetchWithRetry(API_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return handleResponse(response);
  },

  create: async (data) => {
    const response = await fetchWithRetry(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id, data) => {
    const response = await fetchWithRetry(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetchWithRetry(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },
};
