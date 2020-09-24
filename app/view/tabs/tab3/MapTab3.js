Ext.define('Opt.view.tabs.tab3.MapTab3', {
	extend: 'Opt.view.tabs.BaseMap',
	alias: 'widget.tab3map',
	requires: [
		'Opt.view.tabs.BaseMap',
		'Opt.view.tabs.tab3.MapTab3Controller',
	],

	controller: 'tab3mapcontroller',
	bodyStyle: 'border-top: 1px solid #99bce8',

	listeners: {
		maprender: 'onMapRender',
		mapClick: 'onMapClick',
		mapDblClick: 'onMapDblClick',
		zoomend: 'onMapZoomLevelsChange',
	},

	trafficLineGroupFitBounds: function(){
		if(this.trafficLineGroup != null) {
			this.map.fitBounds(this.trafficLineGroup.getBounds());
		}
	},

	getTrafficLineOnMap: function(lineId){
		var self = this;
		if (this.trafficLineGroup != null) {
			var trafficLine = null;

			this.trafficLineGroup.eachLayer(function(layer){
				if (layer.trafficId && layer.trafficId == lineId){
					trafficLine = layer;
					self.map.fitBounds(trafficLine.getBounds());
				}
			});
		}
	},
});