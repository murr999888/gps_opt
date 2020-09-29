Ext.define('Opt.view.TrafficGridController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.trafficgrid',

	requires: [
		'Opt.ux.GridPrinter',
	],

	init: function () {
		var self = this;
		this.getView().getSelectionModel().setSelectionMode('MULTI')

		var store = this.getView().store;
		store.sort('name', 'ASC');

		store.on('datachanged', function(){
			self.setGridTitle();
		});

		store.on('load', function(){
			self.setGridTitle();
		});
	},

	getIcon: function(val, metadata, record){
                var icon = record.get('icon');
		return '<img src="' + icon + '">';
/*
		var moveStatus = record.get('moveStatus');

                if (online) {
			if (moveStatus) {
				metadata.tdAttr = 'data-qtip="Едет"';
				return '<div class="fa fa-green-indicator fa-shadow fa-circle"></div>';
			} else {
				metadata.tdAttr = 'data-qtip="Стоит"';
				return '<div class="fa fa-yellow-indicator fa-shadow fa-circle"></div>';
			}
                } else {
			metadata.tdAttr = 'data-qtip="Нет связи"';
			return '<div class="fa fa-red-indicator fa-shadow fa-circle"></div>';
                }
*/

	} ,

	setGridTitle: function(){
		var store = this.getView().store;
		this.getView().setTitle("Список участков дорог (" + store.count() + ")");
	},

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},

	afterRender: function(){
		this.setGridTitle();
	},

	getServiceTime: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (val > 0) {
			return minToHHMM(val.toFixed());
		} else {
			return "";
		}
	},

	onChangeInUse: function (checkbox, rowIndex, checked, record, e, eOpts) {
		record.commit();
		record.save();
	},

	onHeaderCheckChange: function (column, checked, e, eOpts) {
		var store = this.getView().store;
		store.suspendEvents();
		store.save();
		store.resumeEvents();
		this.getView().view.refresh();
	},
});