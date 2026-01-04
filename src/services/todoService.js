const API_URL = "https://69583b896c3282d9f1d4a368.mockapi.io/api/v1/todos";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "Something went wrong within the API call");
  }
  return response.json();
};

export const todoService = {
  getAll: async () => {
    const response = await fetch(API_URL);
    return handleResponse(response);
  },

  create: async (data) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id, data) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },
};
