Ext.define('Opt.view.AllowedClientGroupsController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.allowedclientgroups',

	onChangeInUse: function (checkbox, rowIndex, checked, record, e, eOpts) {
		//record.commit();
	},

	onHeaderCheckChange: function (column, checked, e, eOpts) {
		//this.getView().store.commitChanges();
	},

	refreshClientGroups: function(){
		var store = this.getView().store;
		store.removeAll();
		var clientGroupsStore = Ext.getStore('ClientGroup');
		clientGroupsStore.each(function(record){
			var copyRecord = record.copy();
			if (copyRecord.get('id') != 0) {
				copyRecord.set('in_use', true);
				store.add(copyRecord);
			}
		});

		store.commitChanges();
	},
});