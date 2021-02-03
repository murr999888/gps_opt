Ext.define('Opt.view.tabs.tab2.OrdersTab2Controller', {
	extend: 'Opt.view.RouteLegGridController',
	alias: 'controller.tab2orders',
	timerId: null,
	currTaskId: null,
	requires: [
		'Opt.ux.GridPrinter',
	],

	ordersStore: null,
	ordersStoreFilter: false,

	listen: {
		controller: {
			'*': {
				distributed_orders_recieved: 'distributed_orders_recieved',
				distributed_orders_error: 'distributed_orders_error',
				distributed_orders_change_date: 'distributed_orders_change_date',
				adding_orders_recieved: 'adding_orders_recieved',
				adding_orders_error: 'adding_orders_error',
				serverDisconnect: 'serverDisconnect',
				breakCalcCommand: 'breakCalcCommand',
			}
		}
	},

	init: function () {
		var self = this;
		this.ordersStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.RouteLegs',
			proxy: {
				type: 'memory',
			},
		});

		Ext.getCmp('tab2ordersgrid').setStore(this.ordersStore);

		this.ordersStore.on('load', function(){
			this.fireEvent('tab2ordergridsettitle');
		});

		this.ordersStore.on('update', function(){
			this.fireEvent('tab2ordergridsettitle');
		});
	},

	onResize: function(panel, width, height, oldWidth, oldHeight, eOpts ) {
		if (width < 515) {
			Ext.getCmp('tab2ordersgrid').removeButtonIcons();
		} else {
			Ext.getCmp('tab2ordersgrid').setButtonIcons();
		}
	},

	afterRender: function () {
		var self = this;
		var width = this.getView().getWidth();
		if (width < 450) {
			Ext.getCmp('tab2ordersgrid').removeButtonIcons();
		} else {
			Ext.getCmp('tab2ordersgrid').setButtonIcons();
		}

		Ext.on('resize', function () {
			var width = self.getView().getWidth();
			if (width < 450) {
				Ext.getCmp('tab2ordersgrid').removeButtonIcons();
			} else {
				Ext.getCmp('tab2ordersgrid').setButtonIcons();
			}
		});
	},

	onProdCSelect: function (combo, record, eOpts) {
		//this.setFilter();
	},

	onClientCSelect: function (combo, record, eOpts) {
		//this.setFilter();
	},

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},

	distributed_orders_change_date: function () {
		this.clearStores();
	},

	getOrdersFromServer: function () {
		var self = this;
		var routesStore = Ext.getCmp('tab2routesgrid').store;

		if (this.ordersStore.count() > 0 || routesStore.count() > 0) {
			Ext.Msg.show({
				title: 'Внимание',
				message: 'Таблицы заказов и маршрутов будут очищены. Продолжить?',
				buttons: Ext.Msg.YESNO,
				icon: Ext.Msg.QUESTION,
				fn: function (btn) {
					if (btn === 'yes') {
						self.getOrders();
					} else if (btn === 'no') {
						return;
					}
				}
			});
		} else {
			self.getOrders();
		}
	},

	getOrders: function () {
		var self = this;
		Ext.getCmp('tab2ordersgrid').mask('Запрос заказов ...');
		Ext.getStore('TempResults').removeAll();

		this.clearStores();
		this.clearFilter();

		var store = this.ordersStore;
		store.removeAll();
		store.sync();

		var form = Ext.getCmp('formparamtab2');
		var formVal = form.getForm().getFieldValues();
		var orders_date = formVal.solvedate;

		orders_date = orders_date.replace(/-/g, '/'); // для IE 

		var datetimeBegin = Date.parse(orders_date + ' ' + "00:00:00");
		var datetimeEnd = Date.parse(orders_date + ' ' + "23:59:59");

		var params = {
			param: 'Orders',
			datetime_begin: Parse1CData(datetimeBegin),
			datetime_end: Parse1CData(datetimeEnd),
			use_progressive_penalty: true
		};

		var onlyfreeorders = Ext.getCmp("tab2onlyfreeorders").getValue();

		if (onlyfreeorders) {
			params['notinml_filter'] = true;
		}

		Ext.Ajax.request({
			url: 'api/db/db_1cbase',
			method: 'GET',
			params: params,
		        async: true,
			success: function (response) {
 				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					Opt.app.showError("Ошибка!", error.message);
					Ext.getCmp('tab2ordersgrid').unmask();
					return;
        			}

				store.suspendEvents();
				store.loadData(respObj.data.orders);
				store.sync();
				store.resumeEvents();
				store.fireEvent('load');
				self.fireEvent('tab2ordergridsettitle');

				Ext.getCmp('tab2ordersgrid').view.refresh()

				var storeUnloadingGoodsTotals = Ext.getStore('OrdersUnloadingGoodsStore');
				storeUnloadingGoodsTotals.suspendEvents();
				storeUnloadingGoodsTotals.loadData(respObj.data.goods);
				storeUnloadingGoodsTotals.sync();
				storeUnloadingGoodsTotals.resumeEvents();
				storeUnloadingGoodsTotals.fireEvent('load');
				Ext.getCmp('tab2ordersgrid').unmask();
			},

			failure: function (response) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
				Ext.getCmp('tab2ordersgrid').unmask();
			}
		});
	},

	setFilter: function () {
		var form = this.lookupReference('formorderstab2');
		var formVal = form.getValues();

		var selectedProd = formVal.productselect;
		var not_productselect = formVal.not_productselect;

		var selectedClientGroup = formVal.clientgroupselect;
		var not_clientgroupselect = formVal.not_clientgroupselect;

		var clientname = formVal.clientname;
		var not_clientname = formVal.not_clientname;

		var tochkaname = formVal.tochkaname;
		var not_tochkaname = formVal.not_tochkaname;

		var city = formVal.city;
		var not_city = formVal.not_city;

		var addr = formVal.addr;
		var not_addr = formVal.not_addr;

		var inuse_box = formVal.in_use;
		var notinuse_box = formVal.not_in_use;

		this.clearFilter();

		if (selectedProd != 0 || selectedClientGroup != 0 || clientname.trim() != '' || tochkaname.trim() != '' || city.trim() != '' || addr.trim() != '' || inuse_box || notinuse_box) {
			this.ordersStoreFilter = true;
			this.ordersStore.suspendEvents();
			this.ordersStore.filterBy(function (record) {
				var klient_name = record.get("klient_name").toUpperCase();
				var tochka_name = record.get("tochka_name").toUpperCase();
				var city_name = record.get("city").toUpperCase();
				var addr_name = record.get("adres").toUpperCase();
				var goods_filter = record.get("goods_filter");
				var klient_group_id = record.get("klient_group_id");
				var in_use = record.get("in_use");

				var kolFilters = 0;
				var trueFilters = 0;

				if (clientname.trim() != '') {
					kolFilters = kolFilters + 1;
					var found = klient_name.indexOf(clientname.toUpperCase()) != -1;

					if ((found && !not_clientname) || (!found && not_clientname)) {
						trueFilters = trueFilters + 1;
					}
				}

				if (tochkaname.trim() != '') {
					kolFilters = kolFilters + 1;
					var found = tochka_name.indexOf(tochkaname.toUpperCase()) != -1;
					if ((found && !not_tochkaname) || (!found && not_tochkaname)) {
						trueFilters = trueFilters + 1;
					}
				}

				if (city.trim() != '') {
					kolFilters = kolFilters + 1;
					var found = city_name.indexOf(city.toUpperCase()) != -1;
					if ((found && !not_city) || (!found && not_city)) {
						trueFilters = trueFilters + 1;
					}
				}

				if (addr.trim() != '') {
					kolFilters = kolFilters + 1;
					var found = addr_name.indexOf(addr.toUpperCase()) != -1;
					if ((found && !not_addr) || (!found && not_addr)) {
						trueFilters = trueFilters + 1;
					}
				}

				if (selectedClientGroup != 0) {
					kolFilters = kolFilters + 1;
					var found = klient_group_id == selectedClientGroup;
					if ((found && !not_clientgroupselect) || (!found && not_clientgroupselect)) {
						trueFilters = trueFilters + 1;
					}
				}

				if (selectedProd != 0) {
					kolFilters = kolFilters + 1;
					var found = goods_filter.indexOf(selectedProd) != -1;
					if ((found && !not_productselect) || (!found && not_productselect)) {
						trueFilters = trueFilters + 1;
					}
				}

				if (inuse_box) {
					kolFilters = kolFilters + 1;
					if (in_use) {
						trueFilters = trueFilters + 1;
					}
				}


				if (notinuse_box) {
					kolFilters = kolFilters + 1;
					if (!in_use) {
						trueFilters = trueFilters + 1;
					}
				}

				if (kolFilters == trueFilters) {
					return true;
				}
			});

			this.ordersStore.resumeEvents();
			Ext.getCmp('tab2ordersgrid').view.refresh();
			this.fireEvent('tab2ordergridsettitle', " (фильтр)");
		}

		this.fireEvent('tab2ordersgriddeselect');
	},

	clearForm: function () {
		var form = this.lookupReference('formorderstab2').getForm();
		form.setValues({
			clientname: '',
			not_clientname: false,
			tochkaname: '',
			not_tochkaname: false,
			city: '',
			not_city: false,
			addr: '',
			not_addr: false,
			clientgroupselect: 0,
			not_clientgroupselect: false,
			productselect: 0,
			not_productselect: false,
			in_use: false,
			not_in_use: false,
		});
		this.fireEvent('tab2ordersgriddeselect');
	},

	clearFilter: function () {
		this.ordersStore.suspendEvents();
		this.ordersStoreFilter = false;
		this.ordersStore.clearFilter();
		this.ordersStore.remoteFilter = false;
		this.ordersStore.filter();
		this.ordersStore.resumeEvents();
		Ext.getCmp('tab2ordersgrid').view.refresh();
		this.fireEvent('tab2ordergridsettitle');
	},

	clearField: function (field, button, e) {
		field.setValue('');
		//this.setFilter();
	},
	
	checkDestinations: function(){
		// проверим достижимость точек
		checkedArr = [];

		var depot = Ext.clone(Opt.app.getMainDepot().data);
		delete depot.id;

		checkedArr.push([depot.lon,depot.lat]);

		for (var i = 0; i < this.ordersStore.count(); i++) {
			var recordOrder = this.ordersStore.getAt(i);
			if (recordOrder.get("in_use")) {
				var rec = this.ordersStore.getAt(i);
				var lat = rec.get("lat");
				var lon = rec.get("lon");
				checkedArr.push([lon,lat]);
			}
		}

		if (checkedArr.length >= 2) this.checkPointsAvail(checkedArr,300);
	},

	checkPointsAvail: function(arr, radius){
		var self = this;

		var json = {
			param: 'convert',
			data: arr,			
			sources: 0,
			radius: radius,
		};

		Ext.Ajax.request({
			url: 'api/db/router',
			method: 'POST',
			jsonData: json,
			success: function (response) {
 				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					Opt.app.showError("Ошибка!", error.message);
					return;
        			}

				responseJSON = Ext.JSON.decode(response.responseText);
				if (responseJSON.code && responseJSON.code != 'Ok') {
					Ext.Msg.alert("Ошибка!", responseJSON.code + '<br>' + responseJSON.message);
					return;
				}

				self.sendDataToServer();
			},

			failure: function (response) {
				if (response.status == 400) {
					responseJSON = Ext.JSON.decode(response.responseText);
					Ext.Msg.alert("Ошибка!", responseJSON.code + '<br>' + responseJSON.message);
					return;
				} else {
					Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
					return;
				}
				Ext.getCmp('maintab2').unmask();
				return;
			}
		});
	},

	checkDataBeforeSend: function () {
		var self = this;
		if (!Opt.app.socket.readyState || !Opt.app.socket.readyState == 1) {
			Opt.app.showError("Ошибка!","Нет соединения с сервером!");
			console.log(Opt.app.socket.readyState);
			return;
		}

		Ext.getCmp('maintab2').mask('Проверка данных ...');
		var mode = Ext.getCmp('distordersmode').getValue();


		var mainDepotStore = Ext.getStore('MainDepot');

		if (mainDepotStore.count() == 0) {
			Ext.getCmp('maintab2').unmask();
                 	Ext.Msg.alert({
				title: 'Внимание',
				message: 'Пустое хранилище данных о главном депо!',
				buttons: Ext.Msg.OK,
			});
			return;
		}

		var depot = Ext.clone(Opt.app.getMainDepot().data);
		if(depot) delete depot.id;

                if (!depot) {
			Ext.getCmp('maintab2').unmask();
                 	Ext.Msg.alert({
				title: 'Внимание',
				message: 'Нет данных о главном депо!',
				buttons: Ext.Msg.OK,
			});
			return;
		}

		if(depot.goods_capacity_in.length == 0 || depot.goods_capacity_in.length == 0) {
			Ext.getCmp('maintab2').unmask();
                 	Ext.Msg.alert({
				title: 'Внимание',
				message: 'Не заполнены данные по емкости товаров главного депо!',
				buttons: Ext.Msg.OK,
			});
			return;
		}

		var uses = 0;
		for(var i=1; i < depot.goods_capacity_out.length; i++){
			if (depot.goods_capacity_out[i].in_use){
				uses++;
			}
		}

		if (uses == 0) {
			Ext.getCmp('maintab2').unmask();
                 	Ext.Msg.alert({
				title: 'Внимание',
				message: 'Не отмечены для использования строки по емкости товаров (отгрузка) главного депо!',
				buttons: Ext.Msg.OK,
			});
			return;
		}

		uses = 0;

		for(var i=1; i < depot.goods_capacity_in.length; i++){
			if (depot.goods_capacity_in[i].in_use){
				uses++;
			}
		}

		if (uses == 0) {
			Ext.getCmp('maintab2').unmask();
                 	Ext.Msg.alert({
				title: 'Внимание',
				message: 'Не отмечены для использования строки по емкости товаров (возврат) главного депо!',
				buttons: Ext.Msg.OK,
			});
			return;
		}

		var autos = [];
		var autosIds = [];

		var rejectedOrders = [];
		var storeAutos = Ext.getStore('Auto2');
                var strEmptyClientGroups = '';

		for (var i = 0; i < storeAutos.count(); i++) {
			var recordAuto = storeAutos.getAt(i);
			if (recordAuto.get("in_use")) {
				autosIds.push(recordAuto.get('id'));
			}
			var allowedClientGroups = recordAuto.get("allowed_clientgroups");

			if (allowedClientGroups.length == 0) {
				strEmptyClientGroups = strEmptyClientGroups + recordAuto.get("name") + '<br />';
			}
        	}

		if (autosIds.length == 0) {
			Ext.getCmp('maintab2').unmask();
			Ext.Msg.alert({
				title: 'Внимание',
				message: 'Нет машин для распределения!',
				buttons: Ext.Msg.OK,
			});
			return;
		}
		
		if (strEmptyClientGroups.length != 0) {
			Ext.getCmp('maintab2').unmask();
			Ext.Msg.alert({
				title: 'Внимание',
				message: 'По этим машинам пустой список доступных групп клиентов! <br />' + strEmptyClientGroups,
				buttons: Ext.Msg.OK,
			});
			return;
		}

		//***********************************************
		// проверка заправки
		//***********************************************
		var refuelmode = Ext.getCmp('formparamtab2refuelmode').getValue();		
		var fuelStationStore = Ext.getStore("FuelStations");

		if (refuelmode > 0 && fuelStationStore.couunt == 0) { 
			Ext.getCmp('maintab2').unmask();
	                Ext.Msg.alert({
				title: 'Внимание',
				message: 'Список заправок пуст!',
				buttons: Ext.Msg.OK,
			});
			return;
		}

		if (refuelmode == 1) {
			var autosWithFirstFuelStation = [];
			for (var i = 0; i < storeAutos.count(); i++) {
				var recordAuto = storeAutos.getAt(i);
				if (recordAuto.get("in_use") && recordAuto.get("fuel_first_station") != '0') {
					autosWithFirstFuelStation.push(recordAuto.get('id'));
				}
        		}	

			if (autosWithFirstFuelStation.length == 0) {
				Ext.getCmp('maintab2').unmask();
	                        Ext.Msg.alert({
					title: 'Внимание',
					message: 'Нет машин, отмеченных '
					+ '<div style="display: inline-block; height: 14px; width: 16px; background: url(css/images/gas_station_16x16.png) no-repeat;"></div><br />' 
					+ 'для расчета заправок!',
					buttons: Ext.Msg.OK,
				});
				return;
			}
		}

		if (refuelmode==2) {
			if (fuelStationStore.count()==0) {
				Ext.getCmp('maintab2').unmask();
	                        Ext.Msg.alert({
					title: 'Внимание',
					message: 'Пустой список заправок!',
					buttons: Ext.Msg.OK,
				});
				return;
			}

			var inUseCount = 0;
			fuelStationStore.each(function(record){
				if(record.get("in_use")){
					inUseCount++;
				}
			});

			if (inUseCount == 0) {
				Ext.getCmp('maintab2').unmask();
	                        Ext.Msg.alert({
					title: 'Внимание',
					message: 'Нет заправок, отмеченных для расчета!',
					buttons: Ext.Msg.OK,
				});
				return;
			}

			var autosCheckedForRefuel = [];
			var storeAutos = Ext.getStore('Auto2');
			for (var i = 0; i < storeAutos.count(); i++) {
				var recordAuto = storeAutos.getAt(i);
				if (recordAuto.get("in_use") && recordAuto.get("fuel_refuel_by_rate")) {
					autosCheckedForRefuel.push(recordAuto.get('id'));
				}
        		}	

			if (autosCheckedForRefuel.length == 0) {
				Ext.getCmp('maintab2').unmask();
	                        Ext.Msg.alert({
					title: 'Внимание',
					message: 'Нет машин, отмеченных '
					+ '<div style="display: inline-block; height: 14px; width: 16px; background: url(css/images/gas_station_16x16.png) no-repeat;"></div><br />' 
					+ 'для расчета заправок по расходу!',
					buttons: Ext.Msg.OK,
				});
				return;
			}
		}

		var storeOrders = this.ordersStore;
		var ordersCheckArr = [];
		for (var i = 0; i < storeOrders.count(); i++) {
			var recordOrder = storeOrders.getAt(i);
			if (recordOrder.get("in_use")) {
				ordersCheckArr.push(recordOrder.get("id"));

				if (recordOrder.get("timewindow_begin") > recordOrder.get("timewindow_end")) {
					Ext.getCmp('maintab2').unmask();
					Ext.Msg.alert({
						title: 'Внимание',
						message: 'Есть заказы c неверно установленным окном времени',
						buttons: Ext.Msg.OK,
					});
					return;			
				}

				var allowedAutos = recordOrder.get("allowed_autos");
				var allowedAutosIds = [];
				for (var j = 0; j < allowedAutos.length; j++) {
					if (allowedAutos[j].in_use) {
						allowedAutosIds.push(allowedAutos[j].id);
					}
				}

				if (allowedAutosIds.length > 0) {  // если есть выбранные допустимые машины
					//****************************************************************
					// проверка - если список допустимых машин вообще не имеет ни одной машины из списка выбранных машин,

					var intArr = intersect(autosIds, allowedAutosIds);
					if (intArr.length == 0) {
						rejectedOrders.push(recordOrder);
						continue;
					}
				}
			}
		}

		if (ordersCheckArr.length == 0){
			Ext.getCmp('maintab2').unmask();
			Ext.Msg.alert({
				title: 'Внимание',
				message: 'Нет заказов для распределения!',
				buttons: Ext.Msg.OK,
			});
			return;
		}

		if (rejectedOrders.length > 0) {
			Ext.getCmp('maintab2').unmask();
			var alertDialog = Ext.create('Opt.view.dialog.OrderListAlert');
			alertDialog.down('gridpanel').store.loadData(rejectedOrders);
			alertDialog.show().focus();
			return;
		}

		if (Ext.getCmp('formparamtab2useGLS').getValue() == true) {
			Ext.Msg.show({
				title: 'Внимание',
				message: 'Установлен флаг локального поиска. Продолжить?',
				buttons: Ext.Msg.YESNO,
				icon: Ext.Msg.QUESTION,
				fn: function (btn) {
					if (btn === 'yes') {
						self.checkDestinations();
					} else if (btn === 'no') {
						Ext.getCmp('maintab2').unmask();
						return;
					}
				}
			});
		} else {
			this.checkDestinations();
		}
	},

	sendForDistributeOrders: function(){
		var depot = Ext.clone(Opt.app.getMainDepot().data);
		delete depot.id;

		clearStore('tab2routesgrid');
		clearStore('tab2droppedgrid');

		this.fireEvent('tab2droppedgridsettitle');
		this.fireEvent('tab2routesgridsetstat', null);
		this.fireEvent('tab2routesgridsetparams', null);
		Ext.getCmp('tab2droppedgrid').collapse();

		var form = Ext.getCmp('formparamtab2');
		var formVal = form.getForm().getFieldValues();

		var orders_date = formVal.solvedate;
		var time_waiting = formVal.maxslacktime;
		var max_orders_in_route = formVal.maxordersinroute;
		var refuel_mode = formVal.refuelmode;
		var refuel_full_tank = formVal.refuel_full_tank;
		var use_guided_local_search = formVal.useGLS;
		var solution_strategy = formVal.solutionstrategy;
		var fixed_cost_all_vehicles = formVal.fixedcostallvehicles;
		var globalspancoeff_duration = formVal.globalspancoeff_duration;
		var globalspancoeff_distance = formVal.globalspancoeff_distance;
		var softlowerbound_water = formVal.softlowerbound_water;
		var full_load_begin_water = formVal.full_load_begin_water;
		var minimize_time = formVal.minimize_time;

		orders_date = orders_date.replace(/-/g, ''); // для IE 

		var task = {};

		this.currTaskId = Date.now().toString();
		task.id = this.currTaskId;
		task.solve = "distribute_orders";
		task.parameters = {
			depot_index: 0,
			time_limit: formVal.maxsolvetime,
			maximum_time_per_vehicle: 24 * 60 * 60, // 12 часов
			orders_date: orders_date,
			time_waiting: time_waiting * 60,
			refuel_mode: refuel_mode,
			refuel_full_tank: refuel_full_tank,
			use_guided_local_search: use_guided_local_search,
			solution_strategy: solution_strategy,
			fixed_cost_all_vehicles: fixed_cost_all_vehicles,
			globalspancoeff_duration: globalspancoeff_duration,
			globalspancoeff_distance: globalspancoeff_distance,
			softlowerbound_water: softlowerbound_water,
			full_load_begin_water: full_load_begin_water,
			minimize_time: minimize_time,
		};

		task.error = "";

		var orders = [];
		var autos = [];
		var unloading_goods = [];
		var loading_goods = [];
		var data = {};

		//********************************************
		// ЗАКАЗЫ
		//********************************************
		var storeOrders = this.ordersStore;

		orders.push(depot);

		for (var i = 0; i < storeOrders.count(); i++) {
			var recordOrder = storeOrders.getAt(i);
			if (recordOrder.get("in_use")) {
				var allowedAutos = recordOrder.get("allowed_autos");
				var count = allowedAutos.length;
				var deepCopy = $.extend(true, {}, recordOrder.data);

				if (count > 0) {
					var parsedAutos = [];
					for (var j = 0; j < allowedAutos.length; j++) {
						if (allowedAutos[j].in_use) {
							parsedAutos.push(allowedAutos[j]);
						}
					}

					deepCopy.allowed_autos = parsedAutos;
				}
				orders.push(deepCopy);
			}
		}

		//********************************************
		// МАШИНЫ + Заправки + добавление фейковых заказов + locked route
		//********************************************
		var storeAutos = Ext.getStore('Auto2');
		var useAutosCost = false;

                var refuelmode = Ext.getCmp('formparamtab2refuelmode').getValue();		
		var fuelStationStore = Ext.getStore("FuelStations");

		for (var i = 0; i < storeAutos.count(); i++) {
			var recordAuto = storeAutos.getAt(i);
			if (recordAuto.get("in_use")) {
				var autoIns = recordAuto.data;

		                if (refuelmode == 1) { 
					var locked_route = [];
					if (recordAuto.get("fuel_first_station") != '0') {
						var fuelStationId = recordAuto.get("fuel_first_station");
						var fuelStation = fuelStationStore.findRecord("klient_id", fuelStationId);

						if (fuelStation){
							var deepCopy = $.extend(true, {}, fuelStation.data);					
							//deepCopy.klient_group_id = 'fuel_stations';
							deepCopy.node_type = 3;
							deepCopy.order_date = orders_date;
							deepCopy.order_id = fuelStationId;
							deepCopy.order_number = fuelStationId;
							deepCopy.tanks_replace_needed = false;
       		 					deepCopy.tanks_replace_count = 0;
							deepCopy.dop = "Заправка перед рейсом";
							deepCopy.penalty = 0; // в минутах!
							deepCopy.strings = [];
							deepCopy.unloading_goods = [];
							deepCopy.loading_goods = [];
							var allowedAutos = 
							{
								in_use: true,
								id: recordAuto.get("id"),
								name: recordAuto.get("name"),
							};
							deepCopy.allowed_autos = [allowedAutos];						
							deepCopy.allowed_autos_backup = [allowedAutos];
							orders.push(deepCopy);						
					
							locked_route.push(orders.length-1);
						}
					}
				}

				if (refuelmode == 2 ) {  // заправка по расходу
					if (recordAuto.get("fuel_refuel_by_rate")) {
						// добавляем  машине все заправки
						for (var j = 0; j < fuelStationStore.count(); j++) {
							var fuelStation = fuelStationStore.getAt(j);
       		         				if (fuelStation && fuelStation.get("in_use") && (fuelStation.get("gas") == recordAuto.get("fuel_gas"))){
								var deepCopy = $.extend(true, {}, fuelStation.data);					
								//deepCopy.klient_group_id = 'fuel_stations';
								deepCopy.node_type = 3;
								deepCopy.order_date = orders_date;
								deepCopy.order_id = fuelStationId;
								deepCopy.order_number = fuelStationId;
								deepCopy.tanks_replace_needed = false;
       								deepCopy.tanks_replace_count = 0;
								deepCopy.dop = "Заправка";
								deepCopy.penalty = 0; // в минутах!
								deepCopy.strings = [];
								deepCopy.unloading_goods = [];
								deepCopy.loading_goods = [];
								var allowedAutos = 
								{
									in_use: true,
									id: recordAuto.get("id"),
									name: recordAuto.get("name"),
								};
								deepCopy.allowed_autos = [allowedAutos];						
								deepCopy.allowed_autos_backup = [allowedAutos];
								orders.push(deepCopy);						
							}
						}

					} else {
						autoIns.fuel_balance_begin = 999;
						autoIns.fuel_tank_capacity = 999;
					}
				}
				autoIns.locked_route = locked_route;
				autos.push(autoIns);
			}
		}

		//***********************************************************
		// Добавление фейковых депо
		//***********************************************************
		for (var i = 0; i < storeAutos.count(); i++) {
			var recordAuto = storeAutos.getAt(i);
			if (recordAuto.get("in_use") && recordAuto.get("maxraces") > 1) {
				var uu = 0;
				for (var j = 1; j < recordAuto.get("maxraces"); j++) {
					var deepCopy = $.extend(true, {}, depot);				 	
					deepCopy.node_type = 4;
					deepCopy.order_date = orders_date;
					deepCopy.order_id = '';
					deepCopy.order_number = '';
					deepCopy.tanks_replace_needed = false;
	 				deepCopy.tanks_replace_count = 0;
					deepCopy.service_time = recordAuto.get("race_breaking_time") * 60;
					deepCopy.penalty = 0; // в минутах!
					deepCopy.strings = [];
					deepCopy.unloading_goods = [];
					deepCopy.loading_goods = [];
					var allowedAutos = 
					{
						in_use: true,
						id: recordAuto.get("id"),
						name: recordAuto.get("name"),
					};
					deepCopy.allowed_autos = [allowedAutos];						
					deepCopy.allowed_autos_backup = [allowedAutos];
					orders.push(deepCopy);
					uu++;
				}
				//console.log("Машина " + recordAuto.get("name") + " добавлено " + uu);
			}
		}

		//********************************************
		// ТОВАРЫ
		//********************************************
		var storeUnloadingGoods = Ext.getStore('OrdersUnloadingGoodsStore');
		for (var i = 0; i < storeUnloadingGoods.count(); i++) {
			var recordUnloadingGoods = storeUnloadingGoods.getAt(i);
			var deepCopy = $.extend(true, {}, recordUnloadingGoods.data);
			deepCopy.kolvo = 0;
			unloading_goods.push(deepCopy);
		}

		data.autos = autos;
		data.orders = orders;
		data.goods = unloading_goods;

		task.data = data;

		this.startTimerMask();

		console.log(task);
		if (Opt.app.socket.readyState && Opt.app.socket.readyState == 1) {
			Opt.app.socket.send(JSON.stringify(task));
		} else {
			this.stopTimerMask();
			Opt.app.showError("Ошибка!","Нет соединения с сервером!");
			console.log(Opt.app.socket.readyState);
		}
	},

	sendDataToServer: function () {
		Ext.getCmp('maintab2').unmask();
		var mode = Ext.getCmp('distordersmode').getValue();

		if (mode == 0) {
			this.fireEvent('tab2routesgridsettitle');
			this.sendForDistributeOrders();
			return;
		}
	/*
		if (mode == 1) {
			this.sendForAddingOrders();
			return;
		}
	*/
	},

	sendData: function () {
		var self = this;
		var mode = Ext.getCmp('distordersmode').getValue();

		if (!Opt.app.socket || Opt.app.socket.OPEN != 1) {
			Ext.Msg.alert("Внимание!", "Нет соединения с сервером!");
			return;
		}

		if (this.ordersStore.count() == 0) {
			Ext.Msg.alert({
				title: 'Внимание!',
				message: 'Таблица заказов пуста!',
				buttons: Ext.Msg.OK,
			});
			return;
		}


		if (this.ordersStore.isFiltered()) {
			Ext.Msg.alert({
				title: 'Внимание!',
				message: 'На таблице "Заказы" установлен фильтр! <br />Отключите его перед началом расчета!',
				buttons: Ext.Msg.OK,
			});
			return;
		}

		if (mode == 0) {  // создание
			var storeRoutes = Ext.getCmp('tab2routesgrid').store;
			if (storeRoutes.count() > 0) {
				Ext.Msg.show({
					title: 'Внимание',
					message: 'Таблица  маршрутов будет очищена. Продолжить?',
					buttons: Ext.Msg.YESNO,
					icon: Ext.Msg.QUESTION,
					fn: function (btn) {
						if (btn === 'yes') {
							self.checkDataBeforeSend();
						} else if (btn === 'no') {
							return;
						}
					}
				});
			} else {
				self.checkDataBeforeSend();
			}
			return;
		}

		if (mode == 1) {  // дополнение
			var storeRoutes = Ext.getCmp('tab2routesgrid').store;
			if (storeRoutes.count() == 0) {
				Ext.Msg.alert("Ошибка!", "Таблица маршрутов пуста!");
				return;
			}

			storeRoutes.filterBy(function (record) {
				if (record.get('in_use')) return true;
			});

			var checkedRoutesCount = storeRoutes.count();

			storeRoutes.clearFilter();
			storeRoutes.remoteFilter = false;
			storeRoutes.filter();

			if (checkedRoutesCount == 0) {
				Ext.Msg.alert("Ошибка!", "Нет отмеченных для дополнения маршрутов!");
				return;
			}

			this.sendDataToServer();
			return;
		}
	},

	distributed_orders_recieved: function (data) {
console.log(data);
		var self = this;
		if (data.id != this.currTaskId) return;

		if (data.error != 'OK') {
			Opt.app.showError('Ошибка!', data.error);
			return;
		}
		var storeRoutes = Ext.getCmp('tab2routesgrid').store;

		if (data.routes.length > 0) {
			var routesData = [];
			for (var i = 0; i < data.routes.length; i++){
				var record = data.routes[i];
				record.in_use = true;
				record.auto_name = record.auto.name;
				record.auto_name_short = record.auto.name_short;
				record.auto_id = record.auto.id;
				record.water = record.auto.water;
				record.bottle = record.auto.bottle;
				record.tank = record.auto.tank;
				record.ordersCount = record.orders.length - 2;
				routesData.push(record);
			}
			storeRoutes.suspendEvents();
			storeRoutes.loadData(routesData);
			storeRoutes.sync();
			storeRoutes.resumeEvents();
			Ext.getCmp('tab2routesgrid').view.refresh();
		}

		if (data.dropped_orders.length > 0) {
			var storeDroppedOrders = Ext.getCmp('tab2droppedgrid').store;

			var orderGrid = Ext.getCmp("tab2ordersgrid");
			var arrOrders = [];
			for (var i = 0; i < data.dropped_orders.length; i++){
				var record = data.dropped_orders[i];
				var orderId = record.order_id;
				var orderIndex = orderGrid.store.find("order_id", orderId);
				var orderRecord = orderGrid.store.getAt(orderIndex);
				arrOrders.push(orderRecord)
			};

			storeDroppedOrders.suspendEvents();
			storeDroppedOrders.loadData(arrOrders);
			storeDroppedOrders.sync();
			storeDroppedOrders.resumeEvents();

			if (storeDroppedOrders.count()>0) Ext.getCmp('tab2droppedgrid').expand();

			Ext.getCmp('tab2droppedgrid').view.refresh();
			
			this.fireEvent('tab2droppedgridsettitle');
		} else {
			this.fireEvent('tab2droppedgridsettitle');
		}

		if (data.unloading_goods.length > 0) {
			var unloadingGoodsStore = Ext.getStore('RoutesUnloadingGoodsStore');

			var unloadingGoodsData = [];
			for (var i = 0; i < data.unloading_goods.length; i++){
				var record = data.unloading_goods[i];
				if (record.kolvo > 0) {
					unloadingGoodsData.push(record);
				}
			}
			unloadingGoodsStore.suspendEvents();
			unloadingGoodsStore.loadData(unloadingGoodsData);
			unloadingGoodsStore.sync();
			unloadingGoodsStore.resumeEvents();
			unloadingGoodsStore.fireEvent('load');
		}

		if (data.loading_goods.length > 0) {
			var loadingGoodsStore = Ext.getStore('RoutesLoadingGoodsStore');

			var loadingGoodsData = [];
			for (var i = 0; i < data.loading_goods.length; i++){
				var record = data.loading_goods[i];
				if (record.kolvo > 0) {
					loadingGoodsData.push(record);
				}
			}
			loadingGoodsStore.suspendEvents();
			loadingGoodsStore.loadData(loadingGoodsData);
			loadingGoodsStore.sync();
			loadingGoodsStore.resumeEvents();
			loadingGoodsStore.fireEvent('load');
		}

		if (data.dropped_goods.length > 0) {
			var goodsStore = Ext.getStore('DroppedGoodsStore');

			var goodsData = [];
			for (var i = 0; i < data.dropped_goods.length; i++){
				var record = data.dropped_goods[i];
				if (record.kolvo > 0) {
					goodsData.push(record);
				}
			}
			goodsStore.suspendEvents();
			goodsStore.loadData(goodsData);
			goodsStore.sync();
			goodsStore.resumeEvents();
			goodsStore.fireEvent('load');
		}

		var logStore = Ext.getStore('CalcLog'); 
		var calc_stat = data.calc_stat;
		var calc_params = data.calc_params;
		var user = Opt.app.getUser();
		calc_stat.user_id = user.id; 
		calc_stat.calc_type = data.solve;
		calc_stat.host_name = Opt.app.user.data.host_name;
		calc_stat.host_addr = Opt.app.user.data.host_ip;
		var newRecord = Ext.create('Opt.model.CalcLog', Object.assign(calc_stat, calc_params));
		logStore.add(newRecord);
		logStore.sync();

		var storeTempResults = Ext.getStore('TempResults');
		data.stores = {};

		// копируем данные хранилищ
		var depotStore = Opt.app.getMainDepot();
		data.stores.depotStoreData = Ext.clone(Opt.app.getMainDepot().data);

		var storeAuto = Ext.getStore('Auto2');
		data.stores.storeAutoData = Ext.pluck(storeAuto.data.items, 'data');

		var storeOrders = this.ordersStore;
		data.stores.storeOrdersData = Ext.pluck(storeOrders.data.items, 'data');

		var storeDroppedOrders = Ext.getCmp('tab2droppedgrid').store;
		data.stores.storeDroppedOrdersData = Ext.pluck(storeDroppedOrders.data.items, 'data');

		var routesStore = Ext.getCmp('tab2routesgrid').store;
		data.stores.routesStoreData = Ext.pluck(routesStore.data.items, 'data');

		var newRecord = Ext.create('Opt.model.TempResults', {
			user_id: calc_stat.user_id,
			calc_time: new Date(),
			calc_type: calc_stat.calc_type,
			host_name: calc_stat.host_name,
			host_addr: calc_stat.host_addr,
			data: data,
		});
		storeTempResults.add(newRecord);
		storeTempResults.save();

		var sndFile = 'sfx/alert.mp3';
		setTimeout(function () {
			addAndPlay(sndFile);
		}, 0);

		this.stopTimerMask();
	
		Ext.create('Opt.view.dialog.MessageWindow',{
			renderTo: 'maintab2',
			title: 'Внимание!', 
			message: "Создание маршрутов завершено.<br /> Время расчета: <b>" + calc_stat.calc_time + "</b><br /> Общая длина маршрутов: <b>" + calc_stat.total_distance + "</b> м. <br /> Общая продолжительность: <b>" + secToHHMMSS(calc_stat.total_duration) + "</b>",
		}).show();

		this.fireEvent('tab2routesgridsetstat', calc_stat);
		this.fireEvent('tab2routesgridsetparams', calc_params);
	},

	startTimerMask: function () {
		var form = Ext.getCmp('formparamtab2');
		var formVal = form.getForm().getFieldValues();
		var timerDecr = (formVal.maxsolvetime * 60) - 1;
		var timerIncr = 1;
		Ext.getCmp('maintab2').mask();
		this.timerWindow = Ext.create('Opt.view.dialog.WaitingCalc', {constrainTo: 'maintab2', renderTo:'maintab2', timerDecr: timerDecr, timerIncr: timerIncr});
		this.timerWindow.show();
	},

	stopTimerMask: function () {
		if (this.timerWindow) {
			this.timerWindow.destroy();
		}
		Ext.getCmp('maintab2').unmask();
	},

	clearStores: function () {
		Ext.getStore('TempResults').removeAll();
		clearStore('tab2ordersgrid');
		clearStore('tab2routesgrid');
		clearStore('tab2droppedgrid');

		clearStore('DroppedGoodsStore');
		clearStore('OrdersUnloadingGoodsStore');
		clearStore('OrdersLoadingGoodsStore');
		clearStore('RoutesUnloadingGoodsStore');
		clearStore('RoutesLoadingGoodsStore');

		this.fireEvent('tab2routesgridsetstat', null);
		this.fireEvent('tab2routesgridsetparams', null);
		this.fireEvent('tab2routesgridsettitle');
		this.fireEvent('tab2droppedgridsettitle');
		this.fireEvent('tab2ordergridsettitle');
	},

	clearData: function () {
		var self = this;
		if (this.ordersStore.count() > 0) {
			Ext.Msg.show({
				title: 'Внимание',
				message: 'Таблицы заказов и маршрутов будут очищены. Продолжить?',
				buttons: Ext.Msg.YESNO,
				icon: Ext.Msg.QUESTION,
				fn: function (btn) {
					if (btn === 'yes') {
						self.clearStores();
					} else if (btn === 'no') {
						return;
					}
				}
			});
		}
	},

	serverDisconnect: function () {
		this.stopTimerMask();
	},

	onChangeInUse: function (checkbox, newValue, oldValue, eOpts) {
		var form = this.lookupReference('formorderstab2');

		if (!form) return;
		var formF = form.getForm();
		var values = formF.getValues();

		if (newValue && values.not_in_use) {
			formF.setValues({
				not_in_use: false
			});
		};
	},

	onChangeNotInUse: function (checkbox, newValue, oldValue, eOpts) {
		var form = this.lookupReference('formorderstab2');
		if (!form) return;
		var formF = form.getForm();
		var values = formF.getValues();

		if (newValue && values.in_use) {
			formF.setValues({
				in_use: false,
			});
		};
	},

	adding_orders_recieved: function(data) {
		console.log(data);
		var self = this;
		if (data.id != this.currTaskId) return;

		if (data.error != 'OK') {
			Opt.app.showError('Ошибка!', data.error);
			return;
		}

		var storeRoutes = Ext.getCmp('tab2routesgrid').store;

		if (data.routes.length > 0) {
			var routesData = [];
			for (var i = 0; i < data.routes.length; i++){
			        // при отправке мы присвоили машине id маршрута
				// теперь мы по id машины найдем маршрут
				var currRoute = data.routes[i];
				var id = currRoute.id;
				//var id = currRoute.auto.id;
				var storeIndex = storeRoutes.find("id", id);
				var routeRecord = storeRoutes.getAt(storeIndex);
				if (routeRecord) {
					routeRecord.beginEdit();
					routeRecord.set('route_begin_calc', currRoute.route_begin_calc);
					routeRecord.set('route_end_calc', currRoute.route_end_calc);
					routeRecord.set('distance', currRoute.distance);
					routeRecord.set('duration', currRoute.duration);
					routeRecord.set('durationFull', currRoute.durationFull);
					routeRecord.set("orders", currRoute.orders);
					routeRecord.set("unloading_goods", currRoute.unloading_goods);
					routeRecord.set("loading_goods", currRoute.loading_goods);
               				routeRecord.set("ordersCount", currRoute.orders.length - 2);
					routeRecord.commit();
				} else {
					console.error(currRoute); 
				}
			}
		}

		if (data.droppedOrders.length > 0) {
			var storeDroppedOrders = Ext.getCmp('tab2droppedgrid').store;
			var orderGrid = Ext.getCmp("tab2ordersgrid");

			var arrOrders = [];

			for (var i = 0; i < data.droppedOrders.length; i++){
				var record = data.droppedOrders[i];
				var orderId = record.order_id;
				var orderIndex = orderGrid.store.find("order_id", orderId);
				if (orderIndex != -1) {
					var orderRecord = orderGrid.store.getAt(orderIndex);
					arrOrders.push(orderRecord);
				}
			};

			storeDroppedOrders.loadData(arrOrders);
			this.fireEvent('tab2droppedgridsettitle');
			Ext.getCmp('tab2droppedgrid').expand();
		} else {
			this.fireEvent('tab2droppedgridsettitle');
		}

		if (data.unloading_goods.length > 0) {
			var unloadingGoodsStore = Ext.getStore("RoutesUnloadingGoodsStore");
			var unloadingGoodsData = [];
			for (var i = 0; i < data.unloading_goods.length; i++){
				var record = data.unloading_goods[i];
				if (record.kolvo > 0) {
					unloadingGoodsData.push(record);
				}
			}
			unloadingGoodsStore.loadData(unloadingGoodsData);
			unloadingGoodsStore.fireEvent('load');
		}

		if (data.loading_goods.length > 0) {
			var loadingGoodsStore = Ext.getStore("RoutesLoadingGoodsStore");
			var loadingGoodsData = [];
			for (var i = 0; i < data.loading_goods.length; i++){
				var record = data.loading_goods[i];
				if (record.kolvo > 0) {
					loadingGoodsData.push(record);
				}
			}
			loadingGoodsStore.loadData(loadingGoodsData);
			loadingGoodsStore.fireEvent('load');
		}

		if (data.droppedGoods.length > 0) {
			var goodsStore = Ext.getStore("DroppedGoodsStore");
			var goodsData = [];
			for (var i = 0; i < data.droppedGoods.length; i++){
				var record = data.droppedGoods[i];
				if (record.kolvo > 0) {
					goodsData.push(record);
				}
			}
			goodsStore.loadData(goodsData);
			goodsStore.fireEvent('load');
		}

		var logStore = Ext.getStore('CalcLog'); 
		var stat = data.stat;
		var user = Opt.app.getUser();
		stat.user_id = user.id; 
		stat.calc_type = data.solve;
		var newRecord = Ext.create('Opt.model.CalcLog', stat);
		logStore.add(newRecord);
		logStore.sync();
		
		this.stopTimerMask();

		var sndFile = 'sfx/alert.mp3';
		setTimeout(function () {
			addAndPlay(sndFile);
		}, 0);

		this.setRoutesGridTitle(stat);

		Ext.create('Opt.view.dialog.MessageWindow',{
			renderTo: 'maintab2',
			title: 'Внимание!', 
			message: "Создание маршрутов завершено.<br /> Время расчета: <b>" + stat.calc_time + "</b><br /> Общая длина маршрутов: <b>" + stat.total_distance + "</b> м. <br /> Общая продолжительность: <b>" + secToHHMMSS(stat.total_duration) + "</b>",
		}).show();
	},

	distributed_orders_error: function(){
		this.stopTimerMask();
	},

	adding_orders_error: function(){
		this.stopTimerMask();
	},

	breakCalcCommand: function(){
		var mode = Ext.getCmp('distordersmode').getValue();
		var task = {};
		task.id = this.currTaskId;
		task.solve = "break_calc";
		task.parameters = {};
		task.error = "";
		console.log(task);

		if (Opt.app.socket.readyState && Opt.app.socket.readyState == 1) {
			Opt.app.socket.send(JSON.stringify(task));
		} else {
			Opt.app.showError("Ошибка!","Нет соединения с сервером!");
			console.log(Opt.app.socket.readyState);
		}

		this.stopTimerMask();
	},
});