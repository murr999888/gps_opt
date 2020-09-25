Ext.define('Opt.view.tabs.resultViewer.Map', {
	extend: 'Opt.view.tabs.BaseMap',
	alias: 'widget.resultviewermap',
	requires: [
		'Opt.view.tabs.BaseMap',
		'Opt.view.tabs.resultViewer.MapController',
	],

	controller: 'resultviewermapcontroller',
	finishMarker: null,
	clusterDroppedOrders: null,
	markerDroppedOrders: null,

	dockedItems: [
		{
			xtype: 'toolbar',
			dock: 'top',
			cls: 'x-panel-header x-header x-docked x-unselectable x-panel-header-default x-horizontal x-panel-header-horizontal x-panel-header-default-horizontal x-top x-panel-header-top x-panel-header-default-top x-docked-top x-panel-header-docked-top x-panel-header-default-docked-top x-box-layout-ct',
			height: 27,
			items: [
				{
					id: 'viewerMapTitle',
					xtype: 'label',
					html: 'Маршрут не выбран',
					cls: 'x-title x-panel-header-title x-panel-header-title-default x-box-item x-title-default x-title-rotate-none x-title-align-left'
				}
			]
		}
	],

	bodyStyle: 'border-top: 1px solid #99bce8',

	setFinishMarkerR: function (latlng) {
		if (this.finishMarker != null) {
			this.map.removeLayer(this.finishMarker);
			this.finishMarker = null;
		}

		var iconUrl = 'images/flag3_blue_left.png';

		var smallIcon = new L.Icon({
			iconSize: [25, 41],
			iconAnchor: [1, 38],
			popupAnchor: [-1, -38],
			className: 'placeMarker_small',
			iconUrl: iconUrl
		});

		this.finishMarker = L.marker(latlng, {
			icon: smallIcon,
			zIndexOffset: 500
		});

		var self = this;
		this.finishMarker.on('click', function () {
			var gr = L.featureGroup([self.finishMarker]);
			self.map.fitBounds(gr.getBounds(), pad);
			gr = null;
		});

		this.finishMarker.addTo(this.map);
	},

	markersFitBounds: function () {
		this.map.closePopup();
		var gr = new L.featureGroup();

		if (this.finishMarker) {
			gr.addLayer(this.finishMarker);
		}

		if (this.markerStrumok) {
			gr.addLayer(this.markerStrumok);
		}

		if (this.trackPoints) {
			gr.addLayer(this.trackPoints);
		}

		if (this.clusterOrders) {
			gr.addLayer(this.clusterOrders);
		}

		if (this.clusterDroppedOrders) {
			gr.addLayer(this.clusterDroppedOrders);
		}

		if (this.allRouteLayer) {
			gr.addLayer(this.allRouteLayer);
		}

		if (gr && gr.getLayers().length > 0) {
			this.map.fitBounds(gr.getBounds(), pad);
		}

		gr = null;
	},

	openDroppedClusterPopup: function (lat, lon) {
		var self = this;
		this.clusterDroppedOrders.eachLayer(function (layer) {
			if (layer.getLatLng().equals(L.latLng(lat, lon))) {
				var visibleOne = self.clusterDroppedOrders.getVisibleParent(layer);
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

	setDroppedCenter: function (lon, lat) {
		var self = this;
		this.map.closePopup();
		this.map.setView([lat, lon], this.map.getMaxZoom());
		setTimeout(function () {
			self.openDroppedClusterPopup(lat, lon);
		}, 1000);
	},

	setDroppedOrdersOnMap: function (response, fitB) {
		if (!this.map) return;
		var self = this;

		this.resetDroppedOrders();

		this.markerDroppedOrders = L.geoJson(response, {
			pointToLayer: function (feature, latlng) {
				var point = new L.circleMarker(latlng, {
					radius: 8,
					fillColor: "yellow",
					color: "blue",
					weight: 4,
					fillOpacity: 1,
					opacity: 1
				});
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
				layer.bindPopup(popupText, popupOptionsOrders);
			}
		});

		if (this.markerDroppedOrders.getLayers().length > 0) {
			if (this.clusterDroppedOrders) {
				this.rebuildDroppedCluster();
			} else {
				this.clusterDroppedOrders = new L.markerClusterGroup({
					spiderfyOnMaxZoom: false,
					showCoverageOnHover: false,
					zoomToBoundsOnClick: false,
					maxClusterRadius: 50,
					iconCreateFunction: function (cluster) {
						var childCount = cluster.getChildCount();

						var c = ' blue-marker-cluster-';
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

				this.clusterDroppedOrders.on('clusterclick', function (a) {
					getClusterPopup(a.layer);
				});
				this.clusterDroppedOrders.addLayer(this.markerDroppedOrders);
				this.map.addLayer(this.clusterDroppedOrders);
			}
		} else {
			if (this.markerDroppedOrders != null) {
				this.map.removeLayer(this.markerDroppedOrders);
				this.markerDroppedOrders = null;
			}

			if (this.clusterDroppedOrders != null) {
				this.map.removeLayer(this.clusterDroppedOrders);
				this.clusterDroppedOrders = null;
			}
		}

		this.markersFitBounds();
	},

	rebuildDroppedCluster: function () {
		this.clusterDroppedOrders.clearLayers();
		this.clusterDroppedOrders.addLayer(this.markerDroppedOrders);
	},

	resetDroppedOrders: function () {
		if (this.map != null) {
			this.map.closePopup();
		}

		if (this.markerDroppedOrders != null) {
			this.map.removeLayer(this.markerDroppedOrders);
			this.markerDroppedOrders = null;
		}

		if (this.clusterDroppedOrders != null) {
			this.map.removeLayer(this.clusterDroppedOrders);
			this.clusterDroppedOrders = null;
		}

		this.markersFitBounds();
	},
});