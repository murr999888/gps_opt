Ext.define('Opt.view.dialog.SetTimeController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.settime',

	init: function () {

	},

	afterRender: function () {
		var field = this.getView().down('timepickerui');
		field.setFieldLabel(this.getView().text);
	},

	onTimeChange: function (field, newValue, oldValue, eOpts) {
		if (oldValue) {
			var form = this.getView().lookupReference('form').getForm();
			var seconds = hmsToSecondsOnly(newValue);

			form.setValues({
				time: seconds
			});
		}
	},

	onSaveClick: function (button) {
		var self = this;
		var store, record;
		var form = button.up('window').down('form');
		var formValues = form.getValues();

		var formValid = true;
		if (!formValid) {
			Ext.Msg.alert('Внимание', 'Установлено неверное значение!', function () {
				return;
			});
		} else {

			var grid = this.getView().parentGrid;
			var selection = grid.getSelection();
			var store = grid.store;
			store.suspendEvents();
			selection.forEach(function (record) {
				var isDepot = record.get('isDepot');
				if (!isDepot){
					record.beginEdit();
					record.set(setField, formValues.time);
					record.commit();
				}
			});
			store.sync();
			store.resumeEvents();
			grid.view.refresh();
			button.up('window').close();
		}
	},
});