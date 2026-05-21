deploy-dev:
	docker compose -f compose.yml build
	docker compose -f compose.yml up -d
	./migration.sh

windows-deploy-dev:
	docker compose -f compose.yml build
	docker compose -f compose.yml up -d
	pwsh -NoProfile -ExecutionPolicy Bypass -File ./migration.ps1