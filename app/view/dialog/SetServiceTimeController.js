Ext.define('Opt.view.dialog.SetServiceTimeController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.setservicetime',

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
				var isDepot = record.get('isDepot');
				if (!isDepot){
					record.beginEdit();
					record.set('service_time', formValues.service_time);
					record.commit();
				}
			});
			store.sync();
			store.resumeEvents();

			if (grid.id = 'tab1routeleggrid') {
				Ext.getCmp('menutab1').controller.routePostProcess();
			}
			grid.view.refresh();
			button.up('window').close();
		}
	},
});