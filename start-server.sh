#!/bin/bash
cd /home/z/my-project
while true; do
    echo "Starting Next.js server..."
    bunx next dev -p 3000
    echo "Server stopped, restarting in 3 seconds..."
    sleep 3
done
