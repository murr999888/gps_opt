Ext.define('Opt.view.dialog.SetMaxRacesController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.setmaxraces',

	init: function () {
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
			var store = grid.getStore();
			store.suspendEvents();
			selection.forEach(function (record) {
				record.set('maxraces', formValues.maxraces);
				record.save();
			});
			store.sync();
			store.resumeEvents();
			grid.view.refresh();
			button.up('window').close();
		}
	},
});