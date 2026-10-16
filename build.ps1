$ErrorActionPreference = 'Stop'

$projectPath = Join-Path $PSScriptRoot 'EngenhariaDeCustos.csproj'
$artifactsPath = Join-Path $PSScriptRoot 'artifacts'
$publishPath = Join-Path $artifactsPath 'publish'
$zipPath = Join-Path $artifactsPath 'EngenhariaDeCustos.zip'

New-Item -ItemType Directory -Force -Path $artifactsPath | Out-Null

Push-Location (Join-Path $PSScriptRoot 'ClientApp')
try {
    & npm ci
    if ($LASTEXITCODE -ne 0) {
        throw "npm ci falhou com o código $LASTEXITCODE."
    }

    & npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "npm run build falhou com o código $LASTEXITCODE."
    }
}
finally {
    Pop-Location
}

if (Test-Path $publishPath) {
    Remove-Item -LiteralPath $publishPath -Recurse -Force
}

if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}

& dotnet publish $projectPath --configuration Release --output $publishPath
if ($LASTEXITCODE -ne 0) {
    throw "dotnet publish falhou com o código $LASTEXITCODE."
}

$publishedApp = Join-Path $publishPath 'EngenhariaDeCustos.dll'
$publishedIndex = Join-Path $publishPath 'wwwroot\index.html'
if (!(Test-Path $publishedApp) -or !(Test-Path $publishedIndex)) {
    throw 'A publicação não contém o backend e o frontend esperados.'
}

Compress-Archive -Path (Join-Path $publishPath '*') -DestinationPath $zipPath -Force
Write-Host "Publicação criada em: $publishPath"
Write-Host "Arquivo ZIP criado em: $zipPath"
