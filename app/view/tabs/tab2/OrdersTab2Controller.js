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
			listeners: {
				load: function (store, records, successful, operation, eOpts) {
					self.setTitle('');
				}
			},

		});

		Ext.getCmp('tab2ordersgrid').setStore(this.ordersStore);
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

				Ext.getCmp('tab2ordersgrid').view.refresh()

				var storeTotals = Ext.getStore('OrdersGoodsStore');
				storeTotals.suspendEvents();
				storeTotals.loadData(respObj.data.goods);
				storeTotals.sync();
				storeTotals.resumeEvents();
				storeTotals.fireEvent('load');
				Ext.getCmp('tab2ordersgrid').unmask();
			},

			failure: function (response) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
				Ext.getCmp('tab2ordersgrid').unmask();
			}
		});
	},

	setTitle: function (filterString) {
		var store = this.ordersStore;
		Ext.getCmp("tab2ordersgrid").setTitle("Заказы (" + store.count() + ")" + filterString);
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
			this.setTitle(" (фильтр)");
		}
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
	},

	clearFilter: function () {
		this.ordersStore.suspendEvents();
		this.ordersStoreFilter = false;
		this.ordersStore.clearFilter();
		this.ordersStore.remoteFilter = false;
		this.ordersStore.filter();
		this.setTitle('');

		this.ordersStore.resumeEvents();
		Ext.getCmp('tab2ordersgrid').view.refresh();
	},

	clearField: function (field, button, e) {
		field.setValue('');
		this.setFilter();
	},
	
	checkDestinations: function(){
		// проверим достижимость точек
		checkedArr = [];

		var depot = Opt.app.getDepot();
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

		if (checkedArr.length > 2) this.checkPointsAvail(checkedArr,300);
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
				} else {
					Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
				}
				Ext.getCmp('maintab2').unmask();
			}
		});
	},

	checkDataBeforeSend: function () {
		Ext.getCmp('maintab2').mask('Проверка данных ...');
		var mode = Ext.getCmp('distordersmode').getValue();

		var depot = Opt.app.getDepot();
                if (!depot) {
			Ext.getCmp('maintab2').unmask();
                 	Ext.Msg.alert({
				title: 'Внимание',
				message: 'Нет данных о депо!',
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
					message: 'При установленном режиме расчета заправок нет машин, <br />отмеченных для расчета с установленными пунктами заправки.',
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

		this.checkDestinations();
	},

	sendForDistributeOrders: function(){
		var depot = Opt.app.getDepot();

		clearStore('tab2routesgrid');
		clearStore('tab2droppedgrid');

		Ext.getCmp('tab2droppedgrid').setTitle("Отброшенные заказы");

		var form = Ext.getCmp('formparamtab2');
		var formVal = form.getForm().getFieldValues();

		var orders_date = formVal.solvedate;
		var time_waiting = formVal.maxslacktime;
		var max_orders_in_route = formVal.maxordersinroute;
		var refuel_mode = formVal.refuelmode;
		var use_guided_local_search = formVal.useGLS;

		orders_date = orders_date.replace(/-/g, ''); // для IE 

		var task = {};

		this.currTaskId = Date.now().toString();
		task.id = this.currTaskId;
		task.solve = "distribute_orders";
		task.parameters = {
			depot_index: 0,
			time_limit: formVal.maxsolvetime,
			maximum_time_per_vehicle: 24 * 60 * 60, // 12 часов
			dateRoutes: orders_date,
			time_waiting: time_waiting * 60,
			max_orders_in_route: max_orders_in_route,
			refuel_mode: refuel_mode,
			use_guided_local_search: use_guided_local_search,
		};

		task.error = "";

		var orders = [];
		var autos = [];
		var goods = [];
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
		// МАШИНЫ + Заправки + добавление фейковых заказов + initial route
		//********************************************
		var storeAutos = Ext.getStore('Auto2');
		var useAutosCost = false;

                var refuelmode = Ext.getCmp('formparamtab2refuelmode').getValue();		

		for (var i = 0; i < storeAutos.count(); i++) {
			var recordAuto = storeAutos.getAt(i);
			var initial_route = [];

	                if (refuelmode == 1) {
				if (recordAuto.get("in_use") && recordAuto.get("fuel_first_station") != '0') {
					var fuelStationId = recordAuto.get("fuel_first_station");
					var fuelStationStore = Ext.getStore("FuelStations");
					var fuelStation = fuelStationStore.findRecord("klient_id", fuelStationId);

					if (fuelStation){
						var deepCopy = $.extend(true, {}, fuelStation.data);					
						//deepCopy.klient_group_id = 'fuel_stations';
						deepCopy.order_date = orders_date;
						deepCopy.order_id = fuelStationId;
						deepCopy.order_number = fuelStationId;
						deepCopy.tanks_replace_needed = false;
        					deepCopy.tanks_replace_count = 0;
						deepCopy.sod = "Заправка перед рейсом";
						deepCopy.penalty = 5; // в минутах!
						deepCopy.strings = [];
						deepCopy.goods = [];
						var allowedAutos = 
						{
							in_use: true,
							id: recordAuto.get("id"),
							name: recordAuto.get("name"),
						};
						deepCopy.allowed_autos = [allowedAutos];						
						deepCopy.allowed_autos_backup = [allowedAutos];
						orders.push(deepCopy);						

						initial_route.push(orders.length-1);
					}
				}
			}

			if (recordAuto.get("in_use")) {
				var autoIns = recordAuto.data;
				autoIns.initial_route = initial_route;
				autos.push(autoIns);
			}

			if (recordAuto.get("cost_k") != 1) {
				useAutosCost = true;
			}
		}

		task.parameters.use_autos_cost = useAutosCost;

		//********************************************
		// ТОВАРЫ
		//********************************************
		var storeGoods = Ext.getStore('OrdersGoodsStore');
		for (var i = 0; i < storeGoods.count(); i++) {
			var recordGoods = storeGoods.getAt(i);
			var deepCopy = $.extend(true, {}, recordGoods.data);
			deepCopy.kolvo = 0;
			goods.push(deepCopy);
		}

		data.autos = autos;
		data.orders = orders;
		data.goods = goods;

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

	sendForAddingOrders: function(){
	        var depot = Opt.app.getDepot();
                if (!depot) {
                 	Opt.showError("Внимание!","Нет данных о депо!");
			return;
		}

		Ext.getCmp('tab2droppedgrid').setTitle("Отброшенные заказы");
		clearStore('tab2droppedgrid');

		var form = Ext.getCmp('formparamtab2');
		var formVal = form.getForm().getFieldValues();

		var orders_date = formVal.solvedate;
		var time_waiting = formVal.maxslacktime;

		orders_date = orders_date.replace(/-/g, ''); // для IE 

		var task = {};

		this.currTaskId = Date.now().toString();
		task.id = this.currTaskId;
		task.solve = "addingorders_toroutes";
		task.parameters = {
			depot_index: 0,
			time_limit: formVal.maxsolvetime,
			maximum_time_per_vehicle: 24 * 60 * 60, // 12 часов
			dateRoutes: orders_date,
			time_waiting: time_waiting * 60,
		};

		task.error = "";

		var orders = [];
		var autos = [];
		var goods = [];
		var data = {};

		orders.push(depot);

		var routesGrid = Ext.getCmp('tab2routesgrid');
		var storeRoutes = routesGrid.store;

		var storeAutos = Ext.getStore('Auto2');

		// получаем массив машин по маршрутным листам
		for (var i = 0; i < storeRoutes.count(); i++) {
			var recordRoute = storeRoutes.getAt(i);
			if (recordRoute.get("in_use")) {
				// ищем машину для этого маршрута
				var routeId = recordRoute.get('id');
				var autoId = recordRoute.get('auto_id');
				var autoIndex = storeAutos.find("id", autoId);
				var autoRecord = storeAutos.getAt(autoIndex);

				// делаем копию записи машины для изменения
				var autoRecordCopy = $.extend(true, {}, autoRecord.data); 

				// заменяем id машины на id маршрута
				autoRecordCopy.trueId = autoRecordCopy.id;
				autoRecordCopy.id = routeId;

		      		// устанавливаем время работы машины по маршрутному листу
				autoRecordCopy.worktime_begin = recordRoute.get('route_begin_plan');
				autoRecordCopy.worktime_end = recordRoute.get('route_end_plan');
				autoRecordCopy.route_begin_endtime = recordRoute.get('route_end_plan');
				autoRecordCopy.route_end_endtime = recordRoute.get('route_end_plan');
				// устанавливаем водителя по маршрутному листу
				autoRecordCopy.driver_id = recordRoute.get('driver_id');
				autoRecordCopy.driver_name = recordRoute.get('driver_name');
				autos.push(autoRecordCopy);
			}
		}

		var swap_orders = Ext.getCmp('tab2allowswaporders').getValue();

		// обрабатываем заказы В МАРШРУТЕ
		for (var i = 0; i < storeRoutes.count(); i++) {
			var recordRoute = storeRoutes.getAt(i);
			if (recordRoute.get("in_use")) {
				// обрабатываем заказы, уже находящиеся в маршруте (из бэкапа)
				var ordersInRoute = recordRoute.data.orders_backup;
				for (var j = 0; j < ordersInRoute.length; j++) {
					var order = ordersInRoute[j];
					if (order.node_type != 0){
						// делаем копию заказа для изменения
						var orderCopy = $.extend(true, {}, order); 
						orderCopy.isAdded = false;
						orderCopy.allowed_autos_backup = [];

						if (swap_orders) {
							// обмен разрешен - задаем в качестве допустимых все машины маршрутов
							for (var t = 0; t < autos.length; t++){
								orderCopy.allowed_autos_backup.push({in_use: true, id: autos[t].id, name: autos[t].name});
							}
						} else {
							// обмен не разрешен - устанавливаем единственной допустимой машиной id маршрута
							// вне зависимости от того, были ли для данного заказа вообще установлены допустимые машины
							orderCopy.allowed_autos_backup.push({in_use: true, id: recordRoute.id, name: 'fake auto'});
						}

						//orderCopy.penalty = 12*60*60;
						orders.push(orderCopy);
					}
				}
			}
		}

		var storeOrders = this.ordersStore;

		// обрабатываем распределяемые заказы
		for (var i = 0; i < storeOrders.count(); i++) {
			var recordOrder = storeOrders.getAt(i);
			if (recordOrder.get("in_use")) {
				var deepCopy = $.extend(true, {}, recordOrder.data);
				var allowedAutos = deepCopy.allowed_autos;
				var parsedAutos = [];

				deepCopy.isAdded = true;

				// заменяем машину из списка допустимых на соответствующие идентификаторы маршрута
				// т.е. Мерс1 на Маршрут1 и Маршрут2
				if (allowedAutos.length > 0) {
					for (var j = 0; j < allowedAutos.length; j++) {
						if (allowedAutos[j].in_use) {
							for (var k = 0; k < autos.length; k++) {
								if (autos[k].trueId == allowedAutos[j].id) {
			                                                parsedAutos.push({in_use: true, id: autos[k].id, name: 'fake auto'});
								}
							}
						}
					}

				}
				deepCopy.allowed_autos_backup = parsedAutos;
				orders.push(deepCopy);
			}
		}

		if (orders.length < 2) {
			Ext.Msg.alert({
				title: 'Внимание',
				message: 'Нет заказов для распределения!',
				buttons: Ext.Msg.OK,
			});
			return;
		}

		// объединяем перечень товаров: из заказов и маршрутов
		var unionArr = [];
		var storeOrdersGoods = Ext.getStore('OrdersGoodsStore');
		for (var i = 0; i < storeOrdersGoods.count(); i++) {
			var recordOrderGoods = storeOrdersGoods.getAt(i);
			var recordOrderGoodsCopy = $.extend(true, {}, recordOrderGoods.data); 
			recordOrderGoodsCopy.kolvo = 0;
			unionArr.push(recordOrderGoodsCopy);
		}

		var storeRoutesGoods = Ext.getStore('RoutesGoodsStore');
		for (var i = 0; i < storeRoutesGoods.count(); i++) {
			var recordRoutesGoods = storeRoutesGoods.getAt(i);
			// получаем id текущей записи goods маршрутов
			var goodsId = recordRoutesGoods.get('id');
			var orderGoodsIndex = storeOrdersGoods.find("id", goodsId);
			var recordOrderGoods = storeOrdersGoods.getAt(orderGoodsIndex);
			// если записи заказов с таким id не найдено, добавляем запись маршрутов в массив
			if (!recordOrderGoods) {
				var recordRoutesGoodsCopy = $.extend(true, {}, recordRoutesGoods.data); 
				recordRoutesGoodsCopy.kolvo = 0;
				unionArr.push(recordRoutesGoodsCopy);
			}
		}

		data.autos = autos;
		data.orders = orders;
		data.goods = unionArr;

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
			Ext.getCmp('tab2routesgrid').setTitle("Маршрутные листы");
			this.sendForDistributeOrders();
			return;
		}

		if (mode == 1) {
			this.sendForAddingOrders();
			return;
		}
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
				record.auto_id = record.auto.id;
				record.ordersCount = record.orders.length - 2;
				routesData.push(record);
			}
			storeRoutes.suspendEvents();
			storeRoutes.loadData(routesData);
			storeRoutes.sync();
			storeRoutes.resumeEvents();
			Ext.getCmp('tab2routesgrid').view.refresh();
		}

		if (data.droppedOrders.length > 0) {
			var storeDroppedOrders = Ext.getCmp('tab2droppedgrid').store;

			var orderGrid = Ext.getCmp("tab2ordersgrid");
			var arrOrders = [];
			for (var i = 0; i < data.droppedOrders.length; i++){
				var record = data.droppedOrders[i];
				var orderId = record.order_id;
				var orderIndex = orderGrid.store.find("order_id", orderId);
				var orderRecord = orderGrid.store.getAt(orderIndex);
				arrOrders.push(orderRecord)
			};

			Ext.getCmp('tab2droppedgrid').expand();
			storeDroppedOrders.suspendEvents();
			storeDroppedOrders.loadData(arrOrders);
			storeDroppedOrders.sync();
			storeDroppedOrders.resumeEvents();
			Ext.getCmp('tab2droppedgrid').view.refresh();
			
			Ext.getCmp('tab2droppedgrid').setTitle("Отброшенные заказы (" + storeDroppedOrders.count() + ")");
		} else {
			Ext.getCmp('tab2droppedgrid').setTitle("Отброшенные заказы");
		}

		if (data.goods.length > 0) {
			var goodsStore = Ext.getStore('RoutesGoodsStore');

			var goodsData = [];
			for (var i = 0; i < data.goods.length; i++){
				var record = data.goods[i];
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

		if (data.droppedGoods.length > 0) {
			var goodsStore = Ext.getStore('DroppedGoodsStore');

			var goodsData = [];
			for (var i = 0; i < data.droppedGoods.length; i++){
				var record = data.droppedGoods[i];
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
		var stat = data.stat;
		var user = Opt.app.getUser();
		stat.user_id = user.id; 
		stat.calc_type = data.solve;
		stat.host_name = Opt.app.user.data.host_name;
		stat.host_addr = Opt.app.user.data.host_ip;
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

	setRoutesGridTitle: function(stat){
		Ext.getCmp('tab2routesgrid').setTitle('Маршрутные листы (<span title="Общее количество">' + stat.routes_count + '</span>) <span title="Сумма длин всех маршрутов">' + stat.total_distance + ' м.</span>, <span title="Сумма продолжительностей всех маршрутов">' + secToHHMMSS(stat.total_duration) + '</span>, заказов (' + stat.orders_routes_count + ')');
	},

	startTimerMask: function () {
		var form = Ext.getCmp('formparamtab2');
		var formVal = form.getForm().getFieldValues();
		var timerDecr = formVal.maxsolvetime * 60 + 5;
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
		clearStore('tab2ordersgrid');
		clearStore('tab2routesgrid');
		clearStore('tab2droppedgrid');

		clearStore('DroppedGoodsStore');
		clearStore('OrdersGoodsStore');
		clearStore('RoutesGoodsStore');

		Ext.getCmp('tab2routesgrid').setTitle("Маршрутные листы");
		Ext.getCmp('tab2droppedgrid').setTitle("Отброшенные заказы");
		Ext.getCmp("tab2ordersgrid").setTitle("Заказы");
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
					routeRecord.set("goods", currRoute.goods);
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
			Ext.getCmp('tab2droppedgrid').setTitle("Отброшенные заказы (" + storeDroppedOrders.count() + ")");
			Ext.getCmp('tab2droppedgrid').expand();
		} else {
			Ext.getCmp('tab2droppedgrid').setTitle("Отброшенные заказы");
		}

		if (data.goods.length > 0) {
			var goodsStore = Ext.getStore("RoutesGoodsStore");
			var goodsData = [];
			for (var i = 0; i < data.goods.length; i++){
				var record = data.goods[i];
				if (record.kolvo > 0) {
					goodsData.push(record);
				}
			}
			goodsStore.loadData(goodsData);
			goodsStore.fireEvent('load');
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