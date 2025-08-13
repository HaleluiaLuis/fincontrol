import React, { Suspense } from 'react';
import { LoginPageWrapper } from './page-wrapper';
import { LoginForm } from './LoginForm';

export const metadata = { title: 'Autenticação • FinControl' };

export default function LoginPage(){
	return (
		<Suspense fallback={<div className="p-8 text-sm text-text-soft">Carregando login...</div>}>
			<LoginPageWrapper>
				<LoginForm />
			</LoginPageWrapper>
		</Suspense>
	);
}

