#FROM rust:1.28.0-stretch as builder
#
## muslc is required in order to build the rust image.
#RUN apt-get update && apt-get -y install ca-certificates cmake musl-tools libssl-dev && rm -rf /var/lib/apt/lists/*
#
#COPY . .
#RUN rustup target add x86_64-unknown-linux-musl
## Sets the environment variable for the cargo build command that follows.
#ENV PKG_CONFIG_ALLOW_CROSS=1
#RUN cargo build --target x86_64-unknown-linux-musl --release
#
#
#FROM alpine:3.8
#
#RUN apk --no-cache add ca-certificates
#COPY --from=builder /target/x86_64-unknown-linux-musl/release/rust-actix-web .
#
#CMD ["/orca"]


FROM rust:1-stretch as builder

WORKDIR /usr/src/app
#COPY . .
COPY Cargo.toml Cargo.toml
COPY config config
COPY engine engine
COPY entity entity
COPY src src
RUN cargo build --release

FROM debian:stretch-slim
COPY --from=builder /usr/src/app/target/release/orca /bin/
CMD orca