Ext.define('Opt.view.dialog.SetPenaltyController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.setpenalty',
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
			var store = grid.store;
			store.suspendEvents();
			selection.forEach(function (record) {
				var node_type = record.get('node_type');
				if (node_type != 0){
					record.beginEdit();
					record.set('penalty', formValues.penalty);
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