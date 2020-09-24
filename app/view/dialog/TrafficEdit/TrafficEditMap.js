Ext.define('Opt.view.dialog.TrafficEdit.TrafficEditMap', {
	extend: 'Opt.view.tabs.BaseMap',
	xtype: 'trafficeditmap',
	alias: 'widget.trafficeditmap',
	requires: [
		'Opt.view.tabs.BaseMap',
		'Opt.view.dialog.TrafficEdit.TrafficEditMapController',
	],

	controller: 'trafficeditmapcontroller',

	bodyStyle: 'border-top: 1px solid #99bce8',

	listeners: {
		maprender: 'onMapRender',
		mapClick: 'onMapClick',
		mapDblClick: 'onMapDblClick',
		zoomend: 'onMapZoomLevelsChange',
	},
	
	createStartTrafficMarker: function(latlng) {
		var self = this;
		var icon = L.icon(
			{
			      iconUrl: 'css/images/marker-start-icon-2x.png',
			      iconSize: [20, 56],
			      iconAnchor: [10, 28]
			}
		);

		this.startTrafficMarker = L.marker(latlng, {
			icon: icon,
			zIndexOffset: 500,
			draggable: true,
		});

		this.startTrafficMarker.on('dragend', function(e){
			self.setTrafficLine();
			self.controller.onStartTrafficMarkerDragEnd(e.target.getLatLng());
		});

		this.startTrafficMarker.on('click', function(e){
			self.deleteTrafficLine();
			if (self.startTrafficMarker != null) {
				self.map.removeLayer(self.startTrafficMarker);
				self.startTrafficMarker = null;
				self.deleteTrafficLine();
				self.controller.onDeleteStartTrafficMarker();
			}
		});

		this.startTrafficMarker.addTo(this.map);
	},

	setStartTrafficMarker: function(latlng) {
		this.createStartTrafficMarker(latlng);
		this.controller.onStartTrafficMarkerSetPos(latlng);
	},

	createFinishTrafficMarker: function(latlng) {
		var self = this;
		var icon = L.icon(
			{
			      iconUrl: 'css/images/marker-end-icon-2x.png',
			      iconSize: [20, 56],
			      iconAnchor: [10, 28]
			}
		);

		this.finishTrafficMarker = L.marker(latlng, {
			icon: icon,
			zIndexOffset: 500,
			draggable: true,
		});

		this.finishTrafficMarker.on('dragend', function(e){
			self.setTrafficLine();
			self.controller.onFinishTrafficMarkerDragEnd(e.target.getLatLng());
		});

		this.finishTrafficMarker.on('drag', function(e){

		});

		this.finishTrafficMarker.on('click', function(e){
			self.deleteTrafficLine();
			if (self.finishTrafficMarker != null) {
				self.map.removeLayer(self.finishTrafficMarker);
				self.finishTrafficMarker = null;
				self.deleteTrafficLine();
				self.controller.onDeleteFinishTrafficMarker();
			}
		});

		this.finishTrafficMarker.addTo(this.map);
	},

	setFinishTrafficMarker: function(latlng) {
		this.createFinishTrafficMarker(latlng);
		this.controller.onFinishTrafficMarkerSetPos(latlng);
	},

	setTrafficMarker: function(latlng){
		var self = this;

		if (!this.startTrafficMarker) {
			this.setStartTrafficMarker(latlng);
			this.setTrafficLine();
		} else if (!this.finishTrafficMarker) {
			this.setFinishTrafficMarker(latlng);
			this.setTrafficLine();
		}
	},

	setTrafficLine: function(){
		if (this.startTrafficMarker && this.finishTrafficMarker) {
			this.getTrafficRoute(this.startTrafficMarker.getLatLng(), this.finishTrafficMarker.getLatLng());
			this.trafficLineFitBounds();
		}
	},

	setTrafficLineFromRecord: function(geometry){
		if (geometry) {
			//this.getTrafficRoute(this.startTrafficMarker.getLatLng(), this.finishTrafficMarker.getLatLng());
			var trafficLine = L.polyline(geometry, this.trafficLineOptions);
			this.deleteTrafficLine();
			this.trafficLine = trafficLine;
			this.trafficLine.addTo(this.map);
			this.setTrafficArrows();
			this.trafficLineFitBounds();
		}
	},


	deleteTrafficLine: function(){
		if (this.decorator != null) {
			this.map.removeLayer(this.decorator);
			this.decorator = null;
		}
		if (this.trafficLine != null) {
			this.map.removeLayer(this.trafficLine);
			this.trafficLine = null;
		}
	},

	getTrafficRoute(fromLatLon, toLatLon){
		var self = this;
		var router = new L.Routing.OSRMv1({
			serviceUrl: routeServerUrl,
		});

		fromPoint = new L.Routing.waypoint();
		fromPoint.latLng = fromLatLon;

		toPoint = new L.Routing.waypoint();
		toPoint.latLng = toLatLon;

		var params = {
			overview: false,
			alternatives: true,
			annotations: true,
			steps: true,
			hints: ';',
			geometries:'geojson',
		};

		Ext.Ajax.request({
			url: routeServerUrl + '/driving/' + fromLatLon.lng + ',' + fromLatLon.lat + ';' + toLatLon.lng + ',' + toLatLon.lat,
			method: 'GET',
			params: params,
		        async: true,
			disableCaching:false,
			success: function (response) {
 				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					Opt.app.showError("Ошибка!", error.message);
					return;
        			}

				var lineCoordArray = [];
				var pointsArray = [];
				var wayPointsArray = [];
				var pointsNum = 0;

				

				var route = respObj.routes[0];

				for (var i=0; i < respObj.waypoints.length; i++) {
					var waypoint = respObj.waypoints[i];
					wayPointsArray.push(waypoint.location);
				}

				for(var i=0; i < route.legs.length; i++) {
					var leg = route.legs[i];

					for(var l = 0; l < leg.annotation.nodes.length; l++) {					
						var point = leg.annotation.nodes[l];
						pointsArray.push({num: pointsNum, osm_id: point});
						pointsNum++;
					}

					for(var j = 0; j < leg.steps.length; j++) {
						var step = leg.steps[j];
						for(k=0; k<step.geometry.coordinates.length; k++) {
							var coord = step.geometry.coordinates[k];
	                                                lineCoordArray.push([coord[1],coord[0]]);
						}
					}
				}

				var trafficLine = L.polyline([lineCoordArray], self.trafficLineOptions);

				self.deleteTrafficLine();
				self.trafficLine = trafficLine;
				self.trafficLine.addTo(self.map);
				self.setTrafficArrows();
				self.trafficLineFitBounds();

				self.controller.onTrafficPointsRecieved(pointsArray);
				self.controller.onTrafficWayPointsRecieved(wayPointsArray);
				self.controller.onTrafficGeometryRecieved(lineCoordArray);
			},


			failure: function (response) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
			}
		});
	},

	trafficLineFitBounds: function () {
		
		this.map.closePopup();
		var gr = new L.featureGroup();
                
		if (this.startTrafficMarker && this.finishTrafficMarker) {
			gr.addLayer(this.startTrafficMarker);
			gr.addLayer(this.finishTrafficMarker);
		}

		if (this.trafficLine) {
	                gr.addLayer(this.trafficLine);
		}

		if (gr && gr.getLayers().length > 0) {
			this.map.fitBounds(gr.getBounds(), pad);
		}
		
		gr = null;
	},

	setTrafficArrows: function () {
		var self = this;

		if (this.decorator != null) {
			this.map.removeLayer(this.decorator);
			this.decorator = null;
		}


		var currZoom = this.map.getZoom();
		if (currZoom < 15) return; 

		if (self.trafficLine != null && self.decorator == null) {
			self.decorator = L.polylineDecorator(self.trafficLine, {
				patterns: [{
					offset: 50,
					endOffset: 50,
					repeat: 300,
					symbol: L.Symbol.arrowHead({
						pixelSize: 10,
						pathOptions: {
							color: '#bd0000',
							fillOpacity: 1,
							weight: 1
						}
					})
				}]
			}).addTo(self.map);
		} else {
			if (this.decorator != null) {
				this.map.removeLayer(this.decorator);
				this.decorator = null;
			}
		}
	},
});