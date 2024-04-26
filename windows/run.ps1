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
Remove-DotEnv