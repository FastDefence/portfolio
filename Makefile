deploy-dev:
	docker compose -f compose.yml build
	docker compose -f compose.yml up -d
	pwsh -NoProfile -ExecutionPolicy Bypass -File ./api/migration.ps1

windows-deploy-dev:
	docker compose -f compose.yml build
	docker compose -f compose.yml up -d
	pwsh -NoProfile -ExecutionPolicy Bypass -File ./api/migration.ps1
