Ext.define('Opt.view.tabs.tab1.MenuTab1Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menutab1controller',
	diffDistanceToolTip: null,
	currTaskId: null,
	isOpt: false,
	arrP: [],
	ordersStore: null,
	droppedOrdersStore: null,
	routelistStore: null,
	routeLegsStore: null,
	processingMask: null,
	penaltyTime: null,
	rendered: false,
	listen: {
		controller: {
			'*': {
				serverDisconnect: 'onServerDisconnect',
				optimized_route_recieved: 'optimized_route_recieved',
				optimized_route_error: 'optimized_route_error',
				tab1_order_changed: 'order_changed',
			}
		}
	},

	init: function (view) {
		var self = this;

		this.processingMask = new Ext.LoadMask({
			msg: 'Please wait...',
			target: Ext.getCmp('menutab1')
		});

		this.routeLegsStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.RouteLegs',
			proxy: {
				type: 'memory',
			},
		});

		Ext.getCmp('tab1routeleggrid').setStore(this.routeLegsStore);

		this.droppedOrdersStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.RouteLegs',
			proxy: {
				type: 'memory',
			},
		});

		Ext.getCmp('tab1droppedgrid').setStore(this.droppedOrdersStore);

		this.ordersStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.RouteLegs',
			proxy: {
				type: 'memory',
			},
		});

		var comboAuto = Ext.getCmp('menutab1trackerselect');

		this.routelistStore = Ext.create('Opt.store.RouteList');

		var comboMl = Ext.getCmp('menutab1mlselect');
		comboMl.setStore(this.routelistStore);

		this.routelistStore.on('load', function (store, records, successful, operation, eOpts) {
			comboMl.disable();
			var count = store.getCount();
			if (count > 0) {
				store.each(function (record) {
					record.set('description', self.getRouteListDescription(record));
				});

				comboMl.setValue(store.getAt(0).get('id'));
				comboMl.enable();
				self.setTimeFields(store.first());
			} else {
				comboMl.reset();
				self.setTimeFields();
			}
		});
	},

	afterRender: function () {
		this.rendered = true;
		this.setDefaultValues();
	},

	onChangeUsePlanTime: function (checkbox, newValue, oldValue, eOpts) {
		if (this.rendered) {
			this.resetDistanceDurationFileds();
			this.resetData();
			this.getRouteLists();
		}
	},

	setTimeFields: function (record) {
		var strTimeBegin = '08:00:00';
		var strTimeEnd = '20:00:00';

		var form = this.lookupReference('formtab1').getForm();
		var formValues = form.getValues();

		if (!record || record.get("id") == 0) {
			form.setValues({
				tracker_time_begin_1: strTimeBegin,
				tracker_time_begin: 28800
			});
		} else {
			if (formValues.usePlanTime) {
				form.setValues({
					tracker_time_begin_1: secToMin(record.get("route_begin_plan")),
					tracker_time_begin: record.get("route_begin_plan"),
				});
			} else {
				if (record.get("route_begin_fact") > 0) {
					form.setValues({
						tracker_time_begin_1: secToMin(record.get("route_begin_fact")),
						tracker_time_begin: record.get("route_begin_fact"),
					});
				} else {
					form.setValues({
						tracker_time_begin_1: strTimeBegin,
						tracker_time_begin: 28800
					});
				}
			}
		}
	},

	getRouteListDescription: function (record) {
		var form = this.lookupReference('formtab1');
		var formVal = form.getValues();
		var usePlanTime = formVal.usePlanTime;
		var description = '№' + record.get("number_short").replace(/\s+/g, '');

		if (usePlanTime) {
			description = description + " c " + secToMin(record.get("route_begin_plan")) + " до " + secToMin(record.get("route_end_plan"));
		} else {
			if (record.get("route_begin_fact") > 0){
				description = description + " c " + secToMin(record.get("route_begin_fact"));
			}

			if (record.get("route_end_fact") > 0){
				description = description + " до " + secToMin(record.get("route_end_fact"));
			}
		}

		description = description + ' (' + record.get("driver_name") + ')';
		return description;
	},

	setAutoComboFirstRow: function (combo) {
		var self = this;
		var store = combo.getStore();
		store.on('load', function (store, records, successful, operation, eOpts) {
			if (!combo.getValue()) {
				combo.setValue(store.getAt(0).get(combo.valueField));
				self.getRouteLists();
			}
		});
	},

	getRouteLists: function () {
		var auto = Ext.getCmp('menutab1trackerselect').getValue();
		if (auto == 0) return;

		var form = this.lookupReference('formtab1');
		var formVal = form.getValues();
		var tracker_date = formVal.tracker_date;

		tracker_date = tracker_date.replace(/-/g, '/'); // для IE 

		var datetimeBegin = Date.parse(tracker_date + ' ' + "00:00:00");
		var datetimeEnd = Date.parse(tracker_date + ' ' + "23:59:59");
		if (datetimeBegin > datetimeEnd) {
			alert("Неверный интервал времени!");
			return;
		}

		var store = this.routelistStore;
		store.load({
			params: {
				param: 'RouteListsOpt',
				auto_filter: auto,
				datetime_begin: Parse1CData(datetimeBegin),
				datetime_end: Parse1CData(datetimeEnd),
			},
		});
	},

	onAutoSelect: function (combo, record, eOpts) {
		this.resetDistanceDurationFileds();
		this.resetData();
		this.getRouteLists();

		var form = this.lookupReference('formtab1').getForm();
		form.setValues({
			coeffincreasetransittime: record.get("time_increase_k"),
		});
	},

	onTrackerDateChange: function (field, newValue, oldValue, eOpts) {
		this.resetDistanceDurationFileds();
		this.resetData();
		this.getRouteLists();
	},

	onMlSelect: function (combo, record, eOpts) {
		this.resetDistanceDurationFileds();
		this.resetData();
		this.setTimeFields(record);
	},

	onTimeBeginSelect: function (field, newValue, oldValue, eOpts) {
		if (oldValue) {
			var seconds = hmsToSecondsOnly(newValue);
			var form = this.lookupReference('formtab1').getForm();
			form.setValues({
				tracker_time_begin: seconds
			});
		}
	},

	getOrders: function () {
		var self = this;

		var form = this.lookupReference('formtab1').getForm();
		var formVal = form.getValues();

		if (!formVal.selectedml) {
			return;
		}

		self.processingMask.show();

		this.isOpt = false;
		this.resetData();

		Ext.getCmp('menutab1savetrack').setDisabled(true);
		Ext.getCmp('tab1ButtonSetValue').setDisabled(false);

		form.setValues({
			optdistance: 0,
			optfullduration: '',
			optduration: '',
			firstdistance: 0,
			firstfullduration: '',
			firstduration: '',
			slacktimevalue: 30
		});

		Ext.getCmp('tab1droppedgrid').collapse();

		var params = {
			param: 'Orders',
			ml_filter: formVal.selectedml,
			use_progressive_penalty: false,
		};

		Ext.Ajax.request({
			url: 'api/db/db_1cbase',
			method: 'GET',
			params: params,

			success: function (response) {
 				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					Opt.app.showError("Ошибка!", error.message);
					return;
        			}

				var store = self.ordersStore;
				store.removeAll();
				store.sync();
				store.loadData(respObj.data.orders);
				store.sync();
				self.onLoadOrders();
			},

			failure: function (response) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
				self.processingMask.hide();
			}
		});
	},

	onLoadOrders: function () {
this.getPoints();
		var geoJSON = Ext.getCmp('maptab1').constructOrdersGeoJSON(this.ordersStore);
		Ext.getCmp('maptab1').setOrdersOnMap(geoJSON);
		//this.getPoints();
	},

	getPoints: function () {
		var self = this;

		var orderStore = this.ordersStore;

		if (orderStore.count() == 0) { // пустой маршрут
			Ext.Msg.alert("Внимание!", "Пустой маршрут!");
			this.processingMask.hide();
			return;
		}

		var form = this.lookupReference('formtab1');
		var formVal = form.getValues();

		if (formVal.selectedml.full_load_k > 0) {
			form.setValues({
				coeffincreasetransittime: formVal.selectedml.full_load_k,
			});
		}

		self.loadPointsToGrid(self.ordersStore.getRange());
	},

	loadPointsToGrid: function (data) {
		var self = this;

		var depot = Opt.app.getDepot();
                if (!depot) {
                 	Opt.showError("Внимание!","Нет данных о депо!");
			return;
		}

		depot.penalty = 0;

		var store = Ext.getCmp("tab1routeleggrid").store;
		if (!self.isOpt) {
			store.add(Ext.clone(depot));
			store.add(data);
			store.add(Ext.clone(depot));
		} else {
			store.removeAll();
			store.sync();
			store.loadData(data);
			store.sync();
		}

		self.getWayPoints();
	},

	getWayPoints: function () {
		var self = this;
		Ext.getCmp('maptab1').allRouteLayer = L.featureGroup();
		Ext.getCmp('maptab1').allRouteLayer.addTo(Ext.getCmp('maptab1').map);

		Ext.getCmp('maptab1').setStrumokMarker();

		this.arrP = [];

		if (this.routeLegsStore.count() > 2) {
			this.processingMask.show();
		}

		console.log("Время начала запроса " + Date.now());

		for (var i = 1; i < this.routeLegsStore.count(); i++) {
			var recFrom = this.routeLegsStore.getAt(i - 1).data;
			var fromPoint = new L.Routing.waypoint();
			fromPoint.latLng = L.latLng(recFrom.lat, recFrom.lon);

			var recTo = this.routeLegsStore.getAt(i).data;
			var toPoint = new L.Routing.waypoint();
			toPoint.latLng = L.latLng(recTo.lat, recTo.lon);
			self.getRoute(fromPoint, toPoint, i, self.routeLegsStore.count());
/*
			var routeLegsStoreCount = self.routeLegsStore.count();

			setTimeout(function(fromPoint, toPoint, i, routeLegsStoreCount){
				return function() {
     					 self.getRoute(fromPoint, toPoint, i, routeLegsStoreCount);
				}		
			}(fromPoint, toPoint, i, routeLegsStoreCount),0);
*/
		};
	},

	getRoute: function (fromPoint, toPoint, index, allcount) {
		var color = 'green';
		if (this.isOpt) {
			color = 'brown'
		}

		var lineOptions = [{
			color: color,
			opacity: 1,
			weight: 2,
		}];

		var self = this;

		var form = self.lookupReference('formtab1');
		var formVal = form.getForm().getFieldValues();
		var increaseTimeCoeff = formVal.coeffincreasetransittime;

		router.route([fromPoint, toPoint], function (error, routes) {
			if (routes) {
				var distance = routes[0].summary.totalDistance;
				var duration = routes[0].summary.totalTime;

				var routeLine = L.Routing.line(routes[0], {
					styles: lineOptions
				});

				Ext.getCmp('maptab1').allRouteLayer.addLayer(routeLine);


				var rec = self.routeLegsStore.getAt(index);

				var corrDuration = Math.round(duration * increaseTimeCoeff);
				var corrDistance = Math.round(distance);

				rec.beginEdit();
				rec.set('distance', corrDistance);
				rec.set('duration', corrDuration);
				rec.commit();

				self.arrP.push({ distance: corrDistance, duration: corrDuration });

				if (self.arrP.length == allcount - 1) {

console.log("Время окончания запроса " + Date.now());

					var totalDistance = 0;
					var totalDuration = 0;

					for (var i = 0; i < self.arrP.length; i++) {
						totalDistance = totalDistance + self.arrP[i].distance;
						totalDuration = totalDuration + self.arrP[i].duration;
					}

					var form = self.lookupReference('formtab1').getForm();

					if (self.isOpt) {
						form.setValues({
							optdistance: totalDistance,
							optduration: secToHHMMSS(totalDuration)
						});
						self.setDistanceToolTip();
					} else {
						form.setValues({
							firstdistance: totalDistance,
							firstduration: secToHHMMSS(totalDuration)
						});
					}

					//console.log("Total distance " + totalDistance);

					Ext.getCmp('menutab1optimizebutton').setDisabled(false);

					if (self.isOpt) {
						Ext.getCmp('menutab1savetrack').setDisabled(false);
						Ext.getCmp('tab1ButtonSetValue').setDisabled(true);
					}

					if (!self.isOpt) {
						self.routePostProcess();
					} else {
						self.setOptFullDuration();
						//self.setFullDurationToolTip();
						self.setDurationToolTip();
					}

					Ext.getCmp('maptab1').markersFitBounds();
					self.processingMask.hide();
				}
			}

			if (error) {
				Opt.app.showToast("Ошибка!",JSON.parse(error.target.response).message);
				console.error(error);
				self.processingMask.hide();
			}
		}, null, {});
	},

	routePostProcess: function () {
		var store = this.routeLegsStore;
		var legsCount = store.count();

		if (legsCount == 0) {
			return;
		}

		store.suspendEvents();

		var form = this.lookupReference('formtab1').getForm();
		var formValues = form.getValues();
		var seconds = formValues.tracker_time_begin;

		var time_begin = parseInt(seconds);
		var time_end = 0;
		var cumulTime = time_begin; // в секундах

		for (var i = 0; i < legsCount; i++) {
			var rec = store.getAt(i);
			var departure_time = 0;
			var arriving_time = 0;
			//var waiting_time = 0;

			if (i == 0) {
				departure_time = time_begin;

				rec.beginEdit();
				rec.set('arriving_time', arriving_time);
				rec.set('departure_time', departure_time);
				rec.commit();

			} else if (i < legsCount - 1) {
				cumulTime = cumulTime + rec.get('duration');
				arriving_time = cumulTime;

				rec.beginEdit();
				rec.set('arriving_time', arriving_time);

				cumulTime = cumulTime + rec.get('service_time') + rec.get('waiting_time');
				departure_time = cumulTime;

				rec.set('departure_time', departure_time);
				rec.commit();
			} else {
				cumulTime = cumulTime + rec.get('duration');
				arriving_time = cumulTime;

				time_end = arriving_time;

				rec.beginEdit();
				rec.set('arriving_time', arriving_time);
				rec.set('departure_time', departure_time);
				//rec.set('waiting_time', waiting_time);
				rec.commit();
			}
		}

		store.sync();

		store.resumeEvents();
		Ext.getCmp('tab1routeleggrid').getView().refresh();

		var form = this.lookupReference('formtab1').getForm();
		form.setValues({
			firstfullduration: secToHHMMSS(time_end - time_begin),
		});
	},

	resetDistanceDurationFileds: function () {
		var form = this.lookupReference('formtab1').getForm();
		form.setValues({
			optdistance: 0,
			optduration: '',
			optfullduration: '',
			firstdistance: 0,
			firstduration: '',
			firstfullduration: '',
		});

		this.removeDistanceToolTip();
		this.removeDurationToolTip();
		this.removeFullDurationToolTip();
	},

	setDefaultValues: function () {
		var form = this.lookupReference('formtab1').getForm();
		var record = Ext.getCmp("menutab1trackerselect").getSelection();
		if (record) {
			form.setValues({
				coeffincreasetransittime: record.get("time_increase_k"),
			});
		} else {
			form.setValues({
				coeffincreasetransittime: 1,
			});
		};

		form.setValues({
			optdistance: 0,
			optduration: '',
			optfullduration: '',
			firstdistance: 0,
			firstduration: '',
			firstfullduration: '',
			slacktimevalue: 30
		});

		var record = Ext.getCmp("menutab1mlselect").getSelection();
		this.setTimeFields(record);
		this.resetData();
	},

	resetData: function () {
		this.removeDistanceToolTip();
		this.removeDurationToolTip();
		this.removeFullDurationToolTip();

		this.currTaskId = null;
		this.isOpt = false;
		this.arrP = [];

		this.ordersStore.removeAll();
		this.ordersStore.sync();

		this.routeLegsStore.removeAll();
		this.routeLegsStore.sync();

		this.droppedOrdersStore.removeAll();
		this.droppedOrdersStore.sync();

		Ext.getCmp('maptab1').resetLayers();
		Ext.getCmp('menutab1optimizebutton').setDisabled(true);
		Ext.getCmp('menutab1savetrack').setDisabled(true);

	},

	resetMap: function () {
		this.resetData();
		this.resetDistanceDurationFileds();
		var comboML = Ext.getCmp('maptab1')
		var record = Ext.getCmp("menutab1mlselect").getSelection();
		this.setTimeFields(record);
		Ext.getCmp('maptab1').map.setView([47.07559, 37.50796], 12);
	},


	optimizeRoute: function () {
		var self = this;
		if (!Opt.app.socket || Opt.app.socket.OPEN != 1) {
			Ext.Msg.alert("Внимание!", "Нет соединения с сервером!");
			return;
		}
		var containNotValidOrders = false;

		for (var i = 0; i < this.routeLegsStore.count() - 1; i++) {
			var order = this.routeLegsStore.getAt(i).data;
			if (order.timewindow_begin > order.timewindow_end) containNotValidOrders = true;
		}

		for (var i = 0; i < this.droppedOrdersStore.count(); i++) {
			var order = this.droppedOrdersStore.getAt(i).data;
			if (order.timewindow_begin > order.timewindow_end) containNotValidOrders = true;
		}

		if (containNotValidOrders){
			Opt.app.showError("Ошибка!", "Есть заказы c неверно установленным окном времени. Операция прервана.");
			return;			
		}

		self.processingMask.show();
		self.isOpt = true;

		if (!Opt.app.socket) {
			console.log("Нет соединения с сервером оптимизации!");
			return;
		}

		//*************************************************************
		//   !!!!!!!!!!!!!     ВРЕМЯ В СЕКУНДАХ    !!!!!!!!!!!!!
		//*************************************************************

		var form = this.lookupReference('formtab1');
		var formVal = form.getForm().getFieldValues();

		var task = {};

		this.currTaskId = Date.now().toString();
		task.id = this.currTaskId;
		task.solve = "optimize_route";
		task.parameters = {
			autos_num: 1,
			depot_index: 0,
			time_limit: 10,
			time_waiting: formVal.slacktimevalue * 60, // мин
			maximum_time_per_vehicle: 24 * 60 * 60,
			increaseTimeCoeff: formVal.coeffincreasetransittime,
		};
		task.error = "";

		var routeListRecord = Ext.getCmp("menutab1mlselect").getSelection();
		var autoRecord = Ext.getCmp("menutab1trackerselect").getSelection();
		var orders = [];

		for (var i = 0; i < this.routeLegsStore.count() - 1; i++) {
			orders.push(this.routeLegsStore.getAt(i).data);
		}

		for (var i = 0; i < this.droppedOrdersStore.count(); i++) {
			orders.push(this.droppedOrdersStore.getAt(i).data);
		}

		var timeVal = formVal.tracker_time_begin;
		var seconds = parseInt(timeVal);
		var time_begin = seconds;
		orders[0].timewindow_begin = seconds;

		task.data = {
			id: routeListRecord.get("id"),
			number: routeListRecord.get("number"),
			date: routeListRecord.get("date"),
			route_begin_fact: routeListRecord.get("route_begin_fact"),
			route_end_fact: routeListRecord.get("route_end_fact"),
			route_begin_calc: 0,
			route_end_calc: 0,
			route_begin_plan: routeListRecord.get("route_begin_plan"),
			route_end_plan: routeListRecord.get("route_end_plan"),

			load_fact: routeListRecord.get("load_fact"),
			auto: {
				id: autoRecord.get("id"),
				name: autoRecord.get("name"),
				water: autoRecord.get("water"),
				bottle: autoRecord.get("bottle"),
				load_max: autoRecord.get("load_max"),
				load_norm: autoRecord.get("load_norm"),
				time_increase_k: autoRecord.get("time_increase_k"),
				worktime_begin: autoRecord.get("worktime_begin"),
				worktime_end: autoRecord.get("worktime_end"),

			},

			orders: orders,
		};

		self.droppedOrdersStore.removeAll();
		Ext.getCmp('tab1droppedgrid').collapse();
console.log(task);
		Opt.app.socket.send(JSON.stringify(task));
	},

	onServerDisconnect: function () {
		var self = this;
		self.processingMask.hide();
	},

	onSlackTimeChange: function (field, newValue, oldValue, eOpts) {

	},

	onIncreaseTimeChange: function (field, newValue, oldValue, eOpts) {
		this.resetData();
	},

	onPenaltyTimeChange: function (field, newValue, oldValue, eOpts) {
		this.penaltyTime = newValue;
	},

	saveRoute: function () {
		var self = this;

		var form = this.lookupReference('formtab1');
		var formVal = form.getValues();
		var orders = [];

		var legsCount = this.routeLegsStore.count();

		if (legsCount < 3) {
			console.log(legsCount);
			return;
		}

		var recStart = this.routeLegsStore.getAt(0);
		var recEnd = this.routeLegsStore.getAt(legsCount - 1);
		var route_begin = recStart.get("departure_time");
		var route_end = recEnd.get("arriving_time");

		for (var i = 1; i < legsCount - 1; i++) {
			var rec = this.routeLegsStore.getAt(i);
			orders.push(rec.data);
		}

		var params = {
			param: 'saveOptML',
			route_id: formVal.selectedml,
			route_begin: route_begin,
			route_end: route_end,
			orders: orders
		};

		Ext.Ajax.request({
			url: 'api/db/db_1cbase',
			method: 'POST',
			jsonData: params,

			success: function (response) {
 				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					Opt.app.showError("Ошибка!", error.message);
					return;
        			}

				if (respObj.success) {
					Ext.Msg.alert("Внимание!", respObj.message);
				}
			},

			failure: function (response) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
			}
		});

	},

	optimized_route_recieved: function (data) {
		console.log(data);
		var self = this;
		self.processingMask.hide();

		if (data.droppedOrders.length > 0) {
			Ext.Msg.alert("Внимание!", "Есть отброшенные заказы!");
			Ext.getCmp('tab1droppedgrid').expand();

			var store = self.droppedOrdersStore;
			store.removeAll();
			store.sync();

			store.loadData(data.droppedOrders);
			store.sync();
		}

		var mapCmp = Ext.getCmp('maptab1');

		if (mapCmp.finishMarker != null) {
			mapCmp.map.removeLayer(mapCmp.finishMarker);
			mapCmp.finishMarker = null;
		}

		if (mapCmp.lineLeg != null) {
			mapCmp.map.removeLayer(mapCmp.lineLeg);
			mapCmp.lineLeg = null;
		}

		if (mapCmp.allRouteLayer != null) {
			mapCmp.allRouteLayer.eachLayer(function (layer) {
				mapCmp.map.removeLayer(layer);
			});

			mapCmp.map.removeLayer(mapCmp.allRouteLayer);
			mapCmp.allRouteLayer = null;
		}

		if (this.currTaskId == data.id) {
			this.currTaskId = null;
			self.loadPointsToGrid(data.data.orders);
		} else {
			console.log(data.id);
		}
	},

	optimized_route_error: function (data) {
		this.currTaskId = null;
		Ext.Msg.alert("Ошибка оптимизации", data.error);
		this.processingMask.hide();
		return;
	},

	setFullDurationToolTip: function () {
		this.removeFullDurationToolTip();
		var form = this.lookupReference('formtab1');
		var formVal = form.getForm().getFieldValues();
		if (hmsToSecondsOnly(formVal.optfullduration) > 0 && hmsToSecondsOnly(formVal.firstfullduration) > 0 && hmsToSecondsOnly(formVal.optfullduration) != hmsToSecondsOnly(formVal.firstfullduration)) {
			var diff = (hmsToSecondsOnly(formVal.optfullduration) - hmsToSecondsOnly(formVal.firstfullduration)) / hmsToSecondsOnly(formVal.firstfullduration) * 100;
			this.diffFullDurationToolTip = Ext.create('Ext.tip.ToolTip', {
				target: 'tab1optfullduration',
				html: (diff > 0 ? '+' : '') + diff.toFixed(1) + '%'
			});
			this.diffFullDurationToolTip.show();
		} else {
			this.removeFullDurationToolTip();
		}
	},

	setDurationToolTip: function () {
		this.removeDurationToolTip();
		var form = this.lookupReference('formtab1');
		var formVal = form.getForm().getFieldValues();
		if (hmsToSecondsOnly(formVal.optduration) > 0 && hmsToSecondsOnly(formVal.firstduration) > 0 && hmsToSecondsOnly(formVal.optduration) != hmsToSecondsOnly(formVal.firstduration)) {
			var diff = (hmsToSecondsOnly(formVal.optduration) - hmsToSecondsOnly(formVal.firstduration)) / hmsToSecondsOnly(formVal.firstduration) * 100;
			this.diffDurationToolTip = Ext.create('Ext.tip.ToolTip', {
				target: 'tab1optduration',
				html: (diff > 0 ? '+' : '') + diff.toFixed(1) + '%'
			});
			this.diffDurationToolTip.show();
		} else {
			this.removeDurationToolTip();
		}
	},

	setDistanceToolTip: function () {
		this.removeDistanceToolTip();
		var form = this.lookupReference('formtab1');
		var formVal = form.getForm().getFieldValues();
		if (formVal.optdistance > 0 && formVal.firstdistance > 0 && formVal.optdistance != formVal.firstdistance) {
			var diff = (formVal.optdistance - formVal.firstdistance) / formVal.firstdistance * 100;
			this.diffDistanceToolTip = Ext.create('Ext.tip.ToolTip', {
				target: 'tab1optdistance',
				html: (diff > 0 ? '+' : '') + diff.toFixed(1) + '%'
			});
			this.diffDistanceToolTip.show();
		} else {
			this.removeDistanceToolTip();
		}
	},


	removeFullDurationToolTip: function () {
		if (this.diffFullDurationToolTip) {
			this.diffFullDurationToolTip.remove('tab1optfullduration', { destroy: true });
			this.diffFullDurationToolTip.destroy();
			this.diffFullDurationToolTip = null;
		}
	},

	removeDurationToolTip: function () {
		if (this.diffDurationToolTip) {
			this.diffDurationToolTip.remove('tab1optduration', { destroy: true });
			this.diffDurationToolTip.destroy();
			this.diffDurationToolTip = null;
		}
	},

	removeDistanceToolTip: function () {
		if (this.diffDistanceToolTip) {
			this.diffDistanceToolTip.remove('tab1optdistance', { destroy: true });
			this.diffDistanceToolTip.destroy();
			this.diffDistanceToolTip = null;
		}
	},

	refreshRouteLists: function (combo, button, e) {
		var auto = Ext.getCmp('menutab1trackerselect').getValue();
		if (auto == 0) return;
		this.getRouteLists();
	},

	setOptFullDuration: function () {
		var recBegin = this.routeLegsStore.getAt(0);
		var timeBegin = recBegin.get("departure_time");

		var recEnd = this.routeLegsStore.getAt(this.routeLegsStore.count() - 1);
		var timeEnd = recEnd.get("arriving_time");

		var diff = timeEnd - timeBegin;

		var form = this.lookupReference('formtab1').getForm();
		form.setValues({
			optfullduration: secToHHMMSS(diff),
		});
	},

	order_changed: function () {
		if (!this.isOpt) {
			this.routePostProcess();
		}
	},
});