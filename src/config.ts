
// Configuration file for the backend FastApi endpoint

export const config = {
  //FastAPI backend endpoint
  // PythonURL: 'http://localhost:8000/',
  // //NEXTJS frontend endpoint
  // NextURL : 'http://localhost:3000/',
  
  // Prod
  PythonURL: process.env.BACKEND_URL,
  NextURL : process.env.NEXT_PUBLIC_APP_URL,
}