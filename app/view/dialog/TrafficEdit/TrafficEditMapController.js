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
		this.fireEvent("TrafficMapRendered");
	},

	onStartTrafficMarkerDragEnd: function(latlng){
		this.fireEvent('startTrafficMarkerDragEnd', latlng);
	},

	onStartTrafficMarkerSetPos: function(latlng){
		this.fireEvent('startTrafficMarkerSetPos', latlng);
	},

	onDeleteStartTrafficMarker(){
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

	onTrafficPointsRecieved(pointsArray){
		this.fireEvent('trafficPointsRecieved', pointsArray);	
	},

	onTrafficWayPointsRecieved(wayPointsArray){
		this.fireEvent('trafficWayPointsRecieved', wayPointsArray);	
	},

	onTrafficGeometryRecieved(lineCoordArray){
		this.fireEvent('trafficGeometryRecieved', lineCoordArray);	
	},
});


