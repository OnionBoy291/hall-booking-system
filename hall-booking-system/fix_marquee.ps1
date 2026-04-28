$content = Get-Content -Raw -Path "homepage.css"
$content = $content -replace "0% \{ transform: translateX\(0\); \}`r?`n    100% \{ transform: translateX\(-50%\); \}", "0% { transform: translateX(-50%); }`n    100% { transform: translateX(0); }"
Set-Content -NoNewline -Path "homepage.css" -Value $content
Write-Host "Done"
