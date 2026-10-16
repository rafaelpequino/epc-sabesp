# Rodar o projeto no computador

Para desenvolver, abra dois terminais PowerShell: um para o backend e outro para o frontend.

## Antes de começar

Instale o .NET 8 SDK e o Node.js (com npm). Na primeira vez, abra um terminal na pasta principal do projeto e instale as dependências:

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

Durante o desenvolvimento, o navegador recebe a página do Vite. As chamadas para `/api` são encaminhadas ao backend na porta `5000`. Esta estrutura inicial ainda não tem funcionalidades ou endpoints de negócio.