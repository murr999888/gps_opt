Ext.define('Opt.view.dialog.DepotEditController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.depotedit',
	orderGoodsStore: null,
	orderAllowedAutosStore: null,
	changed: false,

	init: function () {
		var self = this;
		this.storeIn = Ext.create('Ext.data.Store', {
			model: 'Opt.model.DepotGood',
			proxy: {
				type: 'memory',
			},
		});

		this.storeOut = Ext.create('Ext.data.Store', {
			model: 'Opt.model.DepotGood',
			proxy: {
				type: 'memory',
			},
		});

		this.getView().down('depotgoodsgrid_in').setStore(this.storeIn);
		this.getView().down('depotgoodsgrid_out').setStore(this.storeOut);
	},

	onShow: function(){
		var self = this;
		var dialog = this.getView().down('form');
		var record = dialog.getRecord();

		var dataIn = record.get("depot_goods_capacity_in");
		if (dataIn && dataIn.length > 0) this.storeIn.loadData(dataIn);

		var dataOut = record.get("depot_goods_capacity_out");
		if (dataOut && dataOut.length > 0) this.storeOut.loadData(dataOut);
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

		var form = this.lookupReference('form').getForm();
		var values = form.getValues();

		record = dialog.getRecord();

		var timewindow_string = '';
		if (values.timewindow_begin == 8*60*60 && values.timewindow_end == 20*60*60){
			timewindow_string = 'т/д';
		} else {
			timewindow_string = values.timewindow_begin_1 + ' - ' + values.timewindow_end_1;
		}

		record.set('timewindow_string', timewindow_string);
		record.set('depot_goods_capacity_in', Ext.pluck(this.storeIn.data.items, 'data'));
		record.set('depot_goods_capacity_out', Ext.pluck(this.storeOut.data.items, 'data'));

		//record.set('allowed_autos', Ext.pluck(this.orderAllowedAutosStore.data.items, 'data'));
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
		//var allowedAutosStore = this.getView().down('allowedautosgrid').store;
		//allowedAutosStore.rejectChanges();
		this.getView().close();
	},

	onWorktimeBeginChange: function (field, newValue, oldValue, eOpts) {
		var seconds = hmsToSecondsOnly(newValue) * 60;
		var form = this.lookupReference('form').getForm();

		form.setValues({
			timewindow_begin: seconds
		});
	},

	onWorktimeEndChange: function (field, newValue, oldValue, eOpts) {
		var seconds = hmsToSecondsOnly(newValue) * 60;
		var form = this.lookupReference('form').getForm();

		form.setValues({
			timewindow_end: seconds
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
});