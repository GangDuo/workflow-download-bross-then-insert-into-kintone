<#
使用例
powershell -ExecutionPolicy Bypass .\sanitize.ps1 $env:userprofile\Downloads\bross_downloaded.csv
#>

Param(
    [parameter(mandatory=$true)]$csv_file,
    [String]$out_file = $Env:USERPROFILE + "\Desktop\SC" + (Get-Date).AddMonths(-1).ToString("yyyyMM") + "bross_edited.csv"
)

$csv = Import-CSV $csv_file -Delimiter "," -Encoding default | Where-Object { $_.内訳項目名 -eq '＜合　計＞　　　　　　　　　　　　　　　'}
foreach($row in $csv) {
	$row.請求年月 = [datetime]::ParseExact(
        $row.請求年月,
        'yyyy年MM月',
        [cultureinfo]::InvariantCulture
    ).ToString('yyyy-MM-dd')

    $row.ａｕ電話番号 = $row.ａｕ電話番号 -replace '\b0'
}

$csv | Export-Csv -Path $out_file -Encoding default -Force -NoTypeInformation
$csv | Format-Table -AutoSize
Write-Host $csv_file 
Write-Host $out_file