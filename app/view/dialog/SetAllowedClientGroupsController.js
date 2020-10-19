Ext.define('Opt.view.dialog.SetAllowedClientGroupsController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.setallowedclientgroups',

	init: function () {
		var grid = this.getView().down('grid');
		grid.store.removeAll();
		var store = Ext.getStore('ClientGroup');
		store.each(function (record) {
			if (record.get('id') != 0) {
				var newRecord = record.copy();
				newRecord.beginEdit();
				newRecord.set('in_use', true);
				newRecord.commit();
				grid.store.add(newRecord);
			}
		});
	},

	onSaveClick: function (button) {
		var self = this;
		var grid = this.getView().parentGrid;
		var selection = grid.getSelection();
		var store = grid.store;

		var allowedGroupsStore = this.getView().down('grid').store;

		var arrSetGroups = [];

		allowedGroupsStore.each(function (record) {
			var recordCopy = record.copy();
			arrSetGroups.push(recordCopy);
		});

		var setValues = Ext.Array.pluck(arrSetGroups, 'data');

		store.suspendEvents();
		selection.forEach(function (record) {
			record.set('allowed_clientgroups', setValues);
		});

		store.sync();
		store.resumeEvents();
			
		grid.view.refresh();
		button.up('window').close();
	},

	closeView: function () {
		this.getView().destroy();
	},

	onChangeInUse: function (checkbox, rowIndex, checked, record, e, eOpts) {
		record.commit();
	},

	onHeaderCheckChange: function (column, checked, e, eOpts) {
console.log("onHeaderCheckChange");
		var store = this.getView().down('grid').store;
		store.commitChanges();
	},
});