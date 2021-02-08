Ext.define('Opt.view.dialog.SetDeliveryGroupController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.setdeliverygroup',
	init: function () {
	},

	onShow: function(){
		var form = this.lookupReference('form').getForm(); 
		form.setValues({
			delivery_group_id: '00000000-0000-0000-0000-000000000000',
		});
	},

	onDeliveryGroupsSelect: function (combo, record, eOpts) {
		var form = this.lookupReference('form').getForm();
		if (record.get('id') != '00000000-0000-0000-0000-000000000000') {
			form.setValues({
				delivery_group_name: record.get('displayField'),
			});
		} else {
               		form.setValues({
				delivery_group_name: '',
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
					record.beginEdit();
					record.set('delivery_group_id', formValues.delivery_group_id);
					record.set('delivery_group_name', formValues.delivery_group_name);
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