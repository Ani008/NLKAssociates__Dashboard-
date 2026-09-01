// import axios from "axios";

// export const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5555";

// const API = axios.create({
//   baseURL: `${BACKEND_URL}/api`,
// });

// export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

export default API;