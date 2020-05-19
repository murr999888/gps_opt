	var timeForStop = 60; // время остановки, когда считаем это стоянкой
	var timeForStopMax = 600; //время остановок, на которые нужно обратить внимание
	var trackColor = 'blue';
	var popupOptionsTrack = {
		maxWidth: 600
	};

	var markerRadius = 3;
	var markerStopRadius = 5;

	var speedIcon = L.icon({
		iconSize: [27, 27],
		iconAnchor: [2, 27],
		popupAnchor: [1, -24],
		iconUrl: 'images/flag3_red_left.png',
		className: 'speedMarker'
	});


	function setPopupContent(feature) {
		var popupText = '';

		popupText = '<span title="imei: ' + feature.properties.imei + '"><b>' + feature.properties.description + '</b></span>';

		if (feature.properties.gosnomer != '') {
                	popupText = popupText + '<br/>Номер: <b>' + feature.properties.gosnomer + '</b>';
		}
		
		
		if (feature.properties.type == 'stop') {
			
			popupText = popupText + '<br/>Остановка на <b>' + getDuration((feature.properties.stop_time_finish - feature.properties.stop_time_start) * 1000) + '</b>' +
				'<br/>с <b>' + convertTimestampToHHMMSS(feature.properties.stop_time_start) + '</b> по <b>' + convertTimestampToHHMMSS(feature.properties.stop_time_finish) + '</b>';
			popupText = popupText + '<br/>' + feature.geometry.coordinates[1].toFixed(6) + ',' + feature.geometry.coordinates[0].toFixed(6);
		} else {
			
			popupText = popupText + '<br/>' + convertTimestampToDate(feature.properties.tracker_time) +
				'<br/>' + feature.geometry.coordinates[1].toFixed(6) + ',' + feature.geometry.coordinates[0].toFixed(6);

			if (feature.properties.speed > 0) {
				popupText = popupText + '<br/>Скорость:<b>' + feature.properties.speed + '</b> км/ч';
			}

			if (feature.properties.speed > 0 || feature.properties.course > 0) {
				popupText = popupText + '<br/>Курс:<b>' + getStrCourse(feature.properties.course) + '</b>';
			}

		        popupText = popupText + infAboutFeature(feature.properties);

		}
		return popupText;
	}
