#!/bin/bash

service osrm stop
./osrm-extract /var/osrm/original/ukraine-latest.osm.pbf -p osrm-backend/profiles/car.lua
./osrm-partition "/var/osrm/original/ukraine-latest.osrm"
cp /var/osrm/original/* /var/osrm/working/
./osrm-customize "/var/osrm/working/ukraine-latest.osrm" --segment-speed-file /var/osrm/working/traffic/traffic.csv
./osrm-datastore "/var/osrm/working/ukraine-latest.osrm"
service osrm start


