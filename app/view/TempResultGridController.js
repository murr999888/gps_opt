Ext.define('Opt.view.TempResultGridController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.tempresultgrid',
	requires: [
		'Opt.ux.GridPrinter',
	],

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},

	getTime: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (val > 0) {
			return convertTimestampToDate(Date.parse(val)/1000);
		} else {
			return "";
		}
	},

	getCalcDuration: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		return record.get('data').calc_stat.calc_time;
	},

	getAutosCount: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		metadata.style = 'text-align: right;'; 
		return record.get('data').calc_stat.autos_count;
	},

	getOrdersCount: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		metadata.style = 'text-align: right;'; 
		return record.get('data').calc_stat.orders_all_count;
	},

	getDroppedCount: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		metadata.style = 'text-align: right;'; 
		return record.get('data').calc_stat.dropped_orders_count;
	},

	getDuration: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		return secToHHMMSS(record.get('data').calc_stat.total_duration);
	},

	getDistance: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		metadata.style = 'text-align: right;'; 
		return (record.get('data').calc_stat.total_distance/1000).toFixed(1) + ' км.';
	},
});