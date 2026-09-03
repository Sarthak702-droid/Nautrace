FROM golang:1.23-alpine AS build
WORKDIR /src
COPY go.mod ./
COPY cmd ./cmd
COPY internal ./internal
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/nautrace-gateway ./cmd/server

FROM alpine:3.21
RUN adduser -D -H -u 10001 appuser
USER appuser
COPY --from=build /out/nautrace-gateway /usr/local/bin/nautrace-gateway
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/nautrace-gateway"]
