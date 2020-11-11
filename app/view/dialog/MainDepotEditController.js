Ext.define('Opt.view.dialog.MainDepotEditController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.maindepotedit',
	orderGoodsStore: null,
	orderAllowedAutosStore: null,
	changed: false,

	init: function () {
/*
		this.orderGoodsStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.OrderGood',
			proxy: {
				type: 'memory',
			},
		});

		Ext.getCmp('ordereditgoods').setStore(this.orderGoodsStore);
*/

/*
		this.orderAllowedAutosStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.AllowedAuto',
			proxy: {
				type: 'memory',
			},
		});

		Ext.getCmp('maindepoteditallowedautos').setStore(this.orderAllowedAutosStore);
*/
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
		//record.set('allowed_autos', Ext.pluck(this.orderAllowedAutosStore.data.items, 'data'));
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