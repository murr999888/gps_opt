Ext.define('Opt.view.tabs.tab1.DroppedGridTab1Controller', {
	extend: 'Opt.view.DroppedGridController',
	alias: 'controller.tab1droppedgrid',

	requires: [
		'Opt.view.DroppedGridController',
	],

	listen: {
		controller: {
			'*': {

				tab1_set_dropped_title: 'setGridTitle',
			}
		}
	},

	init: function () {
		this.getView().getSelectionModel().setSelectionMode('MULTI');
	},

	setGridTitle: function(){
        	var store = this.getView().store;
		if (store.count() > 0){
			this.getView().setTitle('Отброшенные заказы (' + store.count() + ')');
		} else {
                	this.getView().setTitle('Отброшенные заказы');
		}
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		Ext.getCmp('maptab1').setCenter(record.data.lon, record.data.lat);
	},

	openEditDialog: function (record) {
		var self = this;
		Ext.suspendLayouts();

		if (!this.orderEdit || this.orderEdit.destroyed) this.orderEdit = Ext.create('widget.orderedit', { stateId: 'tab1orderEdit', });
		this.orderEdit.down('form').loadRecord(record);

		var orderUnloadingGoodsStore = this.orderEdit.down('orderunloadinggoodsgrid').store;

		orderUnloadingGoodsStore.suspendEvents();
		orderUnloadingGoodsStore.loadData(record.get("unloading_goods"));
		orderUnloadingGoodsStore.sync();
		orderUnloadingGoodsStore.resumeEvents();

		orderUnloadingGoodsStore.filterBy(function (record) {
			if (record.get("kolvo") > 0) return true;
		});

		var orderLoadingGoodsStore = this.orderEdit.down('orderloadinggoodsgrid').store;

		orderLoadingGoodsStore.suspendEvents();
		orderLoadingGoodsStore.loadData(record.get("loading_goods"));
		orderLoadingGoodsStore.sync();
		orderLoadingGoodsStore.resumeEvents();

		orderLoadingGoodsStore.filterBy(function (record) {
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

		if (!this.setPenaltyDialog || this.setPenaltyDialog.destroyed) this.setPenaltyDialog = Ext.create('widget.setpenalty', { parentGrid: grid});
		this.setPenaltyDialog.show();
	},

	setService: function () {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}

		if (!this.setServiceTimeDialog || this.setServiceTimeDialog.destroyed) this.setServiceTimeDialog = Ext.create('widget.setservicetime', { parentGrid: grid});
		this.setServiceTimeDialog.show();
	},
});