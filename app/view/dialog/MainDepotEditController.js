Ext.define('Opt.view.dialog.MainDepotEditController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.maindepotedit',
	changed: false,

	init: function () {
		var self = this;
		this.storeIn = Ext.create('Ext.data.Store', {
			model: 'Opt.model.Depot',
			proxy: {
				type: 'memory',
			},
		});

		this.storeOut = Ext.create('Ext.data.Store', {
			model: 'Opt.model.Depot',
			proxy: {
				type: 'memory',
			},
		});

		this.getView().down('depotgoodsgrid_in').setStore(this.storeIn);
		this.getView().down('depotgoodsgrid_out').setStore(this.storeOut);
	},

	onShow: function(){
		var self = this;
		var dialog = this.getView().down('form');
		var record = dialog.getRecord();

		var dataIn = record.get("goods_capacity_in");
		if (dataIn.length > 0) this.storeIn.loadData(dataIn);

		var dataOut = record.get("goods_capacity_out");
		if (dataOut.length > 0) this.storeOut.loadData(dataOut);
	},

	afterRender: function () {
		this.changed = false;
		if (this.getView().readOnly) {
			this.getView().down('form').getForm().getFields().each(function (field) {
				field.setReadOnly(true);
			});

			this.getView().down('toolbar').setDisabled(true);

			var saveButton = this.getView().lookupReference("saveButton");
			saveButton.hide();

			//this.getView().down('allowedautosgrid').getColumns()[0].setDisabled(true);
			this.getView().down('tabpanel').items.items[1].setDisabled(true);
		}
	},

	onSaveClick: function (button) {
		var dialog, store, record;
		dialog = button.up('window').down('form');
		dialog.updateRecord();

		record = dialog.getRecord();
		record.set('goods_capacity_in', Ext.pluck(this.storeIn.data.items, 'data'));
		record.set('goods_capacity_out', Ext.pluck(this.storeOut.data.items, 'data'));

		store = record.store;
		if (store) {
			if (record.phantom) {
				store.add(record);
				//store.addSorted(record);
			}

			store.sync({
				failure: function (batch) {
					store.rejectChanges();
					Opt.app.showError(batch.exceptions[0].getError().response);
				},
				success: function (batch, options) {
					//console.log(batch);
				}

			});

		} else {
			record.save();
		}
		this.getView().changed = this.changed;
		button.up('window').close();
	},

	closeView: function (dialog) {
		//var allowedAutosStore = this.getView().down('allowedautosgrid').store;
		//allowedAutosStore.rejectChanges();
		this.getView().close();
	},

	onTimeWindowBeginChange: function (field, newValue, oldValue, eOpts) {
		var seconds = hmsToSecondsOnly(newValue) * 60;
		var form = this.lookupReference('form').getForm();

		form.setValues({
			timewindow_begin: seconds
		});
	},

	onTimeWindowEndChange: function (field, newValue, oldValue, eOpts) {
		var seconds = hmsToSecondsOnly(newValue) * 60;
		var form = this.lookupReference('form').getForm();

		form.setValues({
			timewindow_end: seconds
		});
	},
});