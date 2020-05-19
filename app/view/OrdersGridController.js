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

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		if (!record.get("isDepot")) this.openEditDialog(record, false);
	},

	getNum: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var isAdded = record.get('isAdded');
		var isDepot = record.get('isDepot');
		if (!isDepot && isAdded) {
			metadata.tdStyle = "font-weight: bold; text-decoration: underline;";
		}
		return val;
	},

	getSod: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var str = 'data-qtip="';
		var sod = Ext.util.Format.htmlEncode(record.get('sod'));
		var dop = Ext.util.Format.htmlEncode(record.get('dop'));

		if (sod != '' && dop != '') {
			str = str + sod + '<br />' + dop;
		} else {
			str = str + sod + dop;
		}

		metadata.tdAttr = str + '"';
		return val;
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
		this.orderEdit = null;
		Ext.suspendLayouts();

		this.orderEdit = Ext.create('widget.orderedit', { stateId: 'routeOrderEdit' });
		this.orderEdit.readOnly = true;

		this.orderEdit.down('form').loadRecord(record);

		this.orderEdit.down('ordergoodsgrid').store.suspendEvents();
		this.orderEdit.down('ordergoodsgrid').store.loadData(record.get("goods"));
		this.orderEdit.down('ordergoodsgrid').store.resumeEvents();

		this.orderEdit.down('ordergoodsgrid').store.filterBy(function (record) {
			if (record.get("kolvo") > 0) return true;
		});

		this.orderEdit.down('allowedautosgrid').store.suspendEvents();
		this.orderEdit.down('allowedautosgrid').store.loadData(record.get("allowed_autos"));
		this.orderEdit.down('allowedautosgrid').store.resumeEvents();

		var form = this.orderEdit.down('form').getForm();
		form.setValues({
			service_time_min: Math.ceil(record.get("service_time") / 60),
		});

		Ext.resumeLayouts();

		this.orderEdit.show().focus();
	},

	onEditRecord: function (grid, rowIndex, colIndex, item, e, record) {
		this.openEditDialog(record);
	},
});