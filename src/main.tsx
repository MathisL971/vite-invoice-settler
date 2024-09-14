import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'

import { routeTree } from './routeTree.gen'
import { Alert } from 'flowbite-react'
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultNotFoundComponent: () => {
    return (
      <Alert color={"failure"} className="w-full flex flex-row justify-center max-w-xl my-auto text-center">
        <div className="flex flex-col gap-3 justify-between items-center p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            width={120}
            height={120}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <span className="text-5xl font-extrabold">
            404
          </span>
          <span className="text-2xl font-bold">
            Une erreur s'est produite
          </span>
          <span className="text-lg">
            <i>
              La page que vous cherchez n'existe pas.
            </i>
          </span>
        </div>
      </Alert>
    )
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <RouterProvider router={router} />
  )
}

