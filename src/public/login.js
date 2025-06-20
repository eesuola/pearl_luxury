document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) {
    document.getElementById("error").textContent = "All fields are required";
    return;
  }
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log('Login response:', data);
    if (data.success) {
      window.sessionStorage.setItem("loggedIn", "true");
      window.sessionStorage.setItem("userName", data.name);
      window.location.href = "/dashboard.html";
    } else {
      document.getElementById("error").textContent =
        data.message || "Login failed";
    }
  } catch (error) {
    document.getElementById("error").textContent = "Error during login";
  }
});
