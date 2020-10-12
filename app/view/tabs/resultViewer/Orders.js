Ext.define('Opt.view.tabs.resultViewer.Orders', {
	extend: 'Opt.view.RouteLegGrid',
	alias: 'widget.resultviewerorders',
	requires: [
		'Opt.view.tabs.resultViewer.OrdersController',
	],

	tools: [
		{
			type: 'search',
			handler: 'routeZoom',
			tooltip: 'Масштаб: весь маршрут'
		},
		{
			type: 'print',
			handler: 'printTable',
			tooltip: 'Печать'
		},
	],

	controller: 'resultviewerorders',
	listeners: {
		celldblclick: 'onCellDblClick',
	},

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
				dataIndex: 'num_in_routelist',
				renderer: 'getNum',
			},
			{	
				menuDisabled: true,
				hideable: false,
				sortable: false,
				resizable: false,
				text: '<div style="height: 14px; width: 14px; background: url(css/images/gas_station_16x16.png) no-repeat; no-repeat center center; background-size: 14px; "></div>',       
				width: 25,
				renderer: 'getFuelIcon',
				align: 'center',
			},

			{
				text: 'Расст.',
				align: 'right',
				dataIndex: 'distance_string',
				renderer: 'getDistanceString',
				flex: 2,
			},
			{
				text: 'Пункт',
				cellWrap: true,
				flex: 5,
				dataIndex: 'full_name',
				renderer: 'getSod',
			},
			{
				text: 'Ш',
				align: 'right',
				flex: 1,
				dataIndex: 'penalty',
				renderer: 'getPenalty',
			},

			{
				text: 'Окно',
				cellWrap: true,
				align: 'center',
				flex: 2,
				dataIndex: 'timewindow_string',
			},
			{
				text: 'Приб.',
				dataIndex: 'arriving_time',
				renderer: 'getArrivingTime',
				align: 'center',
				flex: 2,
			},

			{
				text: 'Разгр.',
				align: 'center',
				flex: 2,
				renderer: 'getServiceTime',
				dataIndex: 'service_time',
			},

			{
				text: 'Отпр.',
				dataIndex: 'departure_time',
				renderer: 'getDepartureTime',
				align: 'center',
				flex: 2,
			},
		]
	}
});