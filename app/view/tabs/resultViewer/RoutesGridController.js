Ext.define('Opt.view.tabs.resultViewer.RoutesGridController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.resultviewerroutesgrid',
	requires: [
		'Opt.ux.GridPrinter',
	],

	checkedAll: true,
	routelistEdit: null,
	timerId: null,
	ordersStore: null,
	legsStore: null,
	goodsEditStore: null,
	ordersEditStore: null,
	arrP: [],
	routelistEdit: null,

	listen: {
		controller: {
			'*': {
				resultviewermapRender: 'onMapRender',
				resultViewerShow: 'onDialogShow',
				resultViewerClose: 'onDialogClose',
			}
		},
	},

	init: function () {
		this.ordersStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.RouteLegs',
			proxy: {
				type: 'memory',
			},
		});

		this.legsStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.RouteLegs',
			proxy: {
				type: 'memory',
			},
		});

		this.goodsEditStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.OrderGood',
			proxy: {
				type: 'memory',
			},
		});

		this.ordersEditStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.RouteLegs',
			proxy: {
				type: 'memory',
			},
		});

    		var columns = this.getView().getColumns();
        	Ext.each(columns, function(column) {
			if (column.xtype == 'actioncolumn') {
				column.setHidden(true);
			}
		});

	},

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},

	getNumbers: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		metadata.style = 'text-align: right;'; 
		if (val == 0) {
			return "";
		}
		return val;
	},

	onChangeInUse: function (checkbox, rowIndex, checked, record, e, eOpts) {
		record.commit();
		this.fireEvent('tab2routesgridsettitle');
		this.getView().setTitle(Ext.getCmp('tab2routesgrid').getTitle());
	},

	onHeaderCheckChange: function (column, checked, e, eOpts) {
		this.getView().suspendEvents();
		this.getView().store.commitChanges();
		this.getView().resumeEvents();
		this.fireEvent('tab2routesgridsettitle');
		this.getView().setTitle(Ext.getCmp('tab2routesgrid').getTitle());
	},

	setRouteToMap: function (record) {
		this.setOrdersOnMap(record);
		var titleComp = Ext.getCmp('viewerMapTitle');
		titleComp.setHtml(record.get("auto_name"));

		var orderComp = Ext.getCmp('resultviewerorders');
		var orderIndex = orderComp.store.getAt(0);
		orderComp.getView().bufferedRenderer.scrollTo(orderIndex, true);
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		this.drowRoute(record);
	},

	getTime: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (val > 0) {
			return secToHHMMSS(val.toFixed());
		} else {
			return "";
		}
	},

	getDriverName: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var id = record.get('driver_id');
		if (id == 0) {
			metadata.style = 'background-color: yellow;'; 
		}
		return val;
	},

	setOrdersOnMap: function (route) {
		this.resetData();

		var mapCmp = Ext.getCmp('resultviewermap');

		var self = this;

		this.legsStore.loadData(route.get('orders'));

		self.ordersStore.suspendEvents();

		for (var i = 0; i < this.legsStore.count(); i++) {
			var record = this.legsStore.getAt(i);
			var node_type = record.get('node_type');

			if (node_type != 0) {
				self.ordersStore.add(record);
			}
		};

		self.ordersStore.resumeEvents();

		var geoJSON = mapCmp.constructOrdersGeoJSON(this.ordersStore);
		mapCmp.setOrdersOnMap(geoJSON);
		this.getWayPoints();
	},

	getWayPoints: function () {
		var legs = this.legsStore;
		var mapCmp = Ext.getCmp('resultviewermap');

		mapCmp.allRouteLayer = L.featureGroup();
		mapCmp.allRouteLayer.addTo(mapCmp.map);

		mapCmp.setStrumokMarker();

		this.arrP = [];

		for (var i = 1; i < legs.count(); i++) {
			var recFrom = legs.getAt(i - 1).data;
			var fromPoint = new L.Routing.waypoint();
			fromPoint.latLng = L.latLng(recFrom.lat, recFrom.lon);

			var recTo = legs.getAt(i).data;
			var toPoint = new L.Routing.waypoint();
			toPoint.latLng = L.latLng(recTo.lat, recTo.lon);

			this.getRoute(fromPoint, toPoint, i, legs.count());
		};
	},

	getRoute: function (fromPoint, toPoint, index, allcount) {
		var legs = Ext.getCmp('resultviewerorders').store;
		var mapComp = Ext.getCmp('resultviewermap');

		color = 'brown'

		var lineOptions = [{
			color: color,
			opacity: 1,
			weight: 2,
			pane: 'routelines',
		}];

		var router = new L.Routing.OSRMv1({
			serviceUrl: routeServerUrl,
			profile: 'driving'
		});

		var self = this;

		router.route([fromPoint, toPoint], function (error, routes) {
			if (!error) {
				var distance = routes[0].summary.totalDistance;
				var duration = routes[0].summary.totalTime;

				self.arrP.push({ distance: distance, duration: duration });

				var routeLine = L.Routing.line(routes[0], {
					styles: lineOptions
				});

				mapComp.allRouteLayer.addLayer(routeLine);

				if (self.arrP.length == allcount - 1) {
					mapComp.markersFitBounds();
				}
			}

			if (error) {
				Opt.app.showToast("Внимание!", "Ошибка сервера <br />" + error.message);
				console.log(error);
			}
		}, null, {});
	},

	resetData: function () {
		this.arrP = [];
		this.ordersStore.removeAll();
		Ext.getCmp('resultviewermap').resetLayers();
	},

	openEditDialog: function (record) {
		this.routelistEdit = null;

		//Ext.suspendLayouts();
		this.routelistEdit = Ext.create('widget.routelistedit');
		this.routelistEdit.down('form').loadRecord(record);

		this.goodsEditStore.suspendEvents();
		this.goodsEditStore.loadData(record.get('goods'));
		this.goodsEditStore.sync();
		this.goodsEditStore.resumeEvents();

		this.ordersEditStore.suspendEvents();
		this.ordersEditStore.loadData(record.get('orders'));
		this.ordersEditStore.sync();
		this.ordersEditStore.resumeEvents();

		this.routelistEdit.down('ordergoodsgrid').setStore(this.goodsEditStore);
		this.routelistEdit.down('ordersgridpanel').setStore(this.ordersEditStore);

		var form = this.routelistEdit.lookupReference('form').getForm();
		form.setValues({
			route_begin_1: secToHHMMSS(record.get("route_begin")),
			route_end_1: secToHHMMSS(record.get("route_end")),
			duration_1: secToHHMMSS(record.get("duration")),
			durationFull_1: secToHHMMSS(record.get("durationFull")),
			date_1: getDDMMYYYY(record.get("date")),
		});

		//Ext.resumeLayouts();

		this.routelistEdit.show().focus();
	},

	onEditRecord: function (grid, rowIndex, colIndex, item, e, record) {
		this.openEditDialog(record);
	},

	onDialogShow: function () {
		var mapEdit = Ext.getCmp('resultviewermap');
		if (!mapEdit.mapRendered) return;
		this.drowRoute();
	},

	onDialogClose: function () {
		var mapEdit = Ext.getCmp('resultviewermap');
		if (!mapEdit.mapRendered) return;
		mapEdit.resetLayers();
	},

	onMapRender: function () {
		var mapEdit = Ext.getCmp('resultviewermap');
		mapEdit.mapRendered = true;
		this.drowRoute();
	},

	drowRoute: function (record) {
		if (!record) {
			record = Ext.getCmp('resultviewerroutesgrid').getView().getSelectionModel().getSelection()[0];
		}

		var orders = record.get('orders');
		var ordersStore = Ext.getCmp('resultviewerorders').getStore();
		var droppedOrdersStore = Ext.getCmp('resultviewerdroppedgrid').getStore();
		ordersStore.loadData(orders);
		Ext.getCmp('resultviewerorders').setTitle("Заказы (" + (ordersStore.count()-2) + ")");
		Ext.getCmp('resultviewerdroppedgrid').setTitle("Отброшенные заказы (" + droppedOrdersStore.count() + ")");
		this.setRouteToMap(record);
	},

	getIcon: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (record.get('isRefueled')) {
			metadata.tdCls = 'vert_middle';
			return '<div style="height: 14px; width: 14px; background: url(css/images/gas_station_16x16.png) no-repeat; no-repeat center center; background-size: 14px; "></div>';
		}
		return '';
	},
});