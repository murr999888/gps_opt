Ext.define('Opt.view.Main', {
	extend: 'Ext.container.Viewport',
	alias: 'widget.main',

	requires: [
		'Opt.view.tabs.MainTab',
		'Opt.view.MainController',
	],

	layout: 'fit',

	items: [{
		xtype: 'maintab',
		id: 'maintab',
		title: 'Оптимизация и планирование (' + socketSrv + ')',
	},],
	controller: 'mainController',
});