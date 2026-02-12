#!/bin/bash

# Set up SSH tunnel
ssh -N -L 6543:db.tfvhifjsfwtlwgqmoklu.supabase.co:6543 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null localhost &
TUNNEL_PID=$!

# Wait for tunnel to establish
sleep 2

# Connect using local tunnel
PGPASSWORD="Pick1thing1@@hrs" psql -h localhost -p 6543 -U postgres -d postgres

# Clean up tunnel on exit
kill $TUNNEL_PID