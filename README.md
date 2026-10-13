# Ritmo — Monitor de hábitos

Aplicação em português com dashboard, calendário interativo, hábitos personalizáveis, frequência semanal, sequências, histórico e backup JSON. Interface responsiva para celular e computador.

## Desenvolvimento

Requer Node.js 22 ou superior.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
```

## Publicar na Vercel

1. Na Vercel, escolha **Add New → Project** e importe `daniellimetech/Habitos`.
2. Selecione o preset **Vite**, comando de build `npm run build` e diretório de saída `dist`.
3. Clique em **Deploy**. Não são necessárias variáveis de ambiente.

## Dados

Os dados são armazenados em `localStorage` no navegador. Não há login nem sincronização entre dispositivos. Em **Configurações**, exporte e importe backups JSON. Novos usuários recebem sugestões de hábitos sem registros fictícios. Registros futuros não são permitidos; dias anteriores podem ser atualizados pelo calendário. A sequência conta os dias programados consecutivos e permite que o dia atual ainda esteja pendente.

As fontes Google são opcionais: se indisponíveis, a interface usa fontes locais do sistema.

## Histórico gamificado

A seção Histórico oferece filtros de 7, 30 ou 90 dias e por hábito, gráfico diário clicável, XP (10 por conclusão), níveis (100 XP por nível), conquistas e sugestões de revisão. Redefinir um hábito mantém os registros. As taxas usam a frequência atual desde a criação; hábitos legados sem data de criação usam o primeiro registro disponível. Hoje entra na análise e pode estar pendente. XP é recalculado a partir dos registros existentes, sem pontuação duplicada ao marcar/desmarcar.
