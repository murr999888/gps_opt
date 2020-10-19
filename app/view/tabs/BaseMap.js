Ext.define('Opt.view.tabs.BaseMap', {
	extend: 'Opt.view.Map',
	alias: 'widget.basemap',
	requires: [
		'Opt.view.Map',
	],

	markerOrders: null,
	clusterOrders: null,

	decorator: null,
	speedMarkerGroup: null,
	trackPoints: null,
	finishMarker: null,
	allRouteLayer: null,
	markerStrumok: null,
	lineLeg: null,

	trafficLine: null,
	startTrafficMarker: null,
	finishTrafficMarker: null,
	trafficLineGroup: null,

	trafficLineOptions: {
		color: 'red',
		opacity: 1,
		weight: 5,
	},	

	listeners: {
		maprender: 'onMapRender',
		mapClick: 'onMapClick',
		mapDblClick: 'onMapDblClick',
		zoomend: 'onMapZoomLevelsChange',
	},

	createStopSignMarker: function(latlng, icon){
		var self = this;
		if (!icon) icon = 'css/images/signs/znak-proezd-16-16.png';
		var icon = L.icon(
			{
			      iconUrl: icon,
			      //iconSize: [20, 56],
			      iconAnchor: [8, 8]
			}
		);

		return L.marker(latlng, {
			icon: icon,
			zIndexOffset: 500,
			draggable: false,
			//interactive: false,
		});
	},

	setAllTraficLinesOnMap: function(){
		var self = this;

		if (this.trafficLineGroup != null) {
			this.map.removeLayer(this.trafficLineGroup);
			this.trafficLineGroup = null;			
		}

		var currZoom = this.map.getZoom();

		if (currZoom < 12) return; 

		this.trafficLineGroup = L.featureGroup();
		var store = Ext.getStore('Traffic');

		store.each(function(record){
			var geometryString = record.get('geometry');
			var geometry = JSON.parse(geometryString);
			if (geometry) {
				var trafficLine = L.polyline(geometry, self.trafficLineOptions);
				trafficLine['trafficId'] = record.get('id');

				var content = 'Пробка';
				if (record.get('distance') > 0){
					content = content + ' на ' + strDistance(record.get('distance'));
				}

				content = '<b>' + content + '</b><br />';
				var content = content 
				+ 'до ' + record.get("speed") + ' км/ч <br />'
				+ record.get("name");

				if (record.get("prim")) {
					content = content + '<br />' + record.get("prim");
				}

				trafficLine.bindPopup(content,{maxWidth: 120});
				self.trafficLineGroup.addLayer(trafficLine);
				if (currZoom > 13) {
					var stopMarker1 = self.createStopSignMarker(geometry[0], record.get("icon"));
					var stopMarker2 = self.createStopSignMarker(geometry[geometry.length-1], record.get("icon"));
					stopMarker1.bindPopup(content,{maxWidth: 120});
					stopMarker2.bindPopup(content,{maxWidth: 120});
					self.trafficLineGroup.addLayer(stopMarker1);
					self.trafficLineGroup.addLayer(stopMarker2);
				} else {
					var centerLineFeature = turf.center(trafficLine.toGeoJSON());
					var centerCoords = [centerLineFeature.geometry.coordinates[1],centerLineFeature.geometry.coordinates[0]];
					var stopMarker = self.createStopSignMarker(centerCoords, record.get("icon"));
					stopMarker.bindPopup(content,{maxWidth: 120});
					self.trafficLineGroup.addLayer(stopMarker);
				}
			}
		});

		if (this.trafficLineGroup.getLayers().length > 0) {
			this.trafficLineGroup.addTo(this.map);
		}
	},

	resetMapView: function(){
		this.map.setView(strumokpoint, 12);
	},

	deleteLineLeg: function () {
		this.map.closePopup();

		if (this.lineLeg != null) {
			this.map.removeLayer(this.lineLeg);
		}

		this.lineLeg = null;
	},

	setStrumokMarker: function () {
		if (this.markerStrumok != null) {
			this.map.removeLayer(this.markerStrumok);
			this.markerStrumok = null;
		}

		this.markerStrumok = L.circleMarker(strumokpoint, {
			radius: 7,
			opacity: 0.8
		});

		this.markerStrumok.bindPopup('Струмок');
		this.markerStrumok.addTo(this.map);
	},

	resetLayers: function () {
		if (this.map != null) {
			this.map.closePopup();
		}
/*
		if (this.trafficLineGroup != null) {
			this.map.removeLayer(this.trafficLineGroup);
			this.trafficLineGroup = null;			
		}
*/

		if (this.trackPoints != null) {
			this.map.removeLayer(this.trackPoints);
			this.trackPoints = null;
		}

		if (this.arrows != null) {
			this.map.removeLayer(this.arrows);
			this.arrows = null;
		}

		if (this.speedMarkerGroup != null) {
			this.map.removeLayer(this.speedMarkerGroup);
			this.speedMarkerGroup = null;
		}

		if (this.decorator != null) {
			this.map.removeLayer(this.decorator);
			this.decorator = null;
		}

		if (this.finishMarker != null) {
			this.map.removeLayer(this.finishMarker);
			this.finishMarker = null;
		}

		if (this.markerOrders != null) {
			this.map.removeLayer(this.markerOrders);
			this.markerOrders = null;
		}

		if (this.clusterOrders != null) {
			this.map.removeLayer(this.clusterOrders);
			this.clusterOrders = null;
		}

		if (this.markerStrumok != null) {
			this.map.removeLayer(this.markerStrumok);
			this.markerStrumok = null;
		}

		if (this.lineLeg != null) {
			this.map.removeLayer(this.lineLeg);
			this.lineLeg = null;
		}

		if (this.startTrafficMarker != null) {
			this.map.removeLayer(this.startTrafficMarker);
			this.startTrafficMarker = null;
		}

		if (this.finishTrafficMarker != null) {
			this.map.removeLayer(this.finishTrafficMarker);
			this.finishTrafficMarker = null;
		}

		if (this.trafficLine != null) {
			this.map.removeLayer(this.trafficLine);
			this.trafficLine = null;
		}

		if (this.allRouteLayer != null) {
			var self = this;
			this.allRouteLayer.eachLayer(function (layer) {
				self.map.removeLayer(layer);
			});

			this.map.removeLayer(this.allRouteLayer);
			this.allRouteLayer = null;
		}
	},

	setOrdersOnMap: function (response, fitB) {
		if (!this.map) return;
		var self = this;

		this.markerOrders = L.geoJson(response, {
			pointToLayer: function (feature, latlng) {
				var point = new L.circleMarker(latlng, {
					radius: 8,
					fillColor: "red",
					color: "yellow",
					weight: 4,
					fillOpacity: 1,
					opacity: 1
				});

				if (feature.properties.node_type != null && feature.properties.node_type == 3) {
					var point = new L.circleMarker(latlng, {
						radius: 6,
						fillColor: "rgba(1, 237, 255, 1)",
						color: "blue",
						weight: 4,
						fillOpacity: 1,
						opacity: 1
					});
				}
				return point;
			},

			onEachFeature: function (feature, layer) {
				var popupText = '<span ';
				if (feature.properties.flagneisp == 1) {
					popupText = popupText + ' class="red"'
				}

				popupText = popupText + '>';

				popupText = popupText + '<b>' + feature.properties.naim + '</b><br/>';

				if (feature.properties.adres != '' && feature.properties.adres != feature.properties.naim) {
					popupText = popupText + feature.properties.adres + '<br/>';
				}

				popupText = popupText + feature.properties.sod + feature.properties.vremya + '</span>';

				if (feature.properties.node_type != null && feature.properties.node_type == 3) {
					popupText = popupText + '<br /><b>' + feature.properties.dop + '</b>';
				}

				layer.bindPopup(popupText, popupOptionsOrders);
			}
		});

		if (this.markerOrders.getLayers().length > 0) {
			if (this.clusterOrders) {
				this.rebuildCluster();
			} else {
				this.clusterOrders = new L.markerClusterGroup({
					spiderfyOnMaxZoom: false,
					showCoverageOnHover: false,
					zoomToBoundsOnClick: false,
					maxClusterRadius: 50,
					animate: false
				});

				this.clusterOrders.on('clusterclick', function (a) {
					getClusterPopup(a.layer);
				});
				this.clusterOrders.addLayer(this.markerOrders);
				this.map.addLayer(this.clusterOrders);
			}
		} else {
			if (this.markerOrders != null) {
				this.map.removeLayer(this.markerOrders);
				this.markerOrders = null;
			}

			if (this.clusterOrders != null) {
				this.map.removeLayer(this.clusterOrders);
				this.clusterOrders = null;
			}
		}
	},

	rebuildCluster: function () {
		this.clusterOrders.clearLayers();
		this.clusterOrders.addLayer(this.markerOrders);
	},

	setPopupContent: function (feature) {
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

			popupText = popupText + infAboutFeature(feature);

		}
		return popupText;
	},

	setArrows: function () {
		var self = this;

		if (this.decorator != null) {
			this.map.removeLayer(this.decorator);
			this.decorator = null;
		}

		if (this.map.getZoom() <= 14) return;

		if (self.lineLeg != null && self.decorator == null) {
			self.lineLeg.eachLayer(function (polyline) {
				if (polyline.getLatLngs().length > 3 && polyline.options.color == 'blue') {
					self.decorator = L.polylineDecorator(polyline, {
						patterns: [{
							offset: 50,
							endOffset: 50,
							repeat: 300,
							symbol: L.Symbol.arrowHead({
								pixelSize: 10,
								pathOptions: {
									color: trackColor,
									fillOpacity: 1,
									weight: 1
								}
							})
						}],
						pane: 'routelinesBlue',
					}).addTo(self.map);
				}
			});
		} else {
			if (this.decorator != null) {
				this.map.removeLayer(this.decorator);
				this.decorator = null;
			}
		}
	},

	setFinishMarker: function (point) {
		var self = this;

		if (this.finishMarker != null) {
			this.map.removeLayer(this.finishMarker);
			this.finishMarker = null;
		}

		var pulsingIcon = L.icon.pulse({
			iconSize: [15, 15],
			fillColor: point.options.fillColor,
			color: point.options.color
		});

		this.finishMarker = L.marker(point.getLatLng(), {
			icon: pulsingIcon,
			zIndexOffset: 500
		});

		this.finishMarker.bindPopup(point.getPopup().getContent(), popupOptionsTrack);

		this.finishMarker.on('click', function () {
			var gr = L.featureGroup([self.finishMarker]);
			self.map.fitBounds(gr.getBounds(), pad);
			gr = null;
		});

		this.finishMarker.addTo(this.map);
	},

	setPolyLine: function (arr) {
		if (arr.length > 1) {
			this.polyline = L.polyline(arr, {
				color: trackColor,
				clickable: false,
				weight: 2
			}).addTo(this.map);

			this.setArrows();
		} else {
			this.polyline = null;
		}
	},

	getClosestStop: function (lat, lon) {
		if (!this.trackPoints) return;

		var LN = L.latLng([lon, lat]);
		var closestPoint = {
			layer: null,
			dist: 0
		};

		this.trackPoints.eachLayer(function (layer) {
			var feature = layer.feature;
			if (feature) {
				if (feature.properties.type == 'stop') {
					var diff = feature.properties.stop_time_finish - feature.properties.stop_time_start;
					if (diff > timeForStop) {
						var dist = LN.distanceTo(layer.getLatLng());
						var isInCircleRadius = Math.abs(dist) <= radiusClosestStop;
						if (isInCircleRadius) {
							if (!closestPoint.layer || dist < closestPoint.dist) {
								closestPoint.layer = layer;
								closestPoint.dist = dist;
							}
						}
					}
				}
			}
		});

		if (closestPoint.layer) {
			setTimeout(function () {
				closestPoint.layer.openPopup();
			}, 2000);
		}
	},

	showPointByTime: function (timeOfPoint) {
		var self = this;
		if (!this.trackPoints) return;

		this.trackPoints.eachLayer(function (layer) {
			var feature = layer.feature;
			if (feature) {
				if (feature.properties.tracker_time == timeOfPoint) {
					var gr = L.featureGroup([layer]);
					self.map.fitBounds(gr.getBounds(), pad);
					gr = null;
					setTimeout(function () {
						layer.openPopup();
					}, 1000);
					return;
				}
			}
		});
	},

	constructTrackGeoJSON: function (store) {
		var geoJson = {
			type: 'FeatureCollection',
			crs: {
				type: 'name',
				properties: {
					name: 'EPSG:900913'
				}
			},
			features: []
		};

		store.each(function (record) {
			var newPoint = {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [record.data.longitude, record.data.latitude],
				},
				properties: record.data,
			};

			geoJson.features.push(newPoint);
		});

		return geoJson;
	},

	constructOrdersGeoJSON: function (store) {
		var mainJSON = {
			type: 'FeatureCollection',
			crs: {
				type: 'name',
				properties: { name: 'EPSG:900913' }
			},
			features: []
		}

		store.each(function (record) {
			var feature = {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [record.get("lon"), record.get("lat")]
				},
				properties: {
					nomerzak: record.get("order_number"),
					iddoc: record.get("id"),
					vremya_stoyanki: record.get("service_time"),
					naim: record.get("full_name"),
					adres: record.get("adres"),
					vremya: record.get("timewindow_string"),
					sod: record.get("sod"),
					dop: record.get("dop"),
					node_type: record.get("node_type"),					
				}
			};

			mainJSON.features.push(feature);
		});

		return mainJSON;
	},

	openClusterPopup: function (lat, lon) {
		var self = this;
		this.clusterOrders.eachLayer(function (layer) {
			if (layer.getLatLng().equals(L.latLng(lat, lon))) {
				var visibleOne = self.clusterOrders.getVisibleParent(layer);
				if (visibleOne != null) {
					getClusterPopup(visibleOne);
					return;
				} else {
					layer.openPopup();
				}
				return true;
			}
		});
	},

	setCenter: function (lon, lat) {
		var self = this;
		this.map.closePopup();
		this.map.setView([lat, lon], this.map.getMaxZoom());
		setTimeout(function () {
			self.openClusterPopup(lat, lon);
		}, 1000);
	},
});

function infAboutFeature(feature) {

	var popupText = '';

	if (showAltitude && feature.altitude != 0) {
		popupText = popupText + '<br /> Высота: <b>' + feature.altitude + ' м.</b>';
	}

	if (showSatellite && feature.satellite != 0) {
		popupText = popupText + '<br /> <span style="width: ' + indicatorTitleSpanWidth + 'px;display: inline-block;">Спутники:</span>' + getIndicator5(feature.satellite, 4, 19);
	}


	popupText = popupText + '<br /><span style="width: ' + indicatorTitleSpanWidth + 'px;display: inline-block;">Уровень GSM:</span>' + getIndicator5(feature.gsmLevel, 0, 5);

	if (feature.voltage && Number(feature.voltage) < 3) {
		popupText = popupText + '<br /><span style="width: ' + indicatorTitleSpanWidth + 'px;display: inline-block;">Батарея:</span>' + getIndicator5(feature.battery, batteryVoltage.minVal, batteryVoltage.maxVal, feature.battery + 'V');
	}

	if (feature.acc_sensor) {
		popupText = popupText + '<br /><span style="width: ' + indicatorTitleSpanWidth + 'px;display: inline-block;">Зажигание:</span>' + getIndicatorOnOff(feature.acc, 0, 1, 'Вкл.', 'Выкл.');
	}

	var alarmString = '';

	if (feature.voltage && Number(feature.voltage) < 10) {
		alarmString = alarmString + '<br />Питание: ' + feature.voltage + ' В';
	}

	if (feature.battery && Number(feature.battery) < 3.8) {
		alarmString = alarmString + '<br />Батарея: ' + feature.battery + ' В (' + getProcent(feature.battery, batteryVoltage.minVal, batteryVoltage.maxVal) + '%)';
	}

	if (alarmString.length > 0) {
		popupText = popupText + '<span style="color: red;"><b>' + alarmString + '</b></span>';
	}

	// если нет связи
	if (feature.online == false) {
		popupText = popupText + '<br /><span style="color: red;"><b>Нет связи с трекером!</b></span>';
	}

	if (showAddParam) {
		popupText = popupText + '<br /> Уровень GSM: <b>' + feature.gsmLevel + '</b>';
	}

	if (showAddParam) {
		popupText = popupText + '<br /> Уровень GPS: <b>' + feature.gpsLevel + '</b>';
	}

	if (showAddParam) {
		popupText = popupText + '<br/> Темп. устройства: <b>' + feature.modemTemp + '&deg;</b>';
	}

	if (showAddParam) {
		popupText = popupText + '<br/> Абс. одометр: <b>' + feature.absOdometr + ' км.</b>';
	}

	return popupText;
}