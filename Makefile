help:
	@echo "Make Commands:"
	@echo "make help\n\tGive you the Help option supported"
	@echo "make init\n\tInitialize Project (For Debian/Ubuntu)"
	@echo "make dev\n\tStart with Hot Module Reload."
	@echo "make prod\n\tStart with --release"
	@echo "make stop\n\tKill running processes."

init:
	cargo install --bin api

start:
	cd backend && cargo watch -q -c -w src/ -x run &
	cd frontend && trunk serve &