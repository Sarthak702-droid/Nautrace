.PHONY: test test-python test-go run docker-up docker-down frontend-dev frontend-build frontend-install

test: test-python test-go

test-python:
	cd intelligence && PYTHONPATH=. pytest -q

test-go:
	cd gateway && go test ./...

frontend-install:
	cd frontend && npm install

frontend-dev:
	cd frontend && npm run dev

frontend-build:
	cd frontend && npm run build

run:
	docker compose up --build

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down
