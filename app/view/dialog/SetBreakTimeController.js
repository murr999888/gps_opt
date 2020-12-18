Ext.define('Opt.view.dialog.SetBreakTimeController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.setbreaktime',

	init: function () {
	},

	onSaveClick: function (button) {
		var self = this;
		var store, record;
		var form = button.up('window').down('form');
		var formValues = form.getValues();
console.log(formValues);

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
				record.set('race_breaking_time', formValues.breaktime);
				record.save();
			});
			store.sync();
			store.resumeEvents();
			grid.view.refresh();
			button.up('window').close();
		}
	},
});