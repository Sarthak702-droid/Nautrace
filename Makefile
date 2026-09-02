.PHONY: test test-python test-go run docker-up docker-down

test: test-python test-go

test-python:
	cd intelligence && PYTHONPATH=. pytest -q

test-go:
	cd gateway && go test ./...

run:
	docker compose up --build

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down
