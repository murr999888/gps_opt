Ext.define('Opt.view.tabs.MainTab', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.maintab',
	requires: [
		'Opt.view.tabs.MainTabController',
		'Opt.view.tabs.tab1.MainTab1',
		'Opt.view.tabs.tab2.MainTab2',
		'Opt.view.tabs.tab99.MainTab99',
	],

	id: 'maintab',
	deferredRender: false,
	activeTab: 0,
	border: 0,
	header: {
		items: [{
			xtype: 'button',
			text: 'Выход',
			handler: 'logout',
		},],

		iconCls: 'fa fa-yellow-indicator fa-shadow fa-circle',
	},

	controller: 'mainTabController',

	listeners: {
		tabchange: function (tabPanel, newCard, oldCard, eOpts) { }
	},

	items: [
		{
			title: 'Оптимизация МЛ',
			xtype: 'maintab1',
			id: 'maintab1',

		},

		{
			title: 'Формирование МЛ',
			xtype: 'maintab2',
			id: 'maintab2',

		},
		{
			title: 'Помощь',
			xtype: 'maintab99',

		},
	],
});