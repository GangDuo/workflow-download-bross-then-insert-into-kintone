<#
準備
下記モジュールをインストールする。
https://github.com/stopthatastronaut/poshdotenv

使用例
pwsh -ExecutionPolicy Bypass .\run.ps1
#>
Import-Module $env:userprofile\Documents\PowerShell\Modules\dotenv\0.1.0\dotenv.psm1
Set-DotEnv -Path ./.env
echo $env:APP_ENV

$tmp = $env:TEMP | Join-Path -ChildPath $([System.Guid]::NewGuid().Guid)
New-Item -ItemType Directory -Path $tmp
echo $tmp
node .\..\libs\bross\index.js "$tmp"

# ここに処理を記載する。
Get-ChildItem "$tmp" -Filter "*.zip" | % { Expand-Archive -PassThru -Path $_.FullName -DestinationPath "$tmp" | % { powershell -ExecutionPolicy Bypass .\sanitize.ps1 $_.FullName "$env:OUT_FILE" } }
node .\..\libs\kintone\index.js $(Resolve-Path $env:OUT_FILE | Select-Object -Property Path).Path

$tmp | Remove-Item -Recurse

Remove-DotEnv