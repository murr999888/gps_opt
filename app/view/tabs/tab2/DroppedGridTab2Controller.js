Ext.define('Opt.view.tabs.tab2.DroppedGridTab2Controller', {
	extend: 'Opt.view.DroppedGridController',
	alias: 'controller.tab2droppedgrid',
	requires: [
		'Opt.ux.GridPrinter',
		'Opt.view.dialog.OrderEdit',
	],

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
			self.setGetGoodsButton();
		});

		droppedGoodsStore.on('remove', function(){
			self.setGetGoodsButton();
		});
	},

	setGetGoodsButton: function(){
		var droppedGoodsStore = Ext.getStore('DroppedGoodsStore');
		if (droppedGoodsStore.count() > 0) {
			Ext.getCmp('tab2getDroppedGoodsButton').setDisabled(false);
		} else {
			Ext.getCmp('tab2getDroppedGoodsButton').setDisabled(true);		
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

		var orderGoodStore = this.orderEdit.down('ordergoodsgrid').store;
		orderGoodStore.loadData(record.get("goods"));
		orderGoodStore.sync();

		orderGoodStore.filterBy(function (record) {
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

		autosStore.each(function (record) {
			var newRecord = record.copy();
			newRecord.beginEdit();
			newRecord.set('in_use', false);
			newRecord.commit();
			autoGrid.store.add(newRecord);
		});
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
		var str = 'data-qtip="';
		var sod = Ext.util.Format.htmlEncode(record.get('sod'));
		var dop = Ext.util.Format.htmlEncode(record.get('dop'));

		if (sod != '' && dop != '') {
			str = str + sod + '<br />' + dop;
		} else {
			str = str + sod + dop;
		}

		metadata.tdAttr = str + '"';
		return val;
	},

   	getGoods: function(){
		var title = 'Отгрузка по отброшенным заказам.';
		this.editDialog = null;
		this.editDialog = Ext.create('Opt.view.dialog.GoodsEdit', { title: title});
		var goodsGrid = this.editDialog.down('ordergoodsgrid');
		goodsGrid.setStore(Ext.getStore('DroppedGoodsStore'));
		this.editDialog.show();
		this.editDialog.focus();
	},
});