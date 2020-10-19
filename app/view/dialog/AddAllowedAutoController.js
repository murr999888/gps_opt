Ext.define('Opt.view.dialog.AddAllowedAutoController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.addallowedauto',

	init: function () {
		var self = this;
		var store = Ext.create('Ext.data.Store', {
			model: 'Opt.model.Auto',
			proxy: {
				type: 'memory',
			},
		});

		store.sort('name', 'ASC');
		this.getView().down('gridpanel').setStore(store);
	},

	afterRender: function(){
		var autoGrid = this.getView().down('gridpanel');
		var autosStore = Ext.getStore('Auto2');
		autosStore.each(function (record) {
			if (record.get('in_use')) {
				var newRecord = record.copy();
				newRecord.beginEdit();
				newRecord.set('in_use', false);
				newRecord.commit();
				autoGrid.store.add(newRecord);
			}
		});

	},

	onSaveClick: function (button) {
		var mode = this.getView().mode;
		var store = this.getView().down('gridpanel').store;

		if (mode == 'single_order') {
			var parentStore = this.getView().tab.store;
			store.each(function (record) {
				if (record.get('in_use')) {
					var recordCopy = record.copy();
					parentStore.add(recordCopy);
				}
			});
		} else if (mode == 'list_order') {
			var arrSetAutos = [];

			store.each(function (record) {
				if (record.get('in_use')) {
					var recordCopy = record.copy();
					arrSetAutos.push(recordCopy);
				}
			});

			var selection = this.getView().tab;
			var setValues = Ext.Array.pluck(arrSetAutos, 'data');
			selection.forEach(function (record) {
				record.set('allowed_autos', setValues);
			});
		}
		this.getView().destroy();
	},

	closeView: function () {
		this.getView().destroy();
	},

	onChangeInUse: function (checkbox, rowIndex, checked, record, e, eOpts) {
		record.commit();
	},

	onHeaderCheckChange: function (column, checked, e, eOpts) {
		var store = this.getView().down('grid').store;
		store.commitChanges();
	},
});