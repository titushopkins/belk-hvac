#!/bin/bash

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SETTINGS_FILE="$SCRIPT_DIR/../config/settings.json"

# Read serverIp from settings.json
SERVER_IP=$(grep -o '"serverIp"[[:space:]]*:[[:space:]]*"[^"]*"' "$SETTINGS_FILE" | sed 's/.*"\([^"]*\)".*/\1/')

# Read database name from settings.json
DATABASE=$(grep -o '"database"[[:space:]]*:[[:space:]]*"[^"]*"' "$SETTINGS_FILE" | sed 's/.*"\([^"]*\)".*/\1/')

# Check if serverIp is null or not set
if grep -q '"serverIp"[[:space:]]*:[[:space:]]*null' "$SETTINGS_FILE"; then
    echo "Error: serverIp is set to null in settings.json"
    echo "Please configure the server IP address in $SETTINGS_FILE"
    exit 1
fi

if [ -z "$SERVER_IP" ]; then
    echo "Error: serverIp not found in settings.json"
    echo "Please add serverIp to $SETTINGS_FILE"
    exit 1
fi

if [ -z "$DATABASE" ]; then
    echo "Error: database not found in settings.json"
    echo "Please add database to $SETTINGS_FILE"
    exit 1
fi

echo "Using server IP: $SERVER_IP"
echo "Using database: $DATABASE"

cd ~/Downloads;
ssh root@$SERVER_IP "rm -rf dump.zip; mongodump --db $DATABASE; zip -r dump.zip dump"
rsync root@$SERVER_IP:~/dump.zip ~/Downloads/dump.zip;
unzip -o dump.zip;
mongorestore --drop dump;
rm -rf dump;
rm -rf dump.zip;
