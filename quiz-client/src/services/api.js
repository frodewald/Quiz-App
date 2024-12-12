export const BASE_URL = "http://localhost:8000"
// export const BASE_URL = "https://quiz-app-c871.onrender.com"

export const CHECK_AUTH = `${BASE_URL}/auth/status`;

export const USER_API_ENDPOINT = {
  getUser: `${BASE_URL}/api/user/profile`,
  login: `${BASE_URL}/api/login`,
  logout: `${BASE_URL}/api/logout`,
  register: `${BASE_URL}/api/register`,
  updateUser: `${BASE_URL}/api/user/update/profile`,
  getUserId: `${BASE_URL}/get-user`
}

export const RECORD_API_ENDPOINT = {
  postRecord: `${BASE_URL}/api/record/post`,
  getAllRecords: `${BASE_URL}/api/record/getAllRecords`
}