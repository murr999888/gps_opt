Ext.define('Opt.view.tabs.tab3.TrafficGridTab3', {
	extend: 'Opt.view.TrafficGrid',
	title: 'Пробки',
	alias: 'widget.tab3trafficgridpanel',
	controller: 'tab3trafficgrid',
	requires: [
		'Opt.view.tabs.tab3.TrafficGridTab3Controller',
	],

	listeners: {
		celldblclick: 'onCellDblClick',
	},

	store: 'Traffic',
	remoteSort: false,

	viewConfig: {
		stripeRows: false,
		preserveScrollOnRefresh: true,
	},

	bufferedRenderer: false,

	tools: [
		{
			type: 'refresh',
			handler: 'loadTraffic',
			tooltip: 'Загрузить'
		},

		{
			type: 'print',
			handler: 'printTable',
			tooltip: 'Печать'
		}
	],

	dockedItems: 
	[
		{
			xtype: 'toolbar',
			dock: 'top',
			items: [
				{
					xtype: 'button',
					id: 'trafficAddButton',
					text: 'Добавить',
					handler: 'addTraffic',
        			},      	
				{
					xtype: 'button',
					id: 'trafficRemoveButton',
					text: 'Удалить',
					handler: 'removeTraffic',
					margin : '0 3px 0 3px',
				},
				{
					xtype: 'tbspacer',
					flex: 1,
				},      	
				{
					xtype: 'button',
					id: 'trafficSendToOSRMButton',
					text: 'to OSRM',
					handler: 'sendTrafficToOSRM',
					margin : '0 3px 0 3px',
				},
			]
		},
	],
});