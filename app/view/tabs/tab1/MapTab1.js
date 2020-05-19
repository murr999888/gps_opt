Ext.define('Opt.view.tabs.tab1.MapTab1', {
	extend: 'Opt.view.tabs.BaseMap',
	alias: 'widget.maptab1',
	requires: [
		'Opt.view.tabs.BaseMap',
		'Opt.view.tabs.tab1.MapTab1Controller',
	],

	controller: 'mapTab1Controller',

	finishMarker: null,

	init: function () {
		Ext.getCmp('maptab1').allRouteLayer = L.featureGroup();
		Ext.getCmp('maptab1').allRouteLayer.addTo(Ext.getCmp('maptab1').map);
	},

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

		if (this.trackPoints) {
			gr.addLayer(this.trackPoints);
		}

		if (this.clusterOrders) {
			gr.addLayer(this.clusterOrders);
		}

		if (this.allRouteLayer) {
			gr.addLayer(this.allRouteLayer);
		}

		if (gr && gr.getLayers().length > 0) {
			this.map.fitBounds(gr.getBounds(), pad);
		}

		gr = null;
	},
});