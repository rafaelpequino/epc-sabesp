# Gerar o ZIP para enviar ao servidor

Quando terminar uma versão do projeto, execute o script de publicação. Ele compila o frontend e o backend e cria um único ZIP pronto para copiar para o servidor.

## Passo a passo

1. Abra o PowerShell na pasta principal do projeto, a mesma pasta onde está o arquivo `build.ps1`.

   Se o PowerShell já estiver aberto em outra pasta, navegue até a pasta do projeto. Exemplo:

   ```powershell
   Set-Location "C:\caminho\para\epc-sabesp"
   ```

2. Execute o script:

   ```powershell
   .\build.ps1
   ```

3. Aguarde a conclusão. O script instala as dependências do frontend, compila o React, publica o ASP.NET Core e cria o ZIP.

4. Encontre o arquivo gerado aqui:

   ```text
   artifacts\EngenhariaDeCustos.zip
   ```

5. Enviar esse ZIP ao servidor. Ele já contém o backend e o frontend compilado. Não compacte a pasta do projeto manualmente e não envie `ClientApp/node_modules`.

Se o script terminar com uma mensagem de erro, a publicação não foi concluída; corrija o problema indicado e execute `.\build.ps1` novamente.

## O que o script faz

O script `build.ps1`, localizado na pasta principal, executa estas etapas em sequência:

1. Executa `npm ci` em `ClientApp/`, restaurando as dependências a partir do `package-lock.json`.
2. Executa `npm run build`; o Vite gera os arquivos do navegador em `wwwroot/`.
3. Executa `dotnet publish` em Release, salvando o backend e os arquivos do frontend em `artifacts/publish/`.
4. Cria `artifacts/EngenhariaDeCustos.zip` com o conteúdo de `artifacts/publish/` na raiz do ZIP.

Antes de publicar, o script limpa somente a pasta `artifacts/publish/` e o ZIP anterior, pois são saídas geradas. Os fontes do projeto não são removidos. `node_modules` não é incluído no ZIP.

## Requisitos para gerar o ZIP

No computador usado para compilar, instale:

- .NET 8 SDK.
- Node.js 20 ou superior e npm 10 ou superior.
- PowerShell no Windows.

Confira as ferramentas com:

```powershell
dotnet --list-sdks
node --version
npm --version
```

Node.js e npm são necessários para gerar a publicação, não para executar a aplicação no servidor. O servidor precisa do runtime ASP.NET Core 8, mas não precisa de Node.js nem npm.

## Conferir os arquivos gerados

Depois que o script terminar com sucesso, confirme que os arquivos principais existem:

```powershell
Test-Path .\artifacts\EngenhariaDeCustos.zip
Test-Path .\artifacts\publish\EngenhariaDeCustos.dll
Test-Path .\artifacts\publish\wwwroot\index.html
```

Os três comandos devem retornar `True`. A pasta `artifacts/publish/` é útil para inspeção; para enviar ao servidor, use o arquivo ZIP.