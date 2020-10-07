Ext.define('Opt.view.dialog.TrafficEdit.TrafficEditMapController', {
	extend: 'Opt.view.tabs.BaseMapController',
	alias: 'controller.trafficeditmapcontroller',

	afterRender: function () {
		this.getView().doResize();
	},

	onMapClick: function(e) {
		this.getView().setTrafficMarker(e.latlng);
	},

	onMapZoomLevelsChange: function (type, target) {
		this.getView().setTrafficArrows();
	},

	onMapRender: function(){
		this.getView().setCursor();
		this.fireEvent("TrafficMapRendered");
	},

	onStartTrafficMarkerDragEnd: function(latlng){
		this.fireEvent('startTrafficMarkerDragEnd', latlng);
	},

	onStartTrafficMarkerSetPos: function(latlng){
		this.fireEvent('startTrafficMarkerSetPos', latlng);
	},

	onDeleteStartTrafficMarker: function(){
		this.fireEvent('deleteStartTrafficMarker');
	},

	onFinishTrafficMarkerDragEnd: function(latlng){
		this.fireEvent('finishTrafficMarkerDragEnd', latlng);
	},

	onDeleteFinishTrafficMarker: function(){
		this.fireEvent('deleteFinishTrafficMarker');
	},

	onFinishTrafficMarkerSetPos: function(latlng){
		this.fireEvent('finishTrafficMarkerSetPos', latlng);
	},

	onTrafficPointsRecieved: function(pointsArray){
		this.fireEvent('trafficPointsRecieved', pointsArray);	
	},

	onTrafficWayPointsRecieved: function(wayPointsArray){
		this.fireEvent('trafficWayPointsRecieved', wayPointsArray);	
	},

	onTrafficGeometryRecieved: function(lineCoordArray){
		this.fireEvent('trafficGeometryRecieved', lineCoordArray);	
	},

	onTrafficDistanceRecieved: function(distance){
		this.fireEvent('trafficDistanceRecieved', distance);	
	},

});


