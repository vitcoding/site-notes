# frontend: localhost:3000

up:
	mkdir -p ./db_data
	touch ./db_data/sql_app.db
	docker compose up -d

destroy:
	docker compose down --rmi all --volumes --remove-orphans