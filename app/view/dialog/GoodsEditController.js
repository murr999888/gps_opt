Ext.define('Opt.view.dialog.GoodsEditController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.goodsedit',
	requires: [
		'Opt.ux.GridPrinter',
	],

	init: function () {
	},

	closeView: function () {
		this.getView().destroy();
	},
});