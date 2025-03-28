# frontend: localhost:3000

up:
	docker compose up -d

destroy:
	docker compose down --rmi all --volumes --remove-orphans