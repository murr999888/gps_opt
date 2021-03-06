Ext.define('Opt.view.tabs.tab2.AutoGridTab2Controller', {
	extend: 'Opt.view.AutoGridController',
	alias: 'controller.tab2autogrid',
	requires: [
		'Opt.ux.GridPrinter',
		'Opt.view.tabs.fuelStationsViewer.Main',
		'Opt.view.dialog.SetBreakTime',
		'Opt.view.dialog.SetTime',
		'Opt.view.dialog.SetMaxRaces',
		'Opt.view.dialog.SetAllowedClientGroups',
	],

	listen: {
		controller: {
			'*': {
				tab2refuelmodeselected: 'refreshGrid',
				distributed_orders_change_date: 'markWorkingAutos',
			}
		}
	},

	refreshGrid: function(){
		this.getView().view.refresh();
	},

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},

	init: function () {
		var self = this;
		this.getView().getSelectionModel().setSelectionMode('MULTI')
		if (testmode) {
			var menu = Ext.getCmp('tab2autosgridmenubuttonChange').menu;
			menu.add(
				{
					xtype: 'menuseparator'
				}
			);
			menu.add(
				{
					text: 'Отметить машины с МЛ',
					handler: 'markWorkingAutos',
					iconCls: 'fa fa-check-square',
				}
			);
		}

		var store = this.getView().getStore();
		store.on('update', function(){
			self.setTitle();
		});

		var storeFuelStations = Ext.getStore('FuelStations');
		storeFuelStations.on('load', function(){
			self.setFuelStationsButtonTitle();
		});

		storeFuelStations.on('update', function(){
                       	self.setFuelStationsButtonTitle();
		});
	},

	setTitle: function (filterString) {
		if (!filterString) filterString = '';
		var store = this.getView().getStore();
		var inUseCount = 0;
		store.each(function(record){
			if(record.get("in_use")){
				inUseCount++;
			}
		});
		var checkedStr = '';
		if (inUseCount > 0) checkedStr = ' &#10003;' + inUseCount + ' ';
		this.getView().setTitle('Машины ' + checkedStr + '(' + store.count() + ') ' + filterString);
	},

	setBreakTime: function(){
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}
		
		if (!this.SetBreakTimeDialog || this.SetBreakTimeDialog.destroyed) this.SetBreakTimeDialog = Ext.create('widget.setbreaktime', {parentGrid: grid });
		this.SetBreakTimeDialog.show();
	},

	setFuelStationsButtonTitle: function(){
		var store = Ext.getStore('FuelStations');
		var storeCount = 0;
		checkedStr='';
		var inUseCount = 0;

		store.each(function(record){
			if(record.get("in_use")){
				inUseCount++;
			}
		});
		
		if (inUseCount>0) checkedStr = ' &#10003;' + inUseCount + ' ';
		Ext.getCmp('tab2fuelstationbutton').setText('<b>Заправки ' + checkedStr + '(' + store.count() + ')<b/>');
	},

	afterRender: function () {
		this.setAutosGroupMenu();
		var store = Ext.getStore('Auto2');
		if (store.count() == 0) {
			this.refreshAutos();
		}

		this.setTitle();
		this.setFuelStationsButtonTitle();
	},

	setAutosGroupMenu: function () {
		var self = this;
		var store = Ext.getStore('AutosGroup');
		var button = Ext.getCmp('tab2autosgridfilter');

		store.on('load', function () {
			store.each(function (record) {
				var menuItem = Ext.create('Ext.menu.Item', {
					menuid: record.get('id'),
					text: record.get('name'),
					handler: 'setFilter',
				});
				button.menu.add(menuItem);
			});

			var separator = Ext.create('Ext.menu.Separator');
			button.menu.add(separator);

			var menuItem = Ext.create('Ext.menu.Item', {
				menuid: 'water_carrier',
				text: 'Водовозки',
				handler: 'setFilter',
			});

			button.menu.add(menuItem);

			var separator = Ext.create('Ext.menu.Separator');
			button.menu.add(separator);

			var menuItem = Ext.create('Ext.menu.Item', {
				menuid: 'in_use',
				text: 'Отмеченные',
				handler: 'setFilter',
			});

			button.menu.add(menuItem);
		});
	},

	clearFilter: function () {
		var store = this.getView().store;
		store.clearFilter();
		store.remoteFilter = false;
		store.filter();
	},

	setFilter: function (item, e, Opts) {
		var store = this.getView().store;
		this.clearFilter();

		if (item.menuid == 0) {  //по всем
			this.setTitle();
			return;
		}

		if (item.menuid == 'water_carrier') {
			store.filterBy(function (record) {
				if (record.get("is_watercarrier")) {
					return true;
				}
			});
			this.setTitle(" (водовозки)");

		} else if (item.menuid == 'in_use') {
			store.filterBy(function (record) {
				if (record.get("in_use")) {
					return true;
				}
			});
			this.setTitle(" (отмеченные)");

		} else {
			store.filterBy(function (record) {
				if (record.get("parent_id") == item.menuid) {
					return true;
				}
			});
			this.setTitle(" (" + item.text + ")");
		};
	},

	refreshAutos: function () {
		var self = this;
		self.getAutos();
	},

	getAutos: function(){
		var self = this;
		var params = {
			param: 'Autos',
			includeTemplate: true,
		};

		var grid = self.getView();
		var store = grid.store;
		var form = Ext.getCmp('formparamtab2').getForm();
		var formVal = form.getFieldValues();

		grid.mask('Обновление..');

       		Ext.Ajax.request({
			url: 'api/db/db_1cbase',
			method: 'GET',
			params: params,

			success: function (response) {

 				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					grid.unmask();
					Opt.app.showError("Ошибка!", error.message);
					return;
        			}

				store.suspendEvents();
				store.removeAll();
				store.save();

				store.loadData(respObj.data);
				store.save();

				store.each(function (record) {
					var is_template = record.get("is_template");
					var is_watercarrier = record.get("is_watercarrier");
					record.beginEdit();

					if (!is_template) {
						record.set('in_use', true);
					}

					if (is_watercarrier) {
						record.set('maximize_water', true);
						record.set('maximize_bottle', false);
					} else {
						record.set('maximize_water', false);
						record.set('maximize_bottle', true);
					}

					if (record.get("fuel_rate_by_100") == 0) record.set("fuel_rate_by_100", 12);

					record.set("worktime_begin", def_route_time_begin);
					record.set("worktime_end", def_route_time_end);
					record.set("route_begin_endtime", def_route_time_end);
					record.set("route_end_endtime", def_route_time_end);
					record.set("fuel_gas", false);
					record.set("maxraces", 5);
					record.save();
				});

				storeDrivers = Ext.getStore('Drivers');
				storeDrivers.on('load', function(){
					var autos = respObj.data;
					for (var i = 0; i < autos.length; i++) {
						var auto = store.findRecord('id', autos[i].id);
						if (auto) {
							var driver = storeDrivers.findRecord('id', auto.get('driver_id'));
							if (driver) {
								auto.set('driver_id', driver.get('id'));
								auto.set('driver_name', driver.get('name'));
							} else {
								auto.set('driver_id', 0);
								auto.set('driver_name', '< не выбран >');
							}
						}
					}

					store.save();
					store.resumeEvents();
					self.getView().view.refresh();
					grid.unmask();
					self.setTitle();
				});

				storeDrivers.load();

				var clientGroupsStore = Ext.getStore('ClientGroup');
				clientGroupsStore.on('load', function(){
					var allowedGroupsArr = [];
					for (var i=0; i < clientGroupsStore.count(); i++){
						var record = clientGroupsStore.getAt(i);
						var copyRecord = record.copy();
						if (copyRecord.get('id') != 0) {
							copyRecord.set('in_use', true);
							allowedGroupsArr.push(copyRecord.data);
						}
					};

					for (var i = 0; i < store.count(); i++) {
						var record = store.getAt(i);
						record.set("allowed_clientgroups", allowedGroupsArr);
					}

					store.save();
				});

				clientGroupsStore.load();
			},

			failure: function (response) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
				grid.unmask();
			}
		});
	},

	resetAutos: function () {
		this.clearFilter();
		var form = Ext.getCmp('formparamtab2').getForm();
		var formVal = form.getFieldValues();
		var timebreakraces = formVal.timebreakraces;

		var timeBegin = def_route_time_begin;
		var timeEnd = def_route_time_end;

		var storeAutos = this.getView().store;
		var grid = this.getView();

		storeAutos.suspendEvents();

		storeAutos.each(function (record) {
			record.beginEdit();
			record.set('worktime_begin', timeBegin);
			record.set('worktime_end', timeEnd);
			record.set('route_begin_endtime', timeEnd);
			record.set('route_end_endtime', timeEnd);
			if (record.get('is_template')) {
				record.set('in_use', false);
			} else {
				record.set('in_use', true);
			}
			record.save();
		});

		storeAutos.resumeEvents();
		this.view.getView().refresh();
	},

	setEndAsBegin: function () {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}

		var form = Ext.getCmp('formparamtab2').getForm();
		var formVal = form.getFieldValues();
		var timebreakraces = formVal.timebreakraces;

		var storeRoutes = Ext.getCmp('tab2routesgrid').store;
		var storeAutos = this.getView().store;

		storeAutos.suspendEvents();

		storeRoutes.each(function (record) {
			if (record.get('in_use')) {
				var autoId = record.get('auto_id');
				var foundedAutos = storeAutos.findRecord('id', autoId);

				var timeEnd = record.get('route_end');
				if (foundedAutos && foundedAutos.get('in_use')) {
					foundedAutos.beginEdit();
					foundedAutos.set('worktime_begin', timeEnd);
					foundedAutos.set('route_begin_endtime', timeEnd + timebreakraces * 60);
					foundedAutos.commit();
					foundedAutos.save();
				}
			}
		});

		storeAutos.resumeEvents();
		this.view.getView().refresh();
	},

	setRefuelByRate: function (item, e, Opts) {
		var grid = this.getView();
		var store = grid.getStore();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}
		store.suspendEvents();
                selection.forEach(function(record){
			record.set("fuel_refuel_by_rate", true);
			record.save();
		});
		store.resumeEvents();
		this.getView().view.refresh();
	},

	resetRefuelByRate: function (item, e, Opts) {
		var grid = this.getView();
		var store = grid.getStore();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}
		
		store.suspendEvents();
                selection.forEach(function(record){
			record.set("fuel_refuel_by_rate", false);
			record.save();
		});
		store.resumeEvents();
		this.getView().view.refresh();
	},

	setRouteStartBegin: function (item, e, Opts) {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}

		if (!this.setTimeDialog || this.setTimeDialog.destroyed) this.setTimeDialog = Ext.create('widget.settime', {
			tab: 'tab1',
			text: item.text,
		});

		var form = setTimeDialog.lookupReference('form').getForm();
		form.setValues({
			time: 28800,
			timeField: '08:00:00',
			setField: 'worktime_begin'
		});
		setTimeDialog.show();
	},

	setRouteStartEnd: function (item, e, Opts) {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}

		if (!this.setTimeDialog || this.setTimeDialog.destroyed) this.setTimeDialog = Ext.create('widget.settime', {
			tab: 'tab1',
			text: item.text,
		});

		var form = setTimeDialog.lookupReference('form').getForm();
		form.setValues({
			time: 72000,
			timeField: '20:00:00',
			setField: 'route_begin_endtime'
		});
		setTimeDialog.show();
	},

	setRouteEnd: function (item, e, Opts) {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}

		if (!this.setTimeDialog || this.setTimeDialog.destroyed) this.setTimeDialog = Ext.create('widget.settime', {
			tab: 'tab1',
			text: item.text,
		});

		var form = setTimeDialog.lookupReference('form').getForm();
		form.setValues({
			time: 72000,
			timeField: '20:00:00',
			setField: 'route_end_endtime'
		});
		setTimeDialog.show();
	},

	setFirstHalf: function () {
		var grid = this.getView();
		var store = grid.store;
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}

		var form = Ext.getCmp('formparamtab2').getForm();
		var formVal = form.getFieldValues();
		var timebreakraces = formVal.timebreakraces;

		var timeBegin = def_route_time_begin;
		var timeEnd = def_route_time_end;

		store.suspendEvents();
		selection.forEach(function (record) {
			record.set('worktime_begin', timeBegin);
			record.set('worktime_end', 13 * 60 * 60);
			record.set('route_begin_endtime', 13 * 60 * 60);
			record.set('route_end_endtime', 13 * 60 * 60);
			record.save();
		});

		store.resumeEvents();
		this.getView().view.refresh();
	},

	setSecondHalf: function () {
		var grid = this.getView();
		var store = grid.store;
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}

		var form = Ext.getCmp('formparamtab2').getForm();
		var formVal = form.getFieldValues();
		var timebreakraces = formVal.timebreakraces;

		var timeBegin = def_route_time_begin;
		var timeEnd = def_route_time_end;

		store.suspendEvents();
		selection.forEach(function (record) {
			record.set('worktime_begin', 13 * 60 * 60);
			record.set('worktime_end', timeEnd);
			record.set('route_begin_endtime', timeEnd);
			record.set('route_end_endtime', timeEnd);
			record.save();
		});

		store.resumeEvents();
		this.getView().view.refresh();
	},

	setAllDay: function () {
		var grid = this.getView();
		var store = grid.store;
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}

		var form = Ext.getCmp('formparamtab2').getForm();
		var formVal = form.getFieldValues();
		var timebreakraces = formVal.timebreakraces;

		var timeBegin = def_route_time_begin;
		var timeEnd = def_route_time_end;

		store.suspendEvents();
		selection.forEach(function (record) {
			record.set('worktime_begin', timeBegin);
			record.set('worktime_end', timeEnd);
			record.set('route_begin_endtime', timeEnd);
			record.set('route_end_endtime', timeEnd);
			record.save();
		});

		store.resumeEvents();
		this.getView().view.refresh();
	},

	setMaxRaces: function(){
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}
		if (!this.SetMaxRacesDialog || this.SetMaxRacesDialog.destroyed) this.SetMaxRacesDialog = Ext.create('Opt.view.dialog.SetMaxRaces', {parentGrid: grid });
		this.SetMaxRacesDialog.show();
	},

	saveDefaultMaxRaces: function(){
		var self = this;
		var grid = this.getView();
		var store = grid.getStore();
		store.suspendEvents();
		store.each(function (record) {
			if (record.get("is_watercarrier")) {
				record.set("maxraces", self.maxracesbigautos);
			} else {
				if (record.get("bottle") < 50) {
					record.set("maxraces", self.maxracessmallautos);
				} else {
					record.set("maxraces", self.maxracesbigautos);
				}
			}
			record.save();
		});
		store.resumeEvents();
		this.view.getView().refresh();
	},

	setMaxRacesDefault: function(){
		var self = this;
		Ext.Msg.show({
			title: 'Внимание',
			message: 'Макс. количество рейсов для ВСЕХ машин<br />будет установлено по-умолчанию. Продолжить?',
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION,
			fn: function (btn) {
				if (btn === 'yes') {
					self.saveDefaultMaxRaces();
				} else if (btn === 'no') {
					return;
				}
			}
		});
	},

	setAllowedClientGroups: function(){
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		if (!this.setAllowedClientGroupsDialog || this.setAllowedClientGroupsDialog.destroyed) this.setAllowedClientGroupsDialog = Ext.create('widget.setallowedclientgroups', {parentGrid: grid });
		this.setAllowedClientGroupsDialog.show();
	},

	resetAllowedClientGroups: function(){
		var grid = this.getView();
		var selection = grid.getSelection();
		var store = grid.store;

		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		var clientGroupsStore = Ext.getStore('ClientGroup');
		var allowedGroupsArr = [];
		clientGroupsStore.each(function(record){
			var copyRecord = record.copy();
			if (copyRecord.get('id') != 0) {
				copyRecord.set('in_use', true);
				allowedGroupsArr.push(copyRecord.data);
			}
		});

		store.suspendEvents();
		selection.forEach(function (record) {
			var copyArr = [];
			allowedGroupsArr.forEach(function(item){
				newItem = {};
				newItem.id = item.id;
				newItem.in_use = item.in_use;
				newItem.name = item.name;				
				if(record.get("is_watercarrier") == true){
					if(newItem.id != "e04ce00c-3f1e-48c2-b0a2-47e896b1eebd" && newItem.id != "7a4bfbd6-74b2-4e7f-acb0-36f936dbfa42") {
                                        	newItem.in_use = false;
					}
				}
				copyArr.push(newItem);
			});
			record.set('allowed_clientgroups', copyArr);
		});

		store.sync();
		store.resumeEvents();
		grid.view.refresh();
	},

	gridRefresh: function () {
		this.getView().view.refresh();
	},

	refreshDrivers: function(){
		var self = this;
		var params = {
			param: 'Autos',
			includeTemplate: false,
		};

		var grid = self.getView();
		var store = grid.store;
		var form = Ext.getCmp('formparamtab2').getForm();
		var formVal = form.getFieldValues();
		grid.mask('Обновление..');

		storeDrivers = Ext.getStore('Drivers');
		storeDrivers.on('load', function(){
			Ext.Ajax.request({
				url: 'api/db/db_1cbase',
				method: 'GET',
				params: params,

				success: function (response) {
					store.suspendEvents();

					try {
						respObj = Ext.JSON.decode(response.responseText);
			        	} catch(error) {
						Opt.app.showError("Ошибка!", error.message);
						return;
        				}

					var autos = respObj.data;
					for (var i = 0; i < autos.length; i++) {
						var autoRecord = store.findRecord('id', autos[i].id);
						if (autoRecord) {
							var driver = storeDrivers.findRecord('id', autos[i].driver_id);

							if (driver) {
								autoRecord.set('driver_id', driver.get('id'));
								autoRecord.set('driver_name', driver.get('name'));
							} else {
								autoRecord.set('driver_id', 0);
								autoRecord.set('driver_name', '< не выбран >');
							}
						}
					}

					store.save();
					store.resumeEvents();
					self.getView().view.refresh();
					grid.unmask();
				},
				
				failure: function (response) {
					Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
					grid.unmask();
				}
			});

		});
		storeDrivers.load();
	},

	markWorkingAutos: function(){
		var self = this;
		var grid = this.getView();
		var store = this.getView().store;

		var form = Ext.getCmp('formparamtab2').getForm();
		var formVal = form.getFieldValues();
		var byDate = formVal.solvedate;
		byDate = byDate.replace(/-/g, '/'); // для IE 

		var parsedDate = Date.parse(byDate);

		grid.mask("Обновляем...");

		var params = {
			param: 'workingautos',
			bydate: Parse1CData(parsedDate),
		};

		Ext.Ajax.request({
			url: 'api/db/db_1cbase',
			method: 'GET',
			params: params,

			success: function (response) {

				store.suspendEvents();

 				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					Opt.app.showError("Ошибка!", error.message);
					grid.unmask();
					return;
        			}

				var autos = respObj.data;

				if (autos.length == 0) {
					return;
				}

				// сбрасываем отметки у всех

				store.each(function(record){
					record.set('in_use', false);
					record.save();
				});
				store.save();

				for (var i = 0; i < autos.length; i++) {
					var auto = store.findRecord('id', autos[i].id);
					if (auto){
						auto.set('in_use', true);
						auto.save();
					};
				}

				store.save();
				store.resumeEvents();
				self.getView().view.refresh();
				self.setTitle();
				grid.unmask();
			},

			failure: function (response) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
				grid.unmask();
			}
		});
	},

	fuelStations: function () {
		if (!this.fuelStationsViewer || this.fuelStationsViewer.destroyed) this.fuelStationsViewer = Ext.create('widget.fuelstationsviewer', { closable: true });
		this.fuelStationsViewer.show();
		this.fuelStationsViewer.focus();
		if (this.fuelStationsViewer.mapRendered) this.fireEvent("fuelstationsviewermapRender");
	},

	resetFirstFuelStation: function(){
		var grid = this.getView();
		var store = this.getView().store;
		store.suspendEvents();
                store.forEach(function(record){
			record.set("fuel_first_station", '0');
		});
		store.save();
		store.resumeEvents();
		this.getView().view.refresh();
	},
});