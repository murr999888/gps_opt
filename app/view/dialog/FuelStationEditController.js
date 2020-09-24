Ext.define('Opt.view.dialog.FuelStationEditController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.fuelstationedit',

	init: function () {
	},

	closeView: function (dialog) {
		this.getView().close();
	},
	
	saveRecord: function (dialog) {
		dialog.updateRecord();

		record = dialog.getRecord();
		store = record.store;

		if (store) {
			if (record.phantom) {
				store.add(record);
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
	},

	onSaveClick: function (button) {
		var self = this;
		var store, record;
		var form = button.up('window').down('form');
		var formValues = form.getValues();

		this.saveRecord(form);
		button.up('window').close();
	},
});