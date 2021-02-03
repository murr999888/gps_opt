Ext.define('Opt.view.dialog.AddServiceTimeController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.addservicetime',

	init: function () {

	},

	afterRender: function(){
		var f = this.lookupReference('form');
		if (f) {
			var form = f.getForm();
			var formValues = form.getValues();
			form.setValues({
				service_time: formValues.service_time_min * 60,
			});
		}
	},

	onServiceTimeMinChange: function (field, newValue, oldValue, eOpts) {
		var f = this.lookupReference('form');
		if (f) {
			var seconds = newValue * 60;
			var form = f.getForm();
			form.setValues({
				service_time: seconds
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
				var node_type = record.get('node_type');
				if (node_type != 0){
					var prev_time = record.get('service_time');
					//record.beginEdit();
					if ((formValues.service_time > 0) || (formValues.service_time < 0 && prev_time - formValues.service_time > 0)) {
						record.set('service_time',  parseInt(formValues.service_time) + prev_time);
					}
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