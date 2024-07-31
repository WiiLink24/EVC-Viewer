import axios from 'axios'
export const api = import.meta.env.VITE_API_URL


export async function fetchCurrentPolls(page: number, language: string, limit?: number, type?: 'all' | 'n' | 'w') {
  const response = await axios.get(`${api}/api/polls?page=${page}${limit ? `&limit=${limit}` : ''}${type ? `&type=${type}` : ''}&language=${language}`)
  return response.data
}

export async function fetchPoll(id: number, language: string, country?: number, region?: number, details?: boolean) {
  const response = await axios.get(`${api}/api/polls/poll/${id}?language=${language} ${country ? `&country=${country}` : ''}${region ? `&region=${region}` : ''} ${details ? `&details=${details}` : ''}`)	
  return response.data
}