Ext.define('Opt.view.dialog.TrafficEdit.TrafficEditPointsController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.trafficpointsgridcontroller',

	requires: [
		'Opt.ux.GridPrinter',
	],

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},
});