import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
    component: () => (
        <div className='flex flex-col min-h-screen'>
            <nav className='bg-gray-800 text-slate-200 font-bold py-5 px-10'>
                <h1 className='text-2xl'>MSM Facturation</h1>
            </nav>
            <main
                className='p-5 justify-center items-center flex flex-col flex-grow'
                style={{
                    backgroundColor: "#f9f9f9",
                }}>
                <Outlet />
            </main>
            <TanStackRouterDevtools />
        </div>
    ),
})
