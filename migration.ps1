$ErrorActionPreference = "Stop"

$ComposeFile = "compose.prod.yml"
$DbService = "mysql"

$DbUser = if ($env:MYSQL_USER) { $env:MYSQL_USER } else { "root" }
$DbPassword = if ($env:MYSQL_PASSWORD) { $env:MYSQL_PASSWORD } else { "password" }
$DbName = if ($env:MYSQL_DATABASE) { $env:MYSQL_DATABASE } else { "portfolio_db" }

$MigrationDir = ".\back\mysql\migration"

$MigrationFiles = @(
    "01_articles.sql",
    "02_tags.sql",
    "03_article_tags.sql",
    "04_references.sql"
)

Write-Host "Start migration..."

foreach ($File in $MigrationFiles) {
    $FilePath = Join-Path $MigrationDir $File

    if (-not (Test-Path $FilePath)) {
        Write-Error "Migration file not found: $FilePath"
        exit 1
    }

    Write-Host "Running: $FilePath"

    Get-Content -Raw $FilePath | docker compose -f $ComposeFile exec -T $DbService mysql "--user=$DbUser" "--password=$DbPassword" $DbName

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Migration failed: $FilePath"
        exit $LASTEXITCODE
    }
}

Write-Host "Migration completed."

docker compose -f $ComposeFile exec -T $DbService mysql "--user=$DbUser" "--password=$DbPassword" $DbName -e "SHOW TABLES;"