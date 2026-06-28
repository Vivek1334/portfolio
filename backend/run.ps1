$ErrorActionPreference = "Stop"

$classes = Join-Path $PSScriptRoot "target\classes"

if (-not (Test-Path $classes)) {
  & (Join-Path $PSScriptRoot "build.ps1")
}

java -cp $classes com.portfolio.PortfolioServer
