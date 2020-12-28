#!/bin/bash


#скачиваем последний pbf
wget https://download.geofabrik.de/europe/ukraine-latest.osm.pbf -O /tmp/ukraine-latest.osm.pbf

service osrm stop
cp /tmp/ukraine-latest.osm.pbf /var/osrm/pbf/ukraine-latest.osm.pbf
cp /tmp/ukraine-latest.osm.pbf /var/osrm/original/ukraine-latest.osm.pbf

#обрабатываем по полной, включая траффик
./osrm-extract /var/osrm/original/ukraine-latest.osm.pbf -p osrm-backend/profiles/car.lua
./osrm-partition /var/osrm/original/ukraine-latest.osrm
cp /var/osrm/original/* /var/osrm/working/
./osrm-customize /var/osrm/working/ukraine-latest.osrm --segment-speed-file /var/osrm/working/traffic/traffic.csv
./osrm-datastore /var/osrm/working/ukraine-latest.osrm
service osrm start


