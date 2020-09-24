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
			}
		},
	},

	startTrafficMarkerSetPosEcho: function(){
		console.log("startTrafficMarkerSetPosEcho: function(){");		
	},

	deleteStartTrafficMarker: function(){
//console.log("deleteStartTrafficMarker: function(){");
		var form = this.lookupReference('form').getForm();
		this.pointsStore.removeAll();

		form.setValues({
			geometry: '',
			begin_lat: 0,
			begin_lon: 0,
		});
	},

	deleteFinishTrafficMarker: function(){
//console.log("deleteFinishTrafficMarker: function(){");
		var form = this.lookupReference('form').getForm();
		this.pointsStore.removeAll();

		form.setValues({
			geometry: '',
			end_lat: 0,
			end_lon: 0,
		});
	},

	trafficPointsRecieved: function(points){
//console.log("trafficPointsRecieved: function(points){");
		this.pointsStore.loadData(points);
	},

	trafficGeometryRecieved: function(geometry){
//console.log("trafficGeometryRecieved: function(geometry){");
		var form = this.lookupReference('form').getForm();

		form.setValues({
			geometry: JSON.stringify(geometry),
		});
	},

	setMarkersAndLines: function(){
//console.log("setMarkersAndLines: function(){");
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

	onShow: function(){
//console.log("onShow: function(){");
		var mapEdit = Ext.getCmp('trafficeditmap');
		if (!mapEdit.mapRendered) return;

		mapEdit.resetLayers();
		this.setMarkersAndLines();
	},

	onMapRender: function (comp, map, layers) {
//console.log("onMapRender: function (comp, map, layers) {");
		var mapEdit = Ext.getCmp('trafficeditmap');
		mapEdit.mapRendered = true;
		this.setMarkersAndLines();
	},

	startTrafficMarkerDragEnd: function(latlon){
//console.log("startTrafficMarkerDragEnd: function(latlon){");
		var form = this.lookupReference('form').getForm();

		form.setValues({
			begin_lat: latlon.lat.toFixed(6),
			begin_lon: latlon.lng.toFixed(6),
		});
	},

	finishTrafficMarkerDragEnd: function(latlon){
//console.log(latlon);
//console.log("finishTrafficMarkerDragEnd: function(latlon){");
		var form = this.lookupReference('form').getForm();

		form.setValues({
			end_lat: latlon.lat.toFixed(6),
			end_lon: latlon.lng.toFixed(6),
		});
	},
	
	saveRecord: function (dialog) {
//console.log("saveRecord: function (dialog) {");
		dialog.updateRecord();

		var record = dialog.getRecord();
        	var store = record.store;

		if (store) {
			if (record.phantom) {
				store.add(record);
			}
			store.sync({
				failure: function (batch) {
					store.rejectChanges();
					Opt.app.showError("Ошибка", batch.exceptions[0].getError().response);
				},

				success: function (batch, options) {
					//console.log(batch);
				}
			});
		} else {
			record.save();
		}
	},

	onSaveClick: function (button) {
//console.log("onSaveClick: function (button) {");
		var self = this;
		var store, record;
		var form = button.up('window').down('form');
		var formValues = form.getValues();

		form.updateRecord();

		record = form.getRecord();
		record.set('points', Ext.pluck(this.pointsStore.data.items, 'data'));

		var formIsValid = true;

		if (formValues.name == '') {
			formIsValid = false;
		}

		if (formValues.speed == '') {
			formIsValid = false;
		}

		if (!formIsValid) {
			Ext.Msg.alert('Внимание', 'Не заполнены поля формы!');
			return;
		};

		var mapCmp = Ext.getCmp('trafficeditmap');

		if (!mapCmp.startTrafficMarker || !mapCmp.finishTrafficMarker) {
			formIsValid = false;
		}

		if (!formIsValid) {
			Ext.Msg.alert('Внимание', 'Участок дороги не выделен!');
			return;
		};
		
		this.saveRecord(form);
		button.up('window').close();
	},

	closeView: function (dialog) {
		this.getView().close();
	},

});