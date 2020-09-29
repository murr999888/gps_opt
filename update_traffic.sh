#!/bin/bash

http_response() {
  local http_code="$1"
  local message="$2"

  #local length=${#message}

  echo -en "${http_code}\r\n"
  echo -en "Content-Type: text/html; charset=UTF-8\r\n"
  echo -en "\r\n"
  echo -en "${message}"
}

http_200() {
  http_response "HTTP/1.1 200 OK" "$1"
}

/usr/local/bin/osrm-customize /var/osrm/working/ukraine-latest.osrm --segment-speed-file /var/osrm/working/traffic/traffic.csv > /dev/null 2>&1
/usr/local/bin/osrm-datastore /var/osrm/working/ukraine-latest.osrm > /dev/null 2>&1
service osrm restart > /dev/null 2>&1

http_200 "Обновление данных OSRM выполнено."