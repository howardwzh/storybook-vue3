import fetch from "../utils/fetch.ts"
export const getUsers = async () => {
  const response = await fetch.get('/api/users')
  return {
    data:{
      errCode:"0",
      data: {
        list: response
      }
    }
  }
}