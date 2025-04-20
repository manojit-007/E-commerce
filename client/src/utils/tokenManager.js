// src/utils/tokenManager.js
export const tokenManager = {
    saveToken: (token) =>{
      console.log(token);
       localStorage.setItem("token", token)},
    clearToken: () => localStorage.removeItem("token"),
    getToken: () => localStorage.getItem("token"),
  };
  