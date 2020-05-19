Ext.define('Opt.view.AllowedAutosGridController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.allowedautosgrid',

	init: function () {
		var store = Ext.create('Ext.data.Store', {
			model: 'Opt.model.AllowedAuto',
			proxy: {
				type: 'memory',
			},
		});

		this.getView().setStore(store);
		this.getView().getSelectionModel().setSelectionMode('MULTI')
	},

	onChangeInUse: function (checkbox, rowIndex, checked, record, e, eOpts) {
		//record.commit();
	},

	onHeaderCheckChange: function (column, checked, e, eOpts) {
		//this.getView().store.commitChanges();
	},

	addAuto: function (button) {
		var parent = button.up('grid');
		this.editDialog = null;
		this.editDialog = Ext.create('Opt.view.dialog.AddAllowedAuto', { mode: 'single_order', tab: parent });
		this.editDialog.show();
	},

	deleteAuto: function () {
		var grid = this.getView();
		var store = grid.store;
		var selection = grid.getSelection();

		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для удаления!');
			return;
		}

		store.suspendEvents();

		for (var i = 0; i < selection.length; i++) {
			var record = selection[i];
			store.remove(record);
		}

		store.resumeEvents();
		store.sync();
		grid.view.refresh();
	},
});