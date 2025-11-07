import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import App from './App.jsx'
import AgeGate from './pages/AgeGate.jsx'
import Store from './pages/Store.jsx'
import Terms from './pages/Terms.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'   // 👈 add this
import './styles.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <AgeGate /> },   // /
      { path: 'store', element: <Store /> },   // /store
      { path: 'terms', element: <Terms /> },   // /terms
      { path: 'contact', element: <Contact /> }, // /contact
      { path: '*', element: <NotFound /> },   // catch-all
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
