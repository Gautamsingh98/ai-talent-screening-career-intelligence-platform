export const logout = (navigate) => {
  // Remove JWT token
  localStorage.removeItem("token");

  // Remove user information if stored
  localStorage.removeItem("user");

  // Redirect to login page
  navigate("/login");
};