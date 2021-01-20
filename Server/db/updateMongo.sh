#!/bin/bash
mongorestore --db karunaData --drop ./mongo/karunaData/
if [ -e ./mongo/karunaLogs ]; then
  mongorestore --db karunaLogs --drop ./mongo/karunaLogs/
fi
