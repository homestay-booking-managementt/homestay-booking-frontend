export const removeTokens = (shouldReload = true) => {
  localStorage.removeItem("id_token");
  localStorage.removeItem("refresh_token");

  if (shouldReload) {
    window.location.href = "/login";
  }
};
