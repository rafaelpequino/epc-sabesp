# Build e publicação

## Pré-requisitos

- .NET 8 SDK (qualquer versão `8.0.x` compatível; o projeto usa `net8.0`).
- Node.js 20 ou superior e npm 10 ou superior.
- PowerShell no Windows para executar o script oficial de publicação.

Node e npm são exigidos no ambiente de build, não no servidor de produção. A publicação é framework-dependent e requer o runtime ASP.NET Core 8 no servidor.

## Restaurar dependências

Na raiz do repositório, restaure o backend:

```powershell
dotnet restore .\EngenhariaDeCustos.csproj
```

Restaure as dependências frontend usando o lockfile:

```powershell
Set-Location .\ClientApp
npm ci
Set-Location ..
```

## Builds separados para validação

Compile o frontend manualmente:

```powershell
Set-Location .\ClientApp
npm run build
Set-Location ..
```

O Vite escreve `index.html` e `assets/` diretamente em `wwwroot/`. Compile o backend:

```powershell
dotnet build .\EngenhariaDeCustos.csproj
```

## Publicação integrada e ZIP

O ponto de entrada oficial para publicar frontend e backend juntos é:

```powershell
.\build.ps1
```

O script executa `npm ci` e `npm run build` dentro de `ClientApp/` e, somente se ambos forem concluídos, chama `dotnet publish -c Release`. O Vite grava em `wwwroot/` antes de o projeto ASP.NET Core coletar os arquivos de publicação. Portanto, não é necessário executar um segundo processo de publicação do frontend. Esse script é o fluxo oficial de publicação integrada.

O resultado é:

- `artifacts/publish/`: publicação framework-dependent do ASP.NET Core 8 e arquivos estáticos do frontend.
- `artifacts/EngenhariaDeCustos.zip`: ZIP com os conteúdos de `publish/` na raiz, sem pasta externa adicional.

O script limpa apenas esses destinos gerados antes de produzi-los novamente. `node_modules` não é copiado para a publicação nem para o ZIP.

## Validar a saída

Após executar `.\build.ps1`, confira os arquivos essenciais:

```powershell
Test-Path .\artifacts\publish\EngenhariaDeCustos.dll
Test-Path .\artifacts\publish\wwwroot\index.html
Test-Path .\artifacts\EngenhariaDeCustos.zip
Get-ChildItem .\artifacts\publish
```

Para inspecionar nomes dentro do ZIP sem extraí-lo:

```powershell
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::OpenRead((Resolve-Path .\artifacts\EngenhariaDeCustos.zip)).Entries |
  Select-Object -ExpandProperty FullName
```

## Problemas comuns

- **SDK .NET ausente ou incompatível:** instale o .NET 8 SDK e confirme com `dotnet --list-sdks`.
- **Node/npm ausente:** instale Node.js 20+ e confirme com `node --version` e `npm --version`.
- **Falha em `npm ci`:** confirme que `ClientApp/package-lock.json` está versionado e corresponde a `package.json`; não substitua o comando por `npm install` no build automatizado.
- **Porta Vite em uso:** o servidor está configurado para falhar claramente se a porta `5173` estiver ocupada; encerre o processo que a utiliza ou altere a porta e atualize este guia e o proxy.
- **Falha ao gravar publicação/ZIP:** verifique permissões e se os arquivos de saída não estão abertos por outro processo.
- **Servidor sem página inicial:** confirme que `artifacts/publish/wwwroot/index.html` existe e que o processo ASP.NET Core está usando essa publicação.
