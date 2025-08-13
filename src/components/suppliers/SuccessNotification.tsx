"use client";
import React, { useEffect, useState } from 'react';

interface SuccessNotificationProps {
	show: boolean;
	message?: string;
	autoHideMs?: number;
	onHide?: () => void;
}

export function SuccessNotification({ show, message='Operação realizada com sucesso.', autoHideMs=3500, onHide }: SuccessNotificationProps){
	const [visible, setVisible] = useState(show);
	useEffect(()=>{ setVisible(show); },[show]);
	useEffect(()=>{
		if(visible && autoHideMs){
			const id = setTimeout(()=>{ setVisible(false); onHide?.(); }, autoHideMs);
			return ()=> clearTimeout(id);
		}
	},[visible, autoHideMs, onHide]);
	if(!visible) return null;
	return (
		<div className="fixed bottom-4 right-4 z-50 animate-fade-in">
			<div className="surface-elevated border border-green-500/40 rounded-lg shadow-lg p-4 flex items-start gap-3 w-80">
				<div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-lg">✓</div>
				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium text-green-700 dark:text-green-300">{message}</p>
					<p className="text-[11px] mt-1 text-green-700/70 dark:text-green-400/70">Esta mensagem será fechada automaticamente.</p>
				</div>
				<button onClick={()=>{ setVisible(false); onHide?.(); }} className="text-green-700/70 hover:text-green-800 dark:text-green-400/70 dark:hover:text-green-300 text-sm">✕</button>
			</div>
		</div>
	);
}

