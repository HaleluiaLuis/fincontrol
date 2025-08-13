'use client';

import { Suspense } from 'react';
import LoginForm from './LoginForm';

function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="animate-pulse">
          <div className="mx-auto h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="mt-6 h-8 bg-gray-200 rounded mx-auto w-48"></div>
          <div className="mt-2 h-4 bg-gray-200 rounded mx-auto w-32"></div>
          <div className="mt-8 space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
