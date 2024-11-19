import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import router from '../routes/Router.jsx';
import { RouterProvider } from 'react-router-dom';
import { ContextProvider } from '../Providers/ContextProvider.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ContextProvider>
        <RouterProvider router={router} />
     </ContextProvider>
  </StrictMode>
  
)
