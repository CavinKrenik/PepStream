import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import App from './App.jsx'

// Pages
import AgeGate from './pages/AgeGate.jsx'
import Store from './pages/Store.jsx'
import Terms from './pages/Terms.jsx'
import Privacy from './pages/Privacy.jsx'
import Refund from './pages/Refund.jsx'
import Disclaimer from './pages/Disclaimer.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import ResearchInfo from './pages/ResearchInfo.jsx'

import './styles.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <AgeGate /> },    // /
      { path: 'store', element: <Store /> },    // /store
      { path: 'research', element: <ResearchInfo /> }, // /research
      { path: 'terms', element: <Terms /> },    // /terms
      { path: 'privacy', element: <Privacy /> }, // /privacy
      { path: 'refund', element: <Refund /> },   // /refund
      { path: 'disclaimer', element: <Disclaimer /> }, // /disclaimer
      { path: 'contact', element: <Contact /> }, // /contact
      { path: '*', element: <NotFound /> },     // 404 fallback
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
