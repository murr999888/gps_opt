Ext.define('Opt.view.tabs.tab1.RouteLegGridTab1Controller', {
	extend: 'Opt.view.RouteLegGridController',
	alias: 'controller.tab1routeleggrid',
	requires: [
		'Opt.ux.GridPrinter',
	],

	listen: {
		controller: {
			'*': {
				setServiceTimeTab1: 'setServiceTime',
				setPenaltyTimeTab1: 'setPenaltyTime',
			}
		}
	},

	init: function () {
		this.getView().getSelectionModel().setSelectionMode('MULTI')
	},

	orderEdit: null,

	refreshOrders: function () {
		Ext.getCmp('menutab1').controller.getOrders();
	},

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		if (rowIndex == 0) {
			console.log("Первую пропускаем..");
			return;
		}

		var recTo = record.data;
		var store = grid.store;
		var recFrom = store.getAt(rowIndex - 1).data;

		var map = Ext.getCmp('maptab1').map;

		Ext.getCmp('maptab1').deleteLineLeg();

		var lineOptions = [{
			color: 'blue',
			opacity: 1,
			weight: 3,
			pane: 'routelinesBlue',
		}];

		var router = new L.Routing.OSRMv1({
			serviceUrl: routeServerUrl
		});

		fromPoint = new L.Routing.waypoint();
		fromPoint.latLng = L.latLng(recFrom.lat, recFrom.lon);
		tempFromMarker = L.marker(L.latLng(recFrom.lat, recFrom.lon));

		toPoint = new L.Routing.waypoint();
		toPoint.latLng = L.latLng(recTo.lat, recTo.lon);
		tempToMarker = L.marker(L.latLng(recTo.lat, recTo.lon));

		router.route([fromPoint, toPoint], function (error, routes) {
			if (routes) {
				var lineLeg = L.Routing.line(routes[0], {
					styles: lineOptions
				});

				Ext.getCmp('maptab1').deleteLineLeg();

				Ext.getCmp('maptab1').lineLeg = lineLeg;
				Ext.getCmp('maptab1').lineLeg.addTo(Ext.getCmp('maptab1').map);
				Ext.getCmp('maptab1').setArrows();
			}

			Ext.getCmp('maptab1').setFinishMarkerR(toPoint.latLng);

			var gr = L.featureGroup([Ext.getCmp('maptab1').lineLeg, tempFromMarker, tempToMarker]);
			Ext.getCmp('maptab1').map.fitBounds(gr.getBounds(), pad);
			tempFromMarker = null;
			tempToMarker = null;
			gr = null;

			Ext.getCmp('maptab1').lineLeg.on('linetouched', function (touchData) {
				var popupLineLeg = L.popup({
					closeOnClick: true
				});

				popupLineLeg.setLatLng(touchData.latlng);
				var popupContent = '';

				popupContent = popupContent + '<div style="color: green;"><b>' + recFrom.full_name + '</b><br />';

				if (recFrom.adres != recFrom.full_name && recFrom.adres != '') {
					popupContent = popupContent + '(' + recFrom.adres + ') </div>';
				} else {
					popupContent = popupContent + '</div>';
				}

				popupContent = popupContent + '<div style="color: brown;"><b>' + recTo.full_name + '</b><br />';

				if (recTo.adres != recTo.full_name && recTo.adres != '') {
					popupContent = popupContent + '(' + recTo.adres + ') </div>';
				} else {
					popupContent = popupContent + '</div>';
				}

				popupContent = popupContent + '<div>';

				if (recTo.stop_time > 0) {
					popupContent = popupContent + 'Стоянка: ' + secToMin(recTo.stop_time.toFixed()) + '<br />'
				}

				popupContent = popupContent + 'Расстояние: <b>' + routes[0].summary.totalDistance.toFixed() + '</b><br />' + 'Время в пути: <b>' + secToMin(routes[0].summary.totalTime.toFixed()) + '</b></div>';

				popupLineLeg.setContent(popupContent);
				popupLineLeg.openOn(map);
			});
		});
	},

	onCloseEditOrderDialog: function (panel) {
		if (panel.changed) {
			//console.log('panel.changed');
			this.fireEvent('tab1_order_changed');
		}
	},

	openEditDialog: function (record) {

		var self = this;
		Ext.suspendLayouts();

		this.orderEdit = null;

		this.orderEdit = Ext.create('widget.orderedit', { stateId: 'tab1orderEdit', });
		this.orderEdit.down('form').loadRecord(record);

		var orderGoodsStore = this.orderEdit.down('ordergoodsgrid').store;
		orderGoodsStore.suspendEvents();
		orderGoodsStore.loadData(record.get("goods"));
		orderGoodsStore.sync();
		orderGoodsStore.resumeEvents();

		this.orderEdit.down('ordergoodsgrid').store.filterBy(function (record) {
			if (record.get("kolvo") > 0) return true;
		});

		var allowedAutosStore = this.orderEdit.down('allowedautosgrid').store;
		allowedAutosStore.suspendEvents();
		allowedAutosStore.loadData(record.get("allowed_autos"));
		allowedAutosStore.sync();
		allowedAutosStore.resumeEvents();

		this.orderEdit.down('tabpanel').items.items[1].setDisabled(true);

		var form = this.orderEdit.down('form').getForm();
		form.setValues({
			service_time_min: Math.ceil(record.get("service_time") / 60),
		});

		this.orderEdit.on('close', function (panel) {
			self.onCloseEditOrderDialog(panel);
		});

		Ext.resumeLayouts();
		this.orderEdit.show().focus();
	},

	setPenalty: function () {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}

		this.msgbox = null;
		this.msgbox = Ext.create('widget.setpenalty', { parentGrid: grid});
		this.msgbox.show();
	},

	setService: function () {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}

		this.msgbox = null;
		this.msgbox = Ext.create('widget.setservicetime', { parentGrid: grid});
		this.msgbox.show();
	},

	getNum: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		return val;
	},
});