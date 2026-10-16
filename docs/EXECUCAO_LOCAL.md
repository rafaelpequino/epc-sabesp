# Execução local

## Pré-requisitos

- .NET 8 SDK.
- Node.js 20+ e npm 10+.
- Terminal PowerShell na raiz do repositório.

## Instalar dependências

Restaure o projeto ASP.NET Core e instale o frontend:

```powershell
dotnet restore .\EngenhariaDeCustos.csproj
Set-Location .\ClientApp
npm ci
```

## Executar frontend e backend em desenvolvimento

Mantenha dois terminais PowerShell abertos.

No primeiro, a partir da raiz do repositório, inicie o backend na porta `5000`:

```powershell
$env:ASPNETCORE_URLS = 'http://localhost:5000'
dotnet run --project .\EngenhariaDeCustos.csproj --no-launch-profile
```

No segundo, inicie o Vite na porta `5173`:

```powershell
Set-Location .\ClientApp
npm run dev
```

Acesse `http://127.0.0.1:5173`. O Vite encaminha requisições `/api` para `http://localhost:5000`; chamadas frontend devem usar caminhos relativos. Nesta estrutura inicial ainda não existem controllers nem endpoints de negócio, portanto o proxy está preparado para uso futuro.

O navegador acessa o servidor Vite durante o desenvolvimento. Em produção, o ASP.NET Core serve os arquivos compilados e a API na mesma origem.

## Testar a hospedagem de produção local

Na raiz do repositório, publique frontend e backend e gere a pasta ZIP:

```powershell
.\build.ps1
```

Em outro terminal, inicie a DLL publicada:

```powershell
$env:ASPNETCORE_URLS = 'http://localhost:5000'
dotnet .\artifacts\publish\EngenhariaDeCustos.dll
```

Acesse `http://localhost:5000`. O ASP.NET Core entrega `wwwroot/index.html` e os arquivos estáticos publicados. Essa execução usa o frontend compilado; ela não utiliza o servidor de desenvolvimento Vite.

## Solução de problemas

- **Porta `5173` ocupada:** o Vite usa `strictPort`; libere a porta antes de iniciá-lo. Se mudar a porta, atualize a URL aberta no navegador.
- **Porta `5000` ocupada:** escolha outra porta em `ASPNETCORE_URLS` e ajuste o destino `server.proxy['/api']` em `ClientApp/vite.config.ts`.
- **Frontend sem dependências:** execute `npm ci` dentro de `ClientApp/`.
- **Build TypeScript/Vite falha:** execute `npm run build` dentro de `ClientApp/` e corrija os diagnósticos antes de publicar.
- **Backend não inicia:** confirme o SDK com `dotnet --list-sdks` e restaure com `dotnet restore .\EngenhariaDeCustos.csproj`.
- **Rota da API desconhecida exibe a aplicação:** o fallback está configurado para devolver 404 em caminhos `/api`; crie endpoints em controllers com rotas próprias quando a API for implementada.
