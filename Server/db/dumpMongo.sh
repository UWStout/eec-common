#!/bin/bash
rm -rf mongo
mongodump --db karunaData --out ./mongo
mongodump --db karunaLogs --out ./mongo
