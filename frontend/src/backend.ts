import axios from 'axios'
export const api = import.meta.env.VITE_API_URL


export async function fetchCurrentPolls(page: number) {
  const response = await axios.get(`${api}/api/polls?page=${page}`)
  return response.data
}