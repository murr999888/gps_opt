Ext.define('Opt.view.OrdersGridController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.ordersgridpanel',
	requires: [
		'Opt.view.dialog.OrderEdit',
	],

	init: function(){
		var store = Ext.create('Ext.data.Store', {
			model: 'Opt.model.RouteLegs',
			proxy: {
				type: 'memory',
			},
		});

		this.getView().setStore(store);
	},

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},

	getFuelIcon: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (record.get('node_type') == 3) {
			//metadata.tdCls = 'vert_middle';
			return '<div style="height: 14px; width: 14px; background: url(css/images/gas_station_16x16.png) no-repeat; no-repeat center center; background-size: 14px; "></div>';
		}
		return '';
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		if (record.get("node_type") != 0) this.openEditDialog(record, false);
	},

	getNum: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var isAdded = record.get('isAdded');
		var node_type = record.get('node_type');
		if (node_type != 0 && isAdded) {
			metadata.tdStyle = "font-weight: bold; text-decoration: underline;";
		}
		return val;
	},

	getSod: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var ww = val;

		if (record.get('delivery_group_id') != '00000000-0000-0000-0000-000000000000'){
			ww = ww + '<br /><b>' + record.get('delivery_group_name') + '</b>';
		}

		var str = 'data-qtip="';

		var sod = "";
		var goods = record.get('unloading_goods');
		if (goods.length > 0) {
			sod = sod + "Отгрузка:<br />";
			for (var i=0; i < goods.length; i++) {
				var good = goods[i];
				sod = sod + Ext.util.Format.htmlEncode(good.name) + " - " + good.kolvo + " " + good.ed + "<br />";
			}
		}

		var goods = record.get('loading_goods');
		if (goods.length > 0) {
			sod = sod + "Погрузка:<br />";
			for (var i=0; i < goods.length; i++) {
				var good = goods[i];
				sod = sod + Ext.util.Format.htmlEncode(good.name) + " - " + good.kolvo + " " + good.ed + "<br />";
			}
		}		var dop = Ext.util.Format.htmlEncode(record.get('dop'));

		if (sod != '' && dop != '') {
			str = str + sod + '<br />' + dop;
		} else {
			str = str + sod + dop;
		}

		metadata.tdAttr = str + '"';
		return ww;
	},

	getServiceTime: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (val > 0) {
			return minToHHMM(val.toFixed());
		} else {
			return "";
		}
	},

	getPenalty: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (val==0) return '';
		return val;
	},

	getDistanceString: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var valDistance = record.get("distance");
		var valDuration = record.get("duration");

		if (valDistance > 0 || valDuration > 0) {
			if (valDuration > 0) {
				metadata.tdAttr = 'data-qtip=" Скорость ' + Ext.util.Format.htmlEncode((valDistance / valDuration * 3.6).toFixed(1)) + '"';
			}

			return strDistance(valDistance.toFixed()) + '<br />' + minToHHMM(valDuration.toFixed());
		} else {
			return "";
		}
	},

	getArrivingTime: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var arr_time_end = record.get("arriving_time_end");
		var arr_time_diff = record.get("arriving_time_end") - record.get("arriving_time");
		var waiting_time = record.get("waiting_time");

		if (arr_time_end > 0 && arr_time_diff > 0) {
			metadata.tdAttr = 'data-qtip="окно до ' + Ext.util.Format.htmlEncode(secToHHMMSS(arr_time_end.toFixed()) + ' (' + secToHHMMSS(arr_time_diff)) + ')"';
		}

		if (waiting_time > 0) {
			metadata.tdAttr = 'data-qtip="ожидание: ' + Ext.util.Format.htmlEncode(secToHHMMSS(waiting_time.toFixed())) + '"';
		}

		if (val > 0) {
			return secToHHMMSS(val.toFixed());
		} else {
			return "";
		}
	},

	getDepartureTime: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (val > 0) {
			return secToHHMMSS(val.toFixed());
		} else {
			return "";
		}
	},

	getWaitingTime: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (val > 0) {
			return secToHHMMSS(val.toFixed());
		} else {
			return "";
		}
	},

	getAdded: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (val == true) {
			return '+';
		} else {
			return "";
		}
	},

	openEditDialog: function (record, editable) {
		var self = this;

		if (!this.orderEdit || this.orderEdit.destroyed) this.orderEdit = Ext.create('widget.orderedit', { stateId: 'tab2orderEdit', });
		this.orderEdit.down('form').loadRecord(record);

		var orderUnloadingGoodsStore = this.orderEdit.down('orderunloadinggoodsgrid').getStore();
		var unfiltered_goods = record.get("unloading_goods")

		orderUnloadingGoodsStore.loadData(unfiltered_goods);
		orderUnloadingGoodsStore.sync();

		var unfiltered_goods = record.get("loading_goods")

		var orderLoadingGoodsStore = this.orderEdit.down('orderloadinggoodsgrid').getStore();
		orderLoadingGoodsStore.loadData(unfiltered_goods);
		orderLoadingGoodsStore.sync();

		var allowedAutosStore = this.orderEdit.down('allowedautosgrid').getStore();
		allowedAutosStore.loadData(record.get("allowed_autos"));
		allowedAutosStore.sync();

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

	onEditRecord: function (grid, rowIndex, colIndex, item, e, record) {
		this.openEditDialog(record);
	},
});