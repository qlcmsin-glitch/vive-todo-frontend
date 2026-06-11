const API_BASE = `${import.meta.env.VITE_API_BASE}/api/todos`;

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || '요청에 실패했습니다.');
  }

  if (response.status === 204) return null;
  return response.json();
}

export function fetchTodos(dateKey) {
  const query = dateKey ? `?dateKey=${dateKey}` : '';
  return request(`${API_BASE}${query}`);
}

export function createTodo(data) {
  return request(API_BASE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTodo(id, data) {
  return request(`${API_BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteTodo(id) {
  return request(`${API_BASE}/${id}`, { method: 'DELETE' });
}
