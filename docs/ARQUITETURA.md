# Arquitetura

## Objetivo

O projeto é uma única aplicação ASP.NET Core 8 que hospeda os endpoints HTTP da API e os arquivos estáticos produzidos pelo frontend React. Em produção, navegador e API usam a mesma origem; as chamadas do frontend devem usar caminhos relativos, como `/api/insumos`.

## Tecnologias

- **ASP.NET Core 8 / C#**: servidor HTTP, controllers e hospedagem dos arquivos estáticos.
- **React 18 / React DOM 18**: camada de interface do navegador.
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
- `ClientApp/src/styles/tailwind.css`: importação necessária para carregar Tailwind CSS. A estilização deve ser feita com classes utilitárias nos componentes, sem CSS de apresentação escrito à mão.
- `ClientApp/src/assets/images/`: imagens-fonte importadas pelos componentes e processadas pelo Vite.
- `wwwroot/`: saída gerada do build Vite, servida pelo ASP.NET Core. Não é a pasta de fontes.
- `docs/`: documentação técnica.
- `artifacts/publish/`: saída da publicação do backend e frontend.

`ClientApp` contém os fontes editáveis e `node_modules` usado no desenvolvimento/build. `wwwroot` contém os arquivos estáticos compilados e reconstruíveis que o ASP.NET Core serve; não inclui dependências Node.

A tela inicial está disponível em `/login`; a rota `/` redireciona para `/login`. A interface de login é apenas visual e ainda não autentica usuários.

## Comunicação e acesso a dados

Em produção, React e API são hospedados na mesma origem, sem servidor frontend separado. Em desenvolvimento, Vite usa `http://localhost:5173` e encaminha `/api` para o backend em `http://localhost:5000`.

Quando a conexão real for definida, a camada `Data/` deverá usar ADO.NET com `DbConnection` (ou implementação do provedor escolhido), `DbCommand`, parâmetros e `DbDataReader`, liberando recursos com `using`/`await using`. Consultas devem ser parametrizadas. Não se adicionam agora provedor, repositórios ou SQL.

## Build e hospedagem

O script `build.ps1` é o ponto de entrada oficial: executa `npm ci` e `npm run build` em `ClientApp/`, compilando o TypeScript e processando as classes Tailwind pelo Vite; depois publica o projeto ASP.NET Core em `artifacts/publish/` e cria `artifacts/EngenhariaDeCustos.zip` com os arquivos da publicação na raiz do ZIP. Assim, o frontend já está compilado em `wwwroot/` quando o ASP.NET Core coleta os arquivos da publicação.

Node.js e npm são necessários somente no desenvolvimento/compilação/publicação. No servidor de produção, basta o runtime ASP.NET Core compatível com a publicação framework-dependent; Node e `node_modules` não são incluídos.

Os arquivos Vite gerados (`wwwroot/index.html` e `wwwroot/assets/`) são ignorados pelo Git e recriados no publish. Outros arquivos colocados em `wwwroot/` não são ignorados.
