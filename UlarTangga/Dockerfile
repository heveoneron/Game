# Multi-stage build: Go compiler
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY go.mod go.sum ./
RUN go mod download

# Copy source and compile static binary
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o ulartangga .

# Runner stage: Alpine minimal image (~15MB)
FROM alpine:3.20

WORKDIR /app

# Install ca-certificates in case of HTTPS calls
RUN apk --no-cache add ca-certificates tzdata

# Copy compiled binary and static assets
COPY --from=builder /app/ulartangga .
COPY --from=builder /app/public ./public

# Cloud Run default port
ENV PORT=8080
EXPOSE 8080

CMD ["./ulartangga"]
