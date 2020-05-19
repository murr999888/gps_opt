Ext.define('Opt.view.tabs.resultViewer.DroppedGridController', {
	extend: 'Opt.view.DroppedGridController',
	alias: 'controller.resultviewerdroppedgrid',
	requires: [
		'Opt.ux.GridPrinter'
	],

	init: function () {
    		var columns = this.getView().getColumns();
        	Ext.each(columns, function(column) {
			if (column.xtype == 'actioncolumn' 
			|| column.dataIndex == 'num_in_routelist') {
				column.setHidden(true);
			}
		});
	},

	listen: {
		controller: {
			'*': {
				//resultviewermapRender : 'showDroppedOrdersOnMap',
			}
		}
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		if (Ext.getCmp('resultviewermap').clusterDroppedOrders) {
			Ext.getCmp('resultviewermap').setDroppedCenter(record.data.lon, record.data.lat);
		}
	},

	showDroppedOrdersOnMap: function () {
		var store = this.getView().store;
		if (store.count() > 0) {
			var geoJSON = Ext.getCmp('resultviewermap').constructOrdersGeoJSON(store);
			Ext.getCmp('resultviewermap').setDroppedOrdersOnMap(geoJSON);
		}
	},

	clearDroppedOrdersOnMap: function () {
		Ext.getCmp('resultviewermap').resetDroppedOrders();
	},

	openEditDialog: function (record, editable) {
		this.orderEdit = null;

		this.orderEdit = Ext.create('widget.orderedit');

		this.orderEdit.readOnly = true;
		this.orderEdit.down('form').loadRecord(record);

		var orderGoodsStore = this.orderEdit.down('ordergoodsgrid').store;
		orderGoodsStore.suspendEvents();
		orderGoodsStore.loadData(record.get("goods"));
		orderGoodsStore.sync();
		orderGoodsStore.resumeEvents();

		orderGoodsStore.filterBy(function (record) {
			if (record.get("kolvo") > 0) return true;
		});

		this.orderEdit.down('tabpanel').items.items[1].setDisabled(true);
		//this.orderEdit.down('allowedautosgrid').store.loadData(record.get("allowed_autos"));

		var form = this.orderEdit.down('form').getForm();
		form.setValues({
			service_time_min: Math.ceil(record.get("service_time") / 60),
		});

		this.orderEdit.show().focus();
	},

	onEditRecord: function (grid, rowIndex, colIndex, item, e, record) {
		this.openEditDialog(record);
	},
});