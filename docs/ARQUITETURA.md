# Arquitetura

## Objetivo

O projeto é uma única aplicação ASP.NET Core 8 que hospeda os endpoints HTTP da API e os arquivos estáticos produzidos pelo frontend React. Em produção, navegador e API usam a mesma origem; as chamadas do frontend devem usar caminhos relativos, como `/api/insumos`.

## Tecnologias

- **ASP.NET Core 8 / C#**: servidor HTTP, controllers e hospedagem dos arquivos estáticos.
- **React 18 / React DOM 18**: camada de interface do navegador.
- **React Router 7** (`react-router-dom`): roteamento no navegador, sem recarregar a página.
- **TypeScript**: tipagem e compilação do código do frontend.
- **Vite**: servidor de desenvolvimento e compilação do frontend.
- **Tailwind CSS 4**: estilização da interface com classes utilitárias nos componentes React, integrado ao Vite por `@tailwindcss/vite`.
- **npm**: instalação reproduzível das dependências JavaScript por `package-lock.json`.
- **ADO.NET**: acesso futuro ao banco por conexões, comandos, parâmetros e leitores de dados nativos do .NET.

Entity Framework Core, outros ORMs e ferramentas de migrations de ORM não fazem parte desta arquitetura. Nenhum provedor ADO.NET foi escolhido: ele será definido quando o banco real e a conexão forem configurados.

## Diretórios

- `Controllers/`: futuros controllers ASP.NET Core para requisições HTTP.
- `Models/`: futuros modelos de domínio e estruturas de backend.
- `Models/Dtos/`: futuros DTOs de entrada e saída da API.
- `Services/`: futura camada de regras de negócio e orquestração.
- `Data/`: futura camada ADO.NET; ainda não contém classes de acesso ou consultas.
- `ClientApp/`: fontes, configuração e dependências do React + TypeScript + Vite + Tailwind CSS.
- `ClientApp/src/components/`: futuros componentes reutilizáveis.
- `ClientApp/src/components/common/`: componentes reutilizáveis compartilhados, como campos de formulário.
- `ClientApp/src/components/login/`: componentes específicos da tela de login.
- `ClientApp/src/pages/`: futuras páginas.
- `ClientApp/src/services/`: futuras chamadas HTTP à API.
- `ClientApp/src/styles/tailwind.css`: importação do Tailwind CSS e paleta de cores do projeto, registrada como tokens de tema (`@theme`). A estilização deve ser feita com classes utilitárias nos componentes, sem CSS de apresentação escrito à mão.

  **Regra de uso das cores: o azul é sempre o foco.** Botões, links, item ativo do menu, ícones, barras, gráficos, cabeçalhos de cartão e demais elementos de destaque devem usar o azul (`brand` e seus tons). Amarelo, laranja e verde são **acentos**, reservados a detalhes pontuais (por exemplo, indicar status como "finalizada"/"em aberto" ou realçar um pequeno elemento). Eles nunca devem ser a cor predominante de um cartão, página, botão principal ou gráfico, nem competir com o azul. Não usar outras cores de matiz (roxo, rosa etc.) na interface; vermelho só para erros.

  | Token | Cor | Classes (exemplos) | Uso |
  | --- | --- | --- | --- |
  | `--color-brand` | `#0093DD` | `bg-brand`, `text-brand` | **Azul principal** (cor de destaque da interface) |
  | `--color-brand-50` | `#EBF7FD` | `bg-brand-50` | Fundos muito claros e hover |
  | `--color-brand-100` | `#D6EEFA` | `bg-brand-100` | Fundos de ícones, item ativo e trilhas de barras |
  | `--color-brand-200` | `#A8DBF5` | `text-brand-200` | Ilustrações e detalhes suaves |
  | `--color-brand-600` | `#0079B5` | `hover:bg-brand-600`, `text-brand-600` | Hover de botões e links em texto pequeno (melhor contraste) |
  | `--color-brand-700` | `#00608F` | `text-brand-700` | Texto azul escuro (títulos e item ativo) |
  | `--color-accent-yellow` | `#FEC513` | `bg-accent-yellow` | Acento: amarelo |
  | `--color-accent-orange` | `#F9B181` | `bg-accent-orange` | Acento: laranja |
  | `--color-accent-green` | `#649A20` | `bg-accent-green`, `text-accent-green` | Acento: verde |
  | `--color-ink-muted` | `#5B6B86` | `text-ink-muted` | Cinza para textos secundários |
  | `--color-ink` | `#172433` | `text-ink` | Cinza escuro para textos principais |
  | `--color-page` | `#EDF6FB` | `bg-page` | Fundo das páginas |
  | `--color-line` | `#D3E0E8` | `border-line` | Bordas e divisores |

  Os tons do azul (`brand-*`) derivam do azul principal. Cores novas entram no `@theme`, e não como valores fixos nas classes (exemplo: `bg-brand`, nunca `bg-[#0093DD]`). Alguns textos do login ainda usam cinzas fixos e devem migrar gradualmente para `ink`/`ink-muted`. No dashboard, o verde (finalizadas) e o amarelo (em aberto) aparecem apenas no gráfico de status das demandas e no ícone de confirmação.
- `ClientApp/src/assets/images/`: imagens-fonte importadas pelos componentes e processadas pelo Vite.
- `wwwroot/`: saída gerada do build Vite, servida pelo ASP.NET Core. Não é a pasta de fontes.
- `docs/`: documentação técnica.
- `artifacts/publish/`: saída da publicação do backend e frontend.

`ClientApp` contém os fontes editáveis e `node_modules` usado no desenvolvimento/build. `wwwroot` contém os arquivos estáticos compilados e reconstruíveis que o ASP.NET Core serve; não inclui dependências Node.

A tela inicial está disponível em `/login`. A rota `/` (e qualquer rota desconhecida) redireciona para `/sistema`, que exige login e, sem sessão válida, leva a `/login` (`<Navigate>` em `App.tsx`).

### Autenticação temporária (somente frontend)

Enquanto não há backend nem banco, o login aceita `admin` / `admin` (`services/authService.ts`). Após o login, é gravado em `localStorage` um token no formato JWT (`header.payload.signature`, com `exp` de 8 h). **O token não é assinado e não oferece segurança real**; ele só simula o fluxo. O `AuthContext` (`auth/`) expõe `login`, `logout` e o usuário, e `ProtectedRoute` bloqueia todas as rotas de `/sistema`. Ao existir API, substituir `authService.ts` por chamadas reais e validar o JWT no servidor.

### Área logada (`/sistema`)

- `layouts/SistemaLayout.tsx`: layout padrão com `Header` e `Sidebar` (em `components/layout/`) e `<Outlet>`; toda página do sistema deve ser rota filha dele. Responsivo: a partir de `lg` (1024 px) a sidebar fica fixa ao lado do conteúdo; abaixo disso ela vira uma gaveta escondida, aberta pelo botão hambúrguer do `Header` e fechada pelo overlay, pela tecla Esc, por navegação ou pelo próprio botão. O texto "EPC - Projetos Estratégicos" aparece apenas a partir de `md` (768 px).
- Itens do menu ficam em `components/layout/navigation.ts`.
- `pages/sistema/InicioPage.tsx`: página inicial (Visão geral), montada com `components/dashboard/`. Os dados vêm de `services/dashboardService.ts`, atualmente fictícios.
- Ícones SVG em `components/common/Icon.tsx`.

## Comunicação e acesso a dados

Em produção, React e API são hospedados na mesma origem, sem servidor frontend separado. Em desenvolvimento, Vite usa `http://127.0.0.1:5173` e encaminha `/api` para o backend em `http://localhost:5000`.

Quando a conexão real for definida, a camada `Data/` deverá usar ADO.NET com `DbConnection` (ou implementação do provedor escolhido), `DbCommand`, parâmetros e `DbDataReader`, liberando recursos com `using`/`await using`. Consultas devem ser parametrizadas. Não se adicionam agora provedor, repositórios ou SQL.

## Build e hospedagem

O script `build.ps1` é o ponto de entrada oficial: executa `npm ci` e `npm run build` em `ClientApp/`, compilando o TypeScript e processando as classes Tailwind pelo Vite; depois publica o projeto ASP.NET Core em `artifacts/publish/` e cria `artifacts/EngenhariaDeCustos.zip` com os arquivos da publicação na raiz do ZIP. Assim, o frontend já está compilado em `wwwroot/` quando o ASP.NET Core coleta os arquivos da publicação.

Node.js e npm são necessários somente no desenvolvimento/compilação/publicação. No servidor de produção, basta o runtime ASP.NET Core compatível com a publicação framework-dependent; Node e `node_modules` não são incluídos.

O Vite apaga todo o conteúdo de `wwwroot/` a cada build (`emptyOutDir: true`) e o recria. Por isso, nada deve ser colocado manualmente nessa pasta: arquivos estáticos que precisem ser mantidos devem ficar em `ClientApp/public/`, que o Vite copia para `wwwroot/`. Os arquivos gerados (`wwwroot/index.html` e `wwwroot/assets/`) são ignorados pelo Git.
