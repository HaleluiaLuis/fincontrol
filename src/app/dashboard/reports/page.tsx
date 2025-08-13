import React from 'react';

export default function ReportsDashboardPage(){
	return (
		<div className="space-y-6">
			<header className="surface p-4 rounded-lg border border-surface-outline/40">
				<h1 className="text-xl font-semibold">Relatórios</h1>
				<p className="text-sm text-text-soft mt-1">Selecione um relatório para visualizar os dados financeiros agregados.</p>
			</header>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{['Resumo Financeiro','Comparativo Mensal','Fluxo de Caixa','Categorias','Fornecedores','Estado das Faturas'].map(r=> (
					<div key={r} className="surface-elevated p-4 rounded-lg border border-surface-outline/30 flex flex-col justify-between">
						<div>
							<h2 className="font-medium mb-2">{r}</h2>
							<p className="text-xs text-text-soft">Pré-visualização indisponível (mock). Integração futura via endpoints /api/reports/*.</p>
						</div>
						<button className="mt-4 action-btn">Abrir</button>
					</div>
				))}
			</div>
		</div>
	);
}
