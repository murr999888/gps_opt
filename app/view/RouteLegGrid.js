Ext.define('Opt.view.RouteLegGrid', {
	extend: 'Ext.grid.Panel',
	title: 'Пункты назначения',
	alias: 'widget.routeleggridpanel',
	requires: [
		'Opt.view.RouteLegGridController',
	],
	controller: 'routeleggrid',

	viewConfig: {
		//preserveScrollOnRefresh: true,
		getRowClass: function (record, rowIndex, rowParams, store) {
			//console.log(record);
			var cl = '';
			var departure_time = record.get("departure_time");
			var arriving_time = record.get("arriving_time");
			var arriving_time_end = record.get("arriving_time_end");
			var waiting_time = record.get("waiting_time");
			var timewindow_begin = record.get("timewindow_begin");
			var timewindow_end = record.get("timewindow_end");
			var isDepot = record.get('isDepot');
			var isAdded = record.get('isAdded');

			if (!isDepot & arriving_time > 0) {
				if (arriving_time < timewindow_begin || arriving_time > timewindow_end) {
					cl = cl + ' row-bk-red';
				}
			}

			if (!isDepot) {
				if (timewindow_begin > timewindow_end) {
					cl = cl + ' bkRed row-bk-white';
				}
			}

			if (arriving_time_end - arriving_time > 0 || waiting_time > 0) {
				cl = cl + ' row-bk-green';
			}

			if (isDepot) {
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

			{
				xtype: 'actioncolumn',
				iconCls: 'fa far fa-green fa-edit',
				menuDisabled: true,
				text: 'Ред.',
				//width: 50,
				flex: 2,
				align: 'center',
				items: [
					{
						handler: 'onEditRecord',

						getClass: function (value, metaData, record) {
							if (record.get("isDepot") == true) {
								return '';
							}
							return 'fa far fa-green fa-edit';
						},

						isDisabled: function (view, rowIndex, colIndex, item, record) {
							// Returns true if 'editable' is false (, null, or undefined)
							return record.get('isDepot') == true;
						}
					},
				]
			},
		]
	}
});