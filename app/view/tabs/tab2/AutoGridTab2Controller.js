Ext.define('Opt.view.tabs.tab2.AutoGridTab2Controller', {
	extend: 'Opt.view.AutoGridController',
	alias: 'controller.tab2autogrid',
	requires: [
		'Opt.ux.GridPrinter',
		'Opt.view.tabs.fuelStationsViewer.Main',
	],

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},

	init: function () {
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
	},

	afterRender: function () {
		var store = Ext.getStore('Auto2');
		if (store.count() == 0) {
			this.refreshAutos();
		}

		this.setAutosGroupMenu();
		this.setTitle();
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

		var clientGroupsStore = Ext.getStore('ClientGroup');

		var allowedGroupsArr = [];
		for (var i=0; i < clientGroupsStore.count(); i++){
			var record = clientGroupsStore.getAt(i);
			var copyRecord = record.copy();
			if (copyRecord.get('id') != 0) {
				copyRecord.set('in_use', true);
				allowedGroupsArr.push(copyRecord.data);
			}
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
					return;
        			}

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

					record.set("worktime_begin", def_route_time_begin),
					record.set("worktime_end", def_route_time_end),
					record.set("route_begin_endtime", def_route_time_end),
					record.set("route_end_endtime", def_route_time_end),
					record.set("allowed_clientgroups", allowedGroupsArr),
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
				});

				storeDrivers.load();
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

	setRouteStartBegin: function (item, e, Opts) {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}

		var setTimeDialog = Ext.create('Opt.view.dialog.SetTime', {
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

		var setTimeDialog = Ext.create('Opt.view.dialog.SetTime', {
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

		var setTimeDialog = Ext.create('Opt.view.dialog.SetTime', {
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

	setAllowedClientGroups: function(){
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		this.msgbox = null;
		this.msgbox = Ext.create('Opt.view.dialog.SetAllowedClientGroups', {parentGrid: grid });
		this.msgbox.show();
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
			record.set('allowed_clientgroups', allowedGroupsArr);
		});

		store.sync();
		store.resumeEvents();
		grid.view.refresh();
	},

	gridRefresh: function () {
		this.getView().view.refresh();
	},

	setTitle: function (filterString) {
		if (!filterString) filterString = '';
		this.getView().setTitle('Машины' + filterString);
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

		var store = this.getView().store;

		var form = Ext.getCmp('formparamtab2').getForm();
		var formVal = form.getFieldValues();
		var byDate = formVal.solvedate;
		byDate = byDate.replace(/-/g, '/'); // для IE 

		var parsedDate = Date.parse(byDate);

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
			},

			failure: function (response) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
				grid.unmask();
			}
		});
	},

	fuelStations: function () {
		if (!this.viewer) this.viewer = Ext.create('widget.fuelstationsviewer', { closable: true });
		this.viewer.show();
		this.viewer.focus();
		if (this.viewer.mapRendered) this.fireEvent("fuelstationsviewermapRender");
	},
});