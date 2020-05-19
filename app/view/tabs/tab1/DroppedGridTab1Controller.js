Ext.define('Opt.view.tabs.tab1.DroppedGridTab1Controller', {
	extend: 'Opt.view.DroppedGridController',
	alias: 'controller.tab1droppedgrid',

	requires: [
		'Opt.view.DroppedGridController',
	],

	init: function () {
		this.getView().getSelectionModel().setSelectionMode('MULTI');
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		Ext.getCmp('maptab1').setCenter(record.data.lon, record.data.lat);
	},

	openEditDialog: function (record) {
		var self = this;
		Ext.suspendLayouts();

		this.orderEdit = null;

		this.orderEdit = Ext.create('widget.orderedit', { stateId: 'tab1orderEdit', });
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

		var allowedAutosStore = this.orderEdit.down('allowedautosgrid').store;
		
		allowedAutosStore.suspendEvents();
		allowedAutosStore.loadData(record.get("allowed_autos"));
		allowedAutosStore.sync();
		allowedAutosStore.resumeEvents();

		var form = this.orderEdit.down('form').getForm();
		form.setValues({
			service_time_min: Math.ceil(record.get("service_time") / 60),
		});

		this.orderEdit.on('close', function (panel) {
			self.onCloseEditOrderDialog(panel);
		});

		Ext.resumeLayouts();
		this.orderEdit.show().focus();
	},

	setPenalty: function () {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}

		this.msgbox = null;
		this.msgbox = Ext.create('widget.setpenalty', { parentGrid: grid});
		this.msgbox.show();
	},

	setService: function () {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}

		this.msgbox = null;
		this.msgbox = Ext.create('widget.setservicetime', { parentGrid: grid});
		this.msgbox.show();
	},

});