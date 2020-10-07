Ext.define('Opt.view.dialog.TrafficEdit.TrafficEditFormController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.trafficeditformcontroller',

	init: function(){
		var pointsGrid = Ext.getCmp('trafficeditpoints');
		this.pointsStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.TrafficPoints',
			proxy: {
				type: 'memory',
				enablePaging: false,
			},
		});

		pointsGrid.setStore(this.pointsStore);
	},

	listen: {
		controller: {
			'*': {
				TrafficEditShow: 'onShow',
				TrafficMapRendered: 'onMapRender',
				startTrafficMarkerSetPos: 'startTrafficMarkerDragEnd',
				startTrafficMarkerSetPos: 'startTrafficMarkerDragEnd',
				finishTrafficMarkerSetPos: 'finishTrafficMarkerDragEnd',
				startTrafficMarkerDragEnd: 'startTrafficMarkerDragEnd',
				finishTrafficMarkerDragEnd: 'finishTrafficMarkerDragEnd',
				trafficPointsRecieved: 'trafficPointsRecieved',
				trafficGeometryRecieved: 'trafficGeometryRecieved',
				deleteStartTrafficMarker: 'deleteStartTrafficMarker',
				deleteFinishTrafficMarker: 'deleteFinishTrafficMarker',
				trafficDistanceRecieved: 'trafficDistanceRecieved',
			}
		},
	},

	startTrafficMarkerSetPosEcho: function(){
		console.log("startTrafficMarkerSetPosEcho: function(){");		
	},

	deleteStartTrafficMarker: function(){
		var form = this.lookupReference('form').getForm();
		this.pointsStore.removeAll();

		form.setValues({
			geometry: '',
			begin_lat: 0,
			begin_lon: 0,
		});
	},

	deleteFinishTrafficMarker: function(){
		var form = this.lookupReference('form').getForm();
		this.pointsStore.removeAll();

		form.setValues({
			geometry: '',
			end_lat: 0,
			end_lon: 0,
		});
	},

	trafficPointsRecieved: function(points){
		this.pointsStore.loadData(points);
	},

	trafficGeometryRecieved: function(geometry){
		var form = this.lookupReference('form').getForm();

		form.setValues({
			geometry: JSON.stringify(geometry),
		});
	},

	setMarkersAndLines: function(){
		var dialog = this.getView().down('form');
		var record = dialog.getRecord();
		if (!record) return;

		var mapCmp = Ext.getCmp('trafficeditmap');

		var begin_lat = record.get("begin_lat");
		var begin_lon = record.get("begin_lon");
		if ( begin_lat > 0 && begin_lon > 0) {
			mapCmp.createStartTrafficMarker(L.latLng(begin_lat, begin_lon));
		}

		var end_lat = record.get("end_lat");
		var end_lon = record.get("end_lon");
		if ( end_lat > 0 && end_lon > 0) {
			mapCmp.createFinishTrafficMarker(L.latLng(end_lat, end_lon));
		}

		var geometry = record.get("geometry");
		if (geometry) {
			try {
				var geometryJson = JSON.parse(geometry);
        			mapCmp.setTrafficLineFromRecord(geometryJson);
			} catch {

			}
		}

		if (!mapCmp.startTrafficMarker && !mapCmp.finishTrafficMarker) {
			mapCmp.resetMapView();
		}
	},

	comboSetListSize: function(){
		Ext.get('trafficediticoncombo-picker').setWidth(30);
	},

	onShow: function(){
		var self = this;
		var mapEdit = Ext.getCmp('trafficeditmap');
		if (!mapEdit.mapRendered) return;
				
		setTimeout(function(){
			mapEdit.resetLayers();
			self.setMarkersAndLines();
		},0)
	},

	onMapRender: function (comp, map, layers) {
		var mapEdit = Ext.getCmp('trafficeditmap');
		mapEdit.mapRendered = true;
		this.setMarkersAndLines();
	},

	startTrafficMarkerDragEnd: function(latlon){
		var form = this.lookupReference('form').getForm();

		form.setValues({
			begin_lat: latlon.lat.toFixed(6),
			begin_lon: latlon.lng.toFixed(6),
		});
	},

	finishTrafficMarkerDragEnd: function(latlon){
		var form = this.lookupReference('form').getForm();

		form.setValues({
			end_lat: latlon.lat.toFixed(6),
			end_lon: latlon.lng.toFixed(6),
		});
	},

	trafficDistanceRecieved: function(distance){
		var form = this.lookupReference('form').getForm();

		form.setValues({
			distance: distance,
		});		
	},
});