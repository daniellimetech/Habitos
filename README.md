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
3. Clique em **Deploy**. Configure as variáveis do Supabase conforme abaixo para ativar as contas e o banco de dados. Sem ambas, o app continua em modo local.

## Dados

Com Supabase configurado, os dados são armazenados no PostgreSQL por usuário autenticado e podem ser acessados em outros dispositivos. Sem configuração, o app mantém o modo local em `localStorage`. Em **Configurações**, exporte e importe backups JSON. Novos usuários recebem sugestões de hábitos sem registros fictícios. Registros futuros não são permitidos; dias anteriores podem ser atualizados pelo calendário. A sequência conta os dias programados consecutivos e permite que o dia atual ainda esteja pendente.

As fontes Google são opcionais: se indisponíveis, a interface usa fontes locais do sistema.

## Histórico gamificado

A seção Histórico oferece filtros de semana (7 dias), mês (30), trimestre (90) ou ano (365) e por hábito, gráfico diário clicável, XP (10 por conclusão), níveis (100 XP por nível), conquistas e sugestões de revisão. Redefinir um hábito mantém os registros. As taxas usam a frequência atual desde a criação; hábitos legados sem data de criação usam o primeiro registro disponível. Hoje entra na análise e pode estar pendente. XP é recalculado a partir dos registros existentes, sem pontuação duplicada ao marcar/desmarcar.


## Banco de dados e contas (Supabase)

1. No seu projeto Supabase, abra **SQL Editor** e execute [supabase/schema.sql](supabase/schema.sql). O script cria a tabela `habit_accounts`, políticas de isolamento por usuário (RLS) e a função de gravação atômica; é reaplicável e não apaga os dados.
2. Em **Authentication → Providers**, habilite **Email**. Mantenha a confirmação de e-mail habilitada. Configure **URL Configuration**: Site URL e Redirect URLs com a URL de produção da Vercel e, se necessário, `http://localhost:5173` para desenvolvimento.
3. Nas configurações do projeto, copie a URL e a chave **publishable** (ou a antiga chave **anon**).
4. Na Vercel, em **Settings → Environment Variables**, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` nos ambientes desejados e faça um novo deploy. A chave anon também é aceita como `VITE_SUPABASE_ANON_KEY`. Essas chaves públicas entram no bundle; **nunca configure service_role, secret key ou senha do banco no frontend**.
5. Para desenvolvimento local, copie `.env.example` para `.env.local`, preencha a URL e chave pública e reinicie `npm run dev`.
6. Cadastre-se, confirme o e-mail e entre. A conta começa vazia. No mesmo navegador que já tinha dados, use **Migrar dados locais**; o backup local fica preservado e a importação exige confirmação. IDs existentes mantêm a configuração da nuvem e recebem a união dos registros, evitando duplicação. Backups JSON também continuam disponíveis.

O banco guarda um documento JSON de hábitos e registros por conta, com versão para prevenir sobrescritas entre dispositivos. As alterações só são confirmadas após gravação bem-sucedida. Se aparecer conflito, atualize os dados e repita a alteração. Use **Configurações → Atualizar dados da nuvem** ou recarregue para buscar mudanças de outro dispositivo (não há atualização em tempo real ou gravação offline).

O botão de link por e-mail permite acessar uma conta existente sem senha. Enviar e-mails depende da configuração/limites do Supabase; configure SMTP para produção quando necessário. Apagar os hábitos não apaga a conta de autenticação.

### Validação no projeto real

Após configurar o serviço, teste cadastro/confirmação/login, crie e marque um hábito, recarregue e entre em outro navegador com a mesma conta. Confira o histórico. Use uma segunda conta para verificar que ela começa vazia e não lê os dados da primeira. Abra a mesma conta em duas abas, altere na primeira e tente salvar na segunda sem atualizar: deve aparecer conflito sem sobrescrever os dados. Teste migração local, exportação e logout.

## Aparência

O seletor de tema no cabeçalho, nas configurações e no login oferece Claro, Escuro e Sistema. Sistema acompanha `prefers-color-scheme`, incluindo mudanças enquanto o site está aberto. A escolha é salva por navegador, separada dos dados da conta. No celular, uma barra inferior oferece acesso às seções principais. O script `public/theme-init.js` aplica a preferência antes da inicialização da interface para reduzir o flash do tema incorreto.


## Metas, sessões e programas

Em Novo hábito/Editar hábito, configure horário opcional e uma meta em minutos, copos, páginas, passos, vezes ou ml. No dia escolhido, clique na quantidade/barra para registrar progresso parcial. Ao atingir a meta, o dia conta como concluído; o botão + registra uma unidade por clique e o botão − corrige a contagem. A conclusão aparece somente quando a meta é atingida. Os horários ordenam a rotina, sem enviar notificações.

Hábitos em minutos oferecem **Iniciar sessão**: temporizador com pausa e registro do tempo realizado, adicionado ao progresso existente. A sessão precisa ser salva e não sobrevive a recarregar/fechar a página. Apenas conclusões completas geram XP. Alterar metas preserva os registros anteriores.

**Programas** permite buscar e filtrar rotinas de foco, movimento, aprendizado, criatividade e bem-estar. Adicionar um programa cria seus hábitos diários com metas e horários; nomes já existentes não são duplicados. Depois, ajuste dias, metas e horários em Hábitos.

O Histórico mostra barras por categoria, conclusão média e comparação em pontos percentuais com o período anterior (quando ambos têm dados). No ano, o gráfico agrupa os registros por mês; cada barra abre o último dia daquele mês incluído no período. Os novos campos são preservados no Supabase e nos backups, sem nova migração SQL.

Para adicionar uma rotina recebida em JSON sem apagar hábitos ou histórico, use **Configurações → Adicionar hábitos de arquivo**. A opção **Importar backup** continua oferecendo substituição completa com confirmação. Reimportar o mesmo arquivo na opção aditiva não duplica IDs existentes.

Se não conseguir baixar um arquivo, use **Configurações → Colar rotina**. Cole uma atividade por linha (`05:45 | Acordar`), escolha os dias, revise e confirme. Hábitos existentes são preservados e repetições do mesmo nome/horário são ignoradas.

## Dashboard de foco e revisão

O dashboard sugere um próximo hábito pendente de hoje, priorizando os que já têm progresso parcial, depois horários que já chegaram, horários futuros e hábitos sem horário. O botão de foco abre o temporizador, o registro de quantidade ou leva ao hábito, conforme seu tipo.

Os indicadores comparam os 7 dias completos anteriores a hoje com os 7 anteriores a eles. Alertas de reajuste usam as últimas 14 datas encerradas, exigem pelo menos 3 oportunidades programadas por hábito e conclusão abaixo de 60%. Boa constância usa pelo menos 80%, com o mesmo mínimo. Hábitos novos não são classificados como problemáticos por estarem pendentes hoje. A análise usa a frequência atual e não afirma que falta de registro seja falta de execução.

O mapa permite abrir qualquer data programada no calendário ou editar um hábito. A lista diária pode ser filtrada por pendentes, em andamento e concluídos. Minutos restantes contam apenas metas em minutos. Os cálculos são feitos sobre os dados já existentes, sem nova migração SQL.

## Atalho no iPhone

O app usa o nome curto **Ritmo**, ícone PNG próprio para Apple Touch (180px), favicon e manifesto com modo standalone. Após publicar, abra a URL de produção no Safari → Compartilhar → Adicionar à Tela de Início (mantenha “Abrir como App” ativado quando disponível). Atalhos antigos podem manter o nome e ícone anteriores: remova apenas o atalho antigo da tela inicial e adicione o site novamente. O atalho não habilita funcionamento offline; a conta continua usando o Supabase.
