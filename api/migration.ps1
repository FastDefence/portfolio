$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$ComposeFile = Join-Path $ProjectRoot "compose.prod.yml"
$DbService = "mysql"

$DbUser = if ($env:MYSQL_USER) { $env:MYSQL_USER } else { "root" }
$DbPassword = if ($env:MYSQL_PASSWORD) { $env:MYSQL_PASSWORD } else { "password" }
$DbName = if ($env:MYSQL_DATABASE) { $env:MYSQL_DATABASE } else { "portfolio_db" }

$MigrationDir = Join-Path $PSScriptRoot "mysql\migration"

$MigrationFiles = @(
    "01_articles.sql",
    "02_tags.sql",
    "03_article_tags.sql",
    "04_article_references.sql",
    "05_posts.sql"
)

Write-Host "Start migration..."

docker compose -f $ComposeFile exec -T $DbService mysql "--user=$DbUser" "--password=$DbPassword" $DbName -e @"
CREATE TABLE IF NOT EXISTS schema_migrations (
    name VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
"@

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to prepare migration history"
    exit $LASTEXITCODE
}

foreach ($File in $MigrationFiles) {
    $FilePath = Join-Path $MigrationDir $File

    if (-not (Test-Path $FilePath)) {
        Write-Error "Migration file not found: $FilePath"
        exit 1
    }

    $Applied = docker compose -f $ComposeFile exec -T $DbService mysql "--user=$DbUser" "--password=$DbPassword" $DbName --batch --skip-column-names -e "SELECT COUNT(*) FROM schema_migrations WHERE name = '$File';"

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to read migration history: $File"
        exit $LASTEXITCODE
    }

    if ($Applied.Trim() -eq "1") {
        Write-Host "Skipping: $File"
        continue
    }

    Write-Host "Running: $FilePath"

    Get-Content -Raw $FilePath | docker compose -f $ComposeFile exec -T $DbService mysql "--user=$DbUser" "--password=$DbPassword" $DbName

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Migration failed: $FilePath"
        exit $LASTEXITCODE
    }

    docker compose -f $ComposeFile exec -T $DbService mysql "--user=$DbUser" "--password=$DbPassword" $DbName -e "INSERT INTO schema_migrations (name) VALUES ('$File');"

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to record migration: $File"
        exit $LASTEXITCODE
    }
}

Write-Host "Migration completed."

docker compose -f $ComposeFile exec -T $DbService mysql "--user=$DbUser" "--password=$DbPassword" $DbName -e "SHOW TABLES;"
