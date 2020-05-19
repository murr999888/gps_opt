Ext.define('Opt.view.RouteLegGridController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.routeleggrid',
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

	getPenalty: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (val==0) return '';
		return val;
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

	onCloseEditOrderDialog: function (panel) {

	},

	onEditRecord: function (grid, rowIndex, colIndex, item, e, record) {
		this.openEditDialog(record);
	},
});