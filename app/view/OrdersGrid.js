Ext.define('Opt.view.OrdersGrid', {
	extend: 'Ext.grid.Panel',
	title: 'Список заказов',
	alias: 'widget.ordersgridpanel',
	requires: [
		'Opt.view.OrdersGridController',
	],

	store: null,
	controller: 'ordersgridpanel',

	bufferedRenderer: false,

	tools: [
		{
			type: 'print',
			handler: 'printTable',
			tooltip: 'Печать'
		}
	],

	listeners: {
		celldblclick: 'onCellDblClick',
	},

	viewConfig: {
		preserveScrollOnRefresh: false,
		getRowClass: function (record, rowIndex, rowParams, store) {
			//console.log(record);
			var cl = '';
			var departure_time = record.get("departure_time");
			var arriving_time = record.get("arriving_time");
			var arriving_time_end = record.get("arriving_time_end");
			var waiting_time = record.get("waiting_time");
			var timewindow_begin = record.get("timewindow_begin");
			var timewindow_end = record.get("timewindow_end");
			var node_type = record.get('node_type');
			var isAdded = record.get('isAdded');

			var timewindow_end = record.get("timewindow_end");
			if (departure_time > 0 && arriving_time > 0) {
				if (departure_time >= timewindow_begin || departure_time <= timewindow_end) {

				} else {
					cl = cl + ' row-bk-red';
				}
			}
			if (arriving_time_end - arriving_time > 0 || waiting_time > 0) {
				cl = cl + ' row-bk-green';
			}

			if (node_type != 0) {
				if (timewindow_begin > timewindow_end) {
					cl = cl + ' bkRed row-bk-white';
				}
			}

			if (node_type == 0) {
				return cl = cl + ' bkGrey';
			}

			return cl;
		},
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
			text: 'Расст.',
			align: 'right',
			dataIndex: 'distance_string',
			renderer: 'getDistanceString',
			//width:55,
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
			flex: 2,
			align: 'center',
			renderer: 'getArrivingTime',
		},

		{
			text: 'Разгр.',
			flex: 1,
			align: 'center',
			dataIndex: 'service_time',
			renderer: 'getServiceTime',
		},
		{
			text: 'Отпр.',
			dataIndex: 'departure_time',
			flex: 2,
			align: 'center',
			renderer: 'getDepartureTime',
		},
		]
	}

});