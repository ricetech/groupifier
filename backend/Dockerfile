# Use the official Rust image.
# https://hub.docker.com/_/rust
FROM rustlang/rust:nightly AS builder

# Copy local code to the container image.
WORKDIR /usr/src/app
COPY . .

# Install production dependencies and build a release artifact.
RUN cargo build --release

# Use a multi-stage image to save space. This image should contain the bare minimum to run this web server.
FROM rustlang/rust:nightly-slim

# Copy the compiled executable over to this image
WORKDIR /root/
COPY --from=builder /usr/src/app/target/release/backend .

# Service must listen to $PORT environment variable.
# This default value facilitates local development.
ENV PORT 8000

# Run the web service on container startup, telling Rocket to use $PORT
CMD ROCKET_PORT=$PORT ./backend
