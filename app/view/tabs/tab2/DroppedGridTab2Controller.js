Ext.define('Opt.view.tabs.tab2.DroppedGridTab2Controller', {
	extend: 'Opt.view.DroppedGridController',
	alias: 'controller.tab2droppedgrid',
	requires: [
		'Opt.ux.GridPrinter',
		'Opt.view.dialog.OrderEdit',
	],

	listen: {
		controller: {
			'*': {
				tab2droppedgridsettitle: 'setTitle',
			}
		}
	},

	setTitle: function (filterString) {
		if (!filterString) filterString = '';
		var store = this.getView().getStore();
		if (!store) {
			this.getView().setTitle('Отброшенные заказы');
			return;
		}
		this.getView().setTitle('Отброшенные заказы ' + '(' + store.count() + ') ' + filterString);
	},

	init: function () {
		var self = this;
		this.getView().getSelectionModel().setSelectionMode('MULTI');
    		var columns = this.getView().getColumns();
        	Ext.each(columns, function(column) {
			if (column.xtype == 'actioncolumn' 
			|| column.dataIndex == 'num_in_routelist') {
				column.setHidden(true);
			}
		});

	        var droppedGoodsStore = Ext.getStore('DroppedGoodsStore');
		droppedGoodsStore.on('load', function(){
			self.setUnloadingGoodsButton();
			self.setLoadingGoodsButton();
		});

		droppedGoodsStore.on('remove', function(){
			self.setUnloadingGoodsButton();
			self.setLoadingGoodsButton();
		});
	},

	setUnloadingGoodsButton: function(){
		var droppedGoodsStore = Ext.getStore('DroppedGoodsStore');
		if (droppedGoodsStore.count() > 0) {
			Ext.getCmp('tab2DroppedUnloadingGoodsButton').setDisabled(false);
		} else {
			Ext.getCmp('tab2DroppedUnloadingGoodsButton').setDisabled(true);		
		}
	},

	setLoadingGoodsButton: function(){
		var droppedGoodsStore = Ext.getStore('DroppedGoodsStore');
		if (droppedGoodsStore.count() > 0) {
			Ext.getCmp('tab2DroppedLoadingGoodsButton').setDisabled(false);
		} else {
			Ext.getCmp('tab2DroppedLoadingGoodsButton').setDisabled(true);		
		}
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		var orderId = record.get("order_id");
		var orderGrid = Ext.getCmp("tab2ordersgrid");
		var orderIndex = orderGrid.store.find("order_id", orderId);
		var orderRecord = orderGrid.store.getAt(orderIndex);
		this.openEditDialog(orderRecord, false);
	},

	openEditDialog: function (record) {

		var self = this;
		if (!this.orderEdit) this.orderEdit = Ext.create('widget.orderedit', { stateId: 'tab2deroppedOrderEdit'});
		this.orderEdit.down('form').loadRecord(record);

		var orderUnloadingGoodStore = this.orderEdit.down('orderunloadinggoodsgrid').store;
		orderUnloadingGoodStore.loadData(record.get("unloading_goods"));
		orderUnloadingGoodStore.sync();

		orderUnloadingGoodStore.filterBy(function (record) {
			if (record.get("kolvo") > 0) return true;
		});

		var orderLoadingGoodStore = this.orderEdit.down('orderloadinggoodsgrid').store;
		orderLoadingGoodStore.loadData(record.get("unloading_goods"));
		orderLoadingGoodStore.sync();

		orderLoadingGoodStore.filterBy(function (record) {
			if (record.get("kolvo") > 0) return true;
		});

		var allowedAutoStore = this.orderEdit.down('allowedautosgrid').store;
		allowedAutoStore.loadData(record.get("allowed_autos"));
		allowedAutoStore.sync();

		var form = this.orderEdit.down('form').getForm();
		form.setValues({
			service_time_min: Math.ceil(record.get("service_time") / 60),
		});

		this.orderEdit.on('close', function (panel) {
			self.onCloseEditOrderDialog(panel);
		});

		this.orderEdit.show().focus();
	},

	setPenalty: function () {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		var secGrid = Ext.getCmp('tab2ordersgrid');
		this.msgbox = null;
		this.msgbox = Ext.create('widget.setpenalty', { parentGrid: grid});
		this.msgbox.show();
	},

	setService: function () {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		this.msgbox = null;
		this.msgbox = Ext.create('widget.setservicetime', { parentGrid: grid});
		this.msgbox.show();
	},

	setAutos: function () {
		var selection = this.getView().getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		var autosStore = Ext.getStore('Auto2');
		var parent = this.getView();

		var secGrid = Ext.getCmp('tab2ordersgrid');
		this.editDialog = null;
		this.editDialog = Ext.create('Opt.view.dialog.AddAllowedAuto', { mode: 'list_order', tab: selection, secondaryGrid: secGrid });
		var autoGrid = this.editDialog.down('grid');
		this.editDialog.show();
	},

	removeAutos: function () {
		var self = this;
		var selection = this.getView().getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		Ext.Msg.show({
			title: 'Внимание',
			message: 'Список допустимых машин для выделенных заказов будет очищен. Продолжить?',
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION,
			fn: function (btn) {
				if (btn === 'yes') {
					self.deleteAllowedAutos();
				} else if (btn === 'no') {
					return;
				}
			}
		});
	},

	deleteAllowedAutos: function () {
		var selection = this.getView().getSelection();
		selection.forEach(function (record) {
			record.set('allowed_autos', []);
		});
	},

	getSod: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var ww = val;

		if (record.get('delivery_group_id') != '00000000-0000-0000-0000-000000000000'){
			ww = ww + '<br /><b>' + record.get('delivery_group_name') + '</b>';
		}

		var str = 'data-qtip="';
		var sod = Ext.util.Format.htmlEncode(record.get('sod'));
		var dop = Ext.util.Format.htmlEncode(record.get('dop'));

		if (sod != '' && dop != '') {
			str = str + sod + '<br />' + dop;
		} else {
			str = str + sod + dop;
		}

		metadata.tdAttr = str + '"';
		return ww;
	},

   	getUnloadingGoods: function(){
		var title = 'Отгрузка по отброшенным заказам.';
		this.editDialog = null;
		this.editDialog = Ext.create('Opt.view.dialog.GoodsEdit', { title: title});
		var unloadingGoodsGrid = this.editDialog.down('ordergoodsgrid');
		unloadingGoodsGrid.setStore(Ext.getStore('DroppedGoodsStore'));
		this.editDialog.show();
		this.editDialog.focus();
	},
});