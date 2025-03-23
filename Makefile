include .env
export
.PHONY: build run

build:
	@echo "Building program..."
	go mod tidy
	go build -o api.out ./cmd/api-server

build-windows:
	@echo "Building program for Windows..."
	go mod tidy
	GOOS=windows GOARCH=amd64 go build -o server.exe ./cmd

run: build
	@echo "Executing program..."
	./api.out
