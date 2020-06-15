Ext.define('Opt.view.tabs.tab99.MainTab99', {
	extend: 'Ext.Panel',
	alias: 'widget.maintab99',
	requires: [
		'Opt.view.tabs.tab99.MainTab99Controller',
	],

	controller: 'mainTab99Controller',

	layout: 'border',

	defaults: {
		//border: ,
		//header : false,
	},

	listeners: {
		'resize': function () {
			//itemRts.doLayout();
			//itemEvts.doLayout();
		}
	},

	items: [
		{
			xtype: 'grid',
			id: 'helptabletab99',
			title: 'Оглавление',
			region: 'west',
			store: 'HelpTableContent',
			//stateful: true,
			width: 320,
			minWidth: 320,
			maxWidth: 500,
			split: true,
			listeners: {
				cellclick: 'onCellClick',
				select: 'onSelectRow',
			},

			tools: [
				{
					type: 'refresh',
					handler: 'refreshTableContent',
					tooltip: 'Обновить оглавление'
				},
				{
					type: 'print',
					handler: 'printTable',
					tooltip: 'Печать оглавления'
				},
				{
					type: 'print',
					handler: 'printAllHelp',
					tooltip: 'Печать всей справки'
				}
			],

			columns: {
				defaults: {
					menuDisabled: true,
					sortable: false,
				},
				items: [
					{
						text: '#',
						align: 'right',
						flex: 1,
						renderer: function (value, metaData, record, rowIndex) {
							return rowIndex + 1;
						}
					},
					{
						text: 'Раздел',
						cellWrap: true,
						flex: 7,
						dataIndex: 'name',
					},
				]
			},

		},

		{
			xtype: 'panel',
			id: 'helpcontenttab99',
			title: 'Текст',
			html: '',
			bodyPadding: 10,
			region: 'center',
			width: '80%',
			autoScroll: true,
			dockedItems: [
				{
					xtype: 'toolbar',
					dock: 'top',
					defaults: {
						margin: '0 3px 0 3px',
					},

					items: [
						{
							xtype: 'button',
							text: 'Изменить',
							handler: 'openEditor',
							id: 'helpButtonOpenEditor',
						},
						{
							xtype: 'button',
							text: 'Обновить',
							handler: 'loadText',
						},
						{
							xtype: 'tbspacer',
							flex: 1,
						},
					]
				},
			],


			tools: [
				{
					type: 'print',
					handler: 'printContent',
					tooltip: 'Печать'
				}
			],
			//stateful: true,
		},

	]
});
