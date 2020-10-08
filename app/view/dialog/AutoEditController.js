Ext.define('Opt.view.dialog.AutoEditController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.autoedit',

	init: function () {
		var allowedGroupsStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.ClientGroup',
			proxy: {
				type: 'memory',
			},
		});

		this.getView().down('allowedclientgroups').setStore(allowedGroupsStore);

		this.refreshFuelStationStore();
	},
	
	afterRender: function () {
		this.rendered = true;
	},

	refreshFuelStationStore: function(){
		this.newFuelStationStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.FuelStation',
			proxy: {
				type: 'memory',
			},
		});

		var emptyRecord = Ext.create('Opt.model.FuelStation', {
			klient_id: '0',
			in_use: true,
			klient_name: '<не установлено>',
		});

		this.newFuelStationStore.add(emptyRecord);
	
		var fuelStationsStore = Ext.getStore('FuelStations');
		this.newFuelStationStore.add(fuelStationsStore.getRange());

		this.setFuelStationsFilters();

		Ext.getCmp('autoEditFirstStation').setStore(this.newFuelStationStore);
	},

	onChangeFuelGas: function (checkbox, newValue, oldValue, eOpts) {
		this.setFuelStationsFilters();
	},

	setFuelStationsFilters: function(){
		this.clearFuelStationsFilters();

		var setGas = Ext.getCmp('autoEditFuelGas').getValue();
		this.newFuelStationStore.filterBy(function (record) {
			var kolFilters = 0;
			var trueFilters = 0;

			kolFilters++;
			if (record.get("in_use")) trueFilters++; 

			if (record.get("klient_id") != '0' && setGas != null) {
				kolFilters++;
				if (record.get("gas") == setGas) trueFilters++; 
			}

			return kolFilters == trueFilters;
		});
	},

	clearFuelStationsFilters: function () {
		this.newFuelStationStore.suspendEvents();
		this.newFuelStationStore.clearFilter();
		this.newFuelStationStore.remoteFilter = false;
		this.newFuelStationStore.filter();
		this.newFuelStationStore.resumeEvents();
	},

	onShow: function(){
		var store = Ext.getCmp('autoEditFirstStation').getStore();
		if (store && store.count() == 0) this.refreshFuelStationStore();
	},

	onWorktimeBeginChange: function (field, newValue, oldValue, eOpts) {
		var seconds = hmsToSecondsOnly(newValue) * 60;
		var form = this.lookupReference('form').getForm();

		form.setValues({
			worktime_begin: seconds
		});

		var values = form.getValues();
		if (values.route_begin_endtime <= values.worktime_begin) {
			form.setValues({
				route_begin_endtime: values.worktime_begin,
				route_begin_endtime_1: secToHHMM(values.worktime_begin),
			});
		}
	},

	onWorktimeEndChange: function (field, newValue, oldValue, eOpts) {
		var seconds = hmsToSecondsOnly(newValue) * 60;
		var form = this.lookupReference('form').getForm();

		form.setValues({
			worktime_end: seconds
		});

		var values = form.getValues();
		if (values.route_end_endtime <= values.worktime_end) {
			form.setValues({
				route_end_endtime: values.worktime_end,
				route_end_endtime_1: secToHHMM(values.worktime_end),
			});
		}
	},

	onRouteBeginEndTimeChange: function (field, newValue, oldValue, eOpts) {
		var seconds = hmsToSecondsOnly(newValue) * 60;
		var form = this.lookupReference('form').getForm();
		form.setValues({
			route_begin_endtime: seconds
		});
	},

	onRouteEndEndTimeChange: function (field, newValue, oldValue, eOpts) {
		var seconds = hmsToSecondsOnly(newValue) * 60;
		var form = this.lookupReference('form').getForm();
		form.setValues({
			route_end_endtime: seconds
		});
	},

	closeView: function (dialog) {
		var allowedClientGroupsStore = this.getView().down('allowedclientgroups').store;
		allowedClientGroupsStore.rejectChanges();
		this.getView().close();
	},
	
	saveRecord: function (dialog) {
		dialog.updateRecord();

		record = dialog.getRecord();

		var allowedClientGroupsStore = this.getView().down('allowedclientgroups').store;
		record.set('allowed_clientgroups', Ext.pluck(allowedClientGroupsStore.data.items, 'data'));
		store = record.store;

		if (store) {
			if (record.phantom) {
				store.add(record);
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
	},

	onSaveClick: function (button) {
		var self = this;
		var store, record;
		var form = button.up('window').down('form');
		var formValues = form.getValues();

		var timeIsValid = true;
		if (formValues.worktime_begin >= formValues.worktime_end
			//|| formValues.route_begin_endtime > formValues.route_end_endtime 
			|| formValues.worktime_begin > formValues.route_begin_endtime
			|| formValues.route_begin_endtime > formValues.worktime_end
			|| formValues.route_end_endtime > formValues.worktime_end
		) {
			timeIsValid = false;
		}

		if (!timeIsValid) {
			Ext.Msg.alert('Внимание', 'Неверно установлены интервалы времени!');
			return;
		};

		var allowedClientGroups = button.up('window').down('allowedclientgroups');		
		var allowedClientGroupsStore = allowedClientGroups.store;

		if (allowedClientGroupsStore.count() == 0){
			Ext.Msg.alert('Внимание', 'Пустой список допустимых групп клиентов!');
			return;
		}

		var inUseCount = 0;
		allowedClientGroupsStore.each(function(record){
		   	if (record.get('in_use')) {
				inUseCount++;
			}
		});

		if (inUseCount == 0) {
			Ext.Msg.alert('Внимание', 'Нет отмеченных допустимых групп клиентов!');
			return;
		}

		this.saveRecord(form);
		button.up('window').close();
	},

	onDriverSelect: function (combo, record, eOpts) {
		var form = this.lookupReference('form').getForm();
		form.setValues({
			driver_name: record.get('name'),
		});
	},

	refreshDriver: function () {
		Ext.getStore('Drivers').reload();
	},
});