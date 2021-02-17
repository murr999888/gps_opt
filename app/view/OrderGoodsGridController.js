Ext.define('Opt.view.OrderGoodsGridController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.ordergoodsgrid',
	requires: [
		'Opt.ux.GridPrinter',
		'Opt.view.dialog.GoodsSelect',
	],


	init: function(){
		var store = Ext.create('Ext.data.Store', {
			model: 'Opt.model.OrderGood',
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
});