Ext.define('Opt.view.dialog.RouteListEditController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.routelistedit',

	onDriverSelect: function (combo, record, eOpts) {
		var form = this.lookupReference('form').getForm();
		form.setValues({
			driver_name: record.get('name'),
		});
	},

	refreshDriver: function () {
		Ext.getStore('Drivers').reload();
	},

	onSaveClick: function (button) {
		var dialog, store, record;
		dialog = button.up('window').down('form');
		formValues = dialog.getValues();

		dialog.updateRecord();
		record = dialog.getRecord();

		record.set('driver_id', formValues.driver_id);
		record.set('driver_name', formValues.driver_name);

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

});
