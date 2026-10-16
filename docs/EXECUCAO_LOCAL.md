# Rodar o projeto no computador

Para desenvolver, abra dois terminais PowerShell: um para o backend e outro para o frontend.

## Antes de começar

Instale o .NET 8 SDK e o Node.js (com npm). O frontend usa React, TypeScript, Vite e Tailwind CSS; as dependências do Tailwind são instaladas junto com as demais pelo `npm ci`.

Na primeira vez, abra um terminal na pasta principal do projeto e instale as dependências:

```powershell
dotnet restore .\EngenhariaDeCustos.csproj
cd .\ClientApp
npm ci
```

## Iniciar o projeto para desenvolver

**Terminal 1 — backend:** abra o PowerShell na pasta principal do projeto e execute:

```powershell
dotnet run -- --urls=http://localhost:5000
```

Deixe esse terminal aberto. O backend inicia em `http://localhost:5000`.

**Terminal 2 — frontend:** abra outro PowerShell na pasta principal do projeto e execute:

```powershell
cd .\ClientApp
npm run dev
```

Abra no navegador o endereço indicado pelo Vite, normalmente:

```text
http://127.0.0.1:5173
```

O endereço `/` redireciona para `/login`. A tela de login é somente uma interface: ainda não autentica nem envia os dados.

Durante o desenvolvimento, o navegador recebe a página do Vite. As chamadas para `/api` são encaminhadas ao backend na porta `5000`. Os estilos da interface devem ser feitos com classes utilitárias Tailwind nos componentes React; `src/styles/tailwind.css` contém somente a importação necessária para carregar o Tailwind.