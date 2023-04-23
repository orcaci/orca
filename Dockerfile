## 1. This tells docker to use the Rust official image
#FROM rust:1.49
#
## 2. Copy the files in your machine to the Docker image
#COPY . .
#
## Build your program for release
#RUN cargo build --bin api  --release
#
## Run the binary
#CMD ["./target/release/api"]


#FROM rust as builder
#
## muslc is required in order to build the rust image.
#RUN apt-get update && apt-get -y install ca-certificates cmake musl-tools libssl-dev && rm -rf /var/lib/apt/lists/*
#
#WORKDIR /usr/src/orca
#
#COPY . .
#RUN rustup target add x86_64-unknown-linux-musl
## Sets the environment variable for the cargo build command that follows.
#ENV PKG_CONFIG_ALLOW_CROSS=1
#RUN cargo install --package api --bin api --target x86_64-unknown-linux-musl --release
#
#
#
#FROM alpine:3.8
#
#RUN apk --no-cache add ca-certificates
#COPY --from=builder /usr/local/cargo/bin/api /usr/local/bin/api
#
#CMD ["/api"]

ARG BASE_IMAGE=ekidd/rust-musl-builder:latest

# Our first FROM statement declares the build environment.
FROM ${BASE_IMAGE} AS builder

# Add our source code.
ADD . ./

# Fix permissions on source code.
RUN sudo chown -R rust:rust /home/rust

# Build our application.
RUN cargo build --release --package api --bin api

# Now, we need to build our _real_ Docker container, copying in `rust-actix-example`.
FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=builder \
    /home/rust/src/target/x86_64-unknown-linux-musl/release/orca \
    /usr/local/bin/
CMD /usr/local/bin/orca