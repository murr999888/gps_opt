Ext.define('Opt.view.DepotGridController', {
	extend: 'Opt.view.RouteLegGridController',
	alias: 'controller.depotgrid',

	requires: [
		'Opt.ux.GridPrinter',
	],

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
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

	getCity: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var str = record.get('city') + '<br />' + record.get('adres');
		return str;
	},

   	getServiceTime: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		return minToHHMM(val.toFixed());
	},
});