import HelloReactView from 'Frontend/views/helloreact/HelloReactView.js';
import MainLayout from 'Frontend/views/MainLayout.js';
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import TodoView from './views/TodoView';
import { LoginView } from './views/LoginView';

const AboutView = lazy(async () => import('Frontend/views/about/AboutView.js'));

const router = createBrowserRouter([
  { path: '/login', element: <LoginView /> },
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HelloReactView /> },
      { path: '/hello', element: <HelloReactView /> },
      {
        path: '/about',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AboutView />
          </Suspense>
        ),
      },
      { path: '/todo', element: <TodoView /> },
    ],
  },
]);

export default router;
