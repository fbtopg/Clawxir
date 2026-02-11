#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Docker is not running. Starting Docker...${NC}"
        sudo service docker start
        sleep 5
    fi
}

# Function to start Supabase
start_supabase() {
    echo -e "${GREEN}Starting Supabase...${NC}"
    docker-compose up -d
    echo -e "${GREEN}Waiting for services to be ready...${NC}"
    sleep 10
    echo -e "${GREEN}Supabase is running!${NC}"
    echo "Studio: http://localhost:3000"
    echo "API: http://localhost:8000"
    echo "Database: localhost:5432"
}

# Function to stop Supabase
stop_supabase() {
    echo -e "${GREEN}Stopping Supabase...${NC}"
    docker-compose down
}

# Function to show status
status_supabase() {
    echo -e "${GREEN}Supabase Status:${NC}"
    docker-compose ps
}

# Function to show logs
logs_supabase() {
    docker-compose logs -f
}

# Main script
case "$1" in
    start)
        check_docker
        start_supabase
        ;;
    stop)
        stop_supabase
        ;;
    restart)
        stop_supabase
        sleep 2
        start_supabase
        ;;
    status)
        status_supabase
        ;;
    logs)
        logs_supabase
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac

exit 0