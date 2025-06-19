document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!username || !password) {
    document.getElementById('error').textContent = 'All fields are required';
    return;
  }
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.success) {
      window.location.href = '/dashboard.html';
    } else {
      document.getElementById('error').textContent = data.message || 'Login failed';
    }
  } catch (error) {
    document.getElementById('error').textContent = 'Error during login';
  }
});
