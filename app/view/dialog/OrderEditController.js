Ext.define('Opt.view.dialog.OrderEditController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.orderedit',
	orderUnloadingGoodsStore: null,
	orderLoadingGoodsStore: null,
	orderAllowedAutosStore: null,
	changed: false,

	init: function () {
		this.orderUnloadingGoodsStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.OrderGood',
			proxy: {
				type: 'memory',
			},
		});

		Ext.getCmp('ordereditunloadinggoods').setStore(this.orderUnloadingGoodsStore);

		this.orderLoadingGoodsStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.OrderGood',
			proxy: {
				type: 'memory',
			},
		});

		Ext.getCmp('ordereditloadinggoods').setStore(this.orderLoadingGoodsStore);

		this.orderAllowedAutosStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.AllowedAuto',
			proxy: {
				type: 'memory',
			},
		});

		Ext.getCmp('ordereditallowedautos').setStore(this.orderAllowedAutosStore);
	},

	onShow: function(){
		var unloadingGoodsGrid = this.getView().down('orderunloadinggoodsgrid');
		unloadingGoodsGrid.view.scrollTo(0,0);

		var loadingGoodsGrid = this.getView().down('orderloadinggoodsgrid');
		loadingGoodsGrid.view.scrollTo(0,0);
	},

	afterRender: function () {
		this.changed = false;

		if (this.getView().readOnly) {
			this.getView().down('form').getForm().getFields().each(function (field) {
				field.setReadOnly(true);
			});

			this.getView().down('toolbar').setDisabled(true);

			var saveButton = this.getView().lookupReference("saveButton");
			saveButton.hide();

			//this.getView().down('allowedautosgrid').getColumns()[0].setDisabled(true);
			this.getView().down('tabpanel').items.items[1].setDisabled(true);
		}
	},

	onPenaltyChange: function (field, newValue, oldValue, eOpts) {
		if (oldValue) this.changed = true;
	},

	onServiceTimeMinChange: function (field, newValue, oldValue, eOpts) {
		var seconds = newValue * 60;
		var form = this.lookupReference('form').getForm();
		form.setValues({
			service_time: seconds
		});

		if (oldValue) this.changed = true;
	},

	onSaveClick: function (button) {
		var dialog, store, record;
		dialog = button.up('window').down('form');
		dialog.updateRecord();

		record = dialog.getRecord();

		record.set('unloading_goods', Ext.pluck(this.orderUnloadingGoodsStore.data.items, 'data'));
		record.set('loading_goods', Ext.pluck(this.orderLoadingGoodsStore.data.items, 'data'));

		record.set('allowed_autos', Ext.pluck(this.orderAllowedAutosStore.data.items, 'data'));
		store = record.store;
		if (store) {
			if (record.phantom) {
				store.add(record);
				//store.addSorted(record);
			}

			store.sync({
				failure: function (batch) {
					store.rejectChanges();
					Opt.app.showError(batch.exceptions[0].getError().response);
				},
				success: function (batch, options) {
					//console.log(batch);
				}

			});

		} else {
			record.save();
		}
		this.getView().changed = this.changed;
		button.up('window').close();
	},

	closeView: function (dialog) {
		var allowedAutosStore = this.getView().down('allowedautosgrid').store;
		allowedAutosStore.rejectChanges();
		this.getView().close();
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
});