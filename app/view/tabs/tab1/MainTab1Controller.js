Ext.define('Opt.view.tabs.tab1.MainTab1Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.mainTab1Controller',
	requires: [
		'Opt.view.tabs.BaseMapController',
	],

	onWindowResize: function () {
		Ext.getCmp('maptab1').doResize();
	},
});
