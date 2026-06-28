$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$classes = Join-Path $PSScriptRoot "target\classes"
$source = Join-Path $PSScriptRoot "src\main\java\com\portfolio\PortfolioServer.java"

New-Item -ItemType Directory -Force -Path $classes | Out-Null
javac -encoding UTF-8 -d $classes $source

Write-Host "Java backend compiled to $classes"
