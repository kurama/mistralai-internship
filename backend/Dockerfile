# Build stage
FROM golang:1.24 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o backend main.go

# Run stage (Distroless)
FROM gcr.io/distroless/base-debian12:nonroot@sha256:06c713c675e983c5aea030592b1d635954218d29c4db2f8ec66912da1b87e228
WORKDIR /app
COPY --from=builder /app/backend .
EXPOSE 8080
CMD ["./backend"]
