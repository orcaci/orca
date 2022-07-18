FROM rust:1.43.1
WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install musl-tools -y
RUN rustup target add x86_64-unknown-linux-musl

COPY Cargo.toml Cargo.toml
COPY config config
COPY engine engine
COPY entity entity
COPY src src


RUN cargo install --path .

EXPOSE 8080

CMD ["cargo", "run"]