#!/bin/bash
rm -rf mongo
mongodump --db karunaData --out ./mongo
