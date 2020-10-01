Ext.define('Opt.view.tabs.MainTab', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.maintab',
	requires: [
		'Opt.view.tabs.MainTabController',
		'Opt.view.tabs.tab1.MainTab1',
		'Opt.view.tabs.tab2.MainTab2',
		'Opt.view.tabs.tab3.MainTab3',
		'Opt.view.tabs.tab99.MainTab99',
	],
/*
initComponent: function() {
        this.width = 560;

        this.tbar = [{
            xtype:'splitbutton',
            text:'Menu Button',
            iconCls: null,
            glyph: 61,
            menu:[{
                text:'Menu Button 1'
            }]
        }, '-', {
            xtype:'splitbutton',
            text:'Cut',
            iconCls: null,
            glyph: 67,
            menu: [{
                text:'Cut Menu Item'
            }]
        }, {
            iconCls: null,
            glyph: 102,
            text:'Copy'
        }, {
            text:'Paste',
            iconCls: null,
            glyph: 70,
            menu:[{
                text:'Paste Menu Item'
            }]
        }, '-', {
            iconCls: null,
            glyph: 76,
            text:'Format'
        }];
        this.callParent();
    },
*/
	id: 'maintab',
	deferredRender: false,
	activeTab: 0,
	border: 0,
	header: {
		items: [

/*
			{
			 	xtype:'button',
				handler: 'runF',
			},
*/

			{
				xtype: 'button',
				text: 'Выход',
				handler: 'logout',
				margin: '0 0 0 15px',
			},
		],

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
			title: 'Пробки',
			xtype: 'maintab3',
			id: 'maintab3',
		},
		{
			title: 'Помощь',
			xtype: 'maintab99',

		},
	],
});