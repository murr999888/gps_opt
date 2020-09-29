Ext.define('Opt.view.dialog.OrderListAlertController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.orderlistalert',

	requires: [
		'Opt.view.dialog.OrderEdit',
	],

	init: function () {
		var self = this;
		var store = Ext.create('Ext.data.Store', {
			model: 'Opt.model.RouteLegs',
			proxy: {
				type: 'memory',
			},
		});

		this.getView().down('gridpanel').setStore(store);
		this.getView().down('gridpanel').getSelectionModel().setSelectionMode('MULTI')
	},

	continueWithDroppedOrders: function () {
		var store = this.getView().down('gridpanel').store;
		store.each(function (record) {
			var in_use = record.get('in_use');
			if (in_use) {
				record.set('in_use', false);
				record.commit();
			}
		});

		Ext.getCmp('orderstab2').controller.checkDataBeforeSend();
		this.getView().destroy();
	},

	onOKClick: function () {
		var self = this;
		this.getView().destroy();
		Ext.getCmp('orderstab2').controller.checkDataBeforeSend();
	},

	onCancelClick: function () {
		this.getView().destroy();
	},

	getSod: function (val, metadata, record) {
		return val;
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

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		if (record.get("node_type") != 0) this.openEditDialog(record, false);
	},

	getServiceTime: function (val, metadata, record) {
		if (val > 0) {
			return minToHHMM(val.toFixed());
		} else {
			return "";
		}
	},

	getWaitingTime: function (val, metadata, record) {
		if (val > 0) {
			return secToHHMMSS(val.toFixed());
		} else {
			return "";
		}
	},

	openEditDialog: function (record, editable) {
		this.orderEdit = null;
		Ext.suspendLayouts();

		this.orderEdit = Ext.create('widget.orderedit', { stateId: 'routeOrderEdit' });
		this.orderEdit.readOnly = editable;

		this.orderEdit.down('form').loadRecord(record);

		this.orderEdit.down('ordergoodsgrid').store.suspendEvents();
		this.orderEdit.down('ordergoodsgrid').store.loadData(record.get("goods"));
		this.orderEdit.down('ordergoodsgrid').store.resumeEvents();

		this.orderEdit.down('ordergoodsgrid').store.filterBy(function (record) {
			if (record.get("kolvo") > 0) return true;
		});

		this.orderEdit.down('allowedautosgrid').store.suspendEvents();
		this.orderEdit.down('allowedautosgrid').store.loadData(record.get("allowed_autos"));
		this.orderEdit.down('allowedautosgrid').store.resumeEvents();

		var form = this.orderEdit.down('form').getForm();
		form.setValues({
			service_time_min: Math.ceil(record.get("service_time") / 60),
		});

		Ext.resumeLayouts();
		this.orderEdit.show().focus();
	},

	onEditRecord: function (grid, rowIndex, colIndex, item, e, record) {
		this.openEditDialog(record);
	},

	onChangeInUse: function (checkbox, rowIndex, checked, record, e, eOpts) {
		record.commit();
	},

	onHeaderCheckChange: function (column, checked, e, eOpts) {
		var store = this.getView().down('gridpanel').store;
		store.suspendEvents();
		store.commitChanges();
		store.resumeEvents();
		this.getView().down('gridpanel').view.refresh();
	},

	setAutos: function () {
		var selection = this.getView().down('gridpanel').getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		var editDialog = Ext.create('Opt.view.dialog.AddAllowedAuto', { mode: 'list_order', tab: selection });
		editDialog.show();
	},

	removeAutos: function () {
		var self = this;
		var selection = this.getView().down('gridpanel').getSelection();
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
		var selection = this.getView().down('gridpanel').getSelection();
		selection.forEach(function (record) {
			record.set('allowed_autos', []);
		});
	},
});
