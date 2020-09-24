Ext.define('Opt.view.tabs.fuelStationsViewer.Map', {
	extend: 'Opt.view.tabs.BaseMap',
	alias: 'widget.fuelstationsviewermap',
	requires: [
		'Opt.view.tabs.BaseMap',
		'Opt.view.tabs.fuelStationsViewer.MapController',
	],

	controller: 'fuelstationsviewermapcontroller',

	markerFuelStations: null,
	clusterFuelStations: null,

	listeners: {
		maprender: 'onMapRender',
		mapClick: 'onMapClick',
		mapDblClick: 'onMapDblClick',
		zoomend: 'onMapZoomLevelsChange',
	},

	bodyStyle: 'border-top: 1px solid #99bce8',

	markersFitBounds: function () {
		this.map.closePopup();
		var gr = new L.featureGroup();

		if (this.clusterFuelStations) {
			gr.addLayer(this.clusterFuelStations);
		}

		if (gr && gr.getLayers().length > 0) {
			this.map.fitBounds(gr.getBounds(), pad);
		}

		gr = null;
	},


	setFuelStationsOnMap: function (response, fitB) {
		if (!this.map) return;
		var self = this;

		this.resetFuelStations();

		this.markerFuelStations = L.geoJson(response, {
			pointToLayer: function (feature, latlng) {
				var point = new L.circleMarker(latlng, {
					radius: 8,
					fillColor: "rgba(1, 237, 255, 1)",
					color: "blue",
					weight: 4,
					fillOpacity: 1,
					opacity: 1
				});
				return point;
			},

			onEachFeature: function (feature, layer) {
//console.log(feature);
				var popupText = '<span>';
				popupText = popupText + '<b>' + feature.properties.naim + '</b><br />';
				popupText = popupText + feature.properties.adres;
				popupText = popupText + '</span>';
				layer.bindPopup(popupText, popupOptionsOrders);
			}
		});

		if (this.markerFuelStations.getLayers().length > 0) {
			if (this.clusterFuelStations) {
				this.rebuildFuelStationsCluster();
			} else {
				this.clusterFuelStations = new L.markerClusterGroup({
					spiderfyOnMaxZoom: false,
					showCoverageOnHover: false,
					zoomToBoundsOnClick: false,
					maxClusterRadius: 50,
					iconCreateFunction: function (cluster) {
						var childCount = cluster.getChildCount();

						var c = ' fuel-marker-cluster-';
						if (childCount < 10) {
							c += 'small';
						} else if (childCount < 100) {
							c += 'medium';
						} else {
							c += 'large';
						}

						return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
					}
				});

				this.clusterFuelStations.on('clusterclick', function (a) {
					getClusterPopup(a.layer);
				});
				this.clusterFuelStations.addLayer(this.markerFuelStations);
				this.map.addLayer(this.clusterFuelStations);
			}
		} else {
			if (this.markerFuelStations != null) {
				this.map.removeLayer(this.markerFuelStations);
				this.markerFuelStations = null;
			}

			if (this.clusterFuelStations != null) {
				this.map.removeLayer(this.clusterFuelStations);
				this.clusterFuelStations = null;
			}
		}

		this.markersFitBounds();
	},

	rebuildFuelStationsCluster: function () {
		this.clusterFuelStations.clearLayers();
		this.clusterFuelStations.addLayer(this.markerFuelStations);
	},

	resetFuelStations: function () {
		if (this.map != null) {
			this.map.closePopup();
		}

		if (this.markerFuelStations != null) {
			this.map.removeLayer(this.markerFuelStations);
			this.markerFuelStations = null;
		}

		if (this.clusterFuelStations != null) {
			this.map.removeLayer(this.clusterFuelStations);
			this.clusterFuelStations = null;
		}

		this.markersFitBounds();
	},

	openClusterPopup: function (lat, lon) {
		var self = this;
		if(!this.clusterFuelStations || this.clusterFuelStations.length == 0) return;
		this.clusterFuelStations.eachLayer(function (layer) {
			if (layer.getLatLng().equals(L.latLng(lat, lon))) {
				var visibleOne = self.clusterFuelStations.getVisibleParent(layer);
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