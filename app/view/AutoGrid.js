Ext.define('Opt.view.AutoGrid', {
	extend: 'Ext.grid.Panel',
	title: 'Машины',
	alias: 'widget.autogridpanel',
	requires: [
		'Opt.view.AutoGridController',
	],

	listeners: {
		celldblclick: 'onCellDblClick',
	},

	viewConfig: {
		stripeRows: false,
		preserveScrollOnRefresh: true,
		getRowClass: function (record, rowIndex, rowParams, store) {
			var cl = '';

			if (!record.get('in_use') == true) {
				cl = cl + ' row-bk-grey';
			}

			if (record.get('route_begin_endtime') <= record.get('worktime_begin')
				|| record.get('worktime_end') <= record.get('worktime_begin')
				|| record.get('worktime_end') < record.get('route_begin_endtime')
				|| record.get('route_end_endtime') < record.get('route_begin_endtime')

			) {
				cl = cl + ' row-bk-brown';
			}

			if (record.get('worktime_begin') != 28800 || record.get('worktime_end') != 72000) {
				//cl = cl + ' fontitalic';
			}

			return cl;
		},
	},

	bufferedRenderer: false,

	columns: {
		defaults: {
			sortable: false,
			hideable: false
		},

		items: [
		{
			hideable: false,
			xtype: 'checkcolumn',
			text: '',
			dataIndex: 'in_use',
			menuDisabled: true,
			tooltip: 'Используется при расчете',
			headerCheckbox: true,
			width: 25,
			resizable: false,
			//checked: true,
			listeners: {
				checkchange: 'onChangeInUse',
				headercheckchange: 'onHeaderCheckChange',
			}
		},
		{	
			menuDisabled: true,
			hideable: false,
			sortable: false,
			resizable: false,
			tooltip: 'Признак выбранной заправки в Сначала заправить',
			text: '<div style="height: 14px; width: 14px; background: url(css/images/gas_station_16x16.png) no-repeat; no-repeat center center; background-size: 14px; "></div>',       
			width: 25,
			renderer: 'getFuelIcon',
			align: 'center',
		},

		{
			text: 'Кратко',
			flex: 2,
			dataIndex: 'name_short',
			cellWrap: true,
			hideable: true,
			hidden: false,
		},
		{
			text: 'Машина',
			flex: 3,
			dataIndex: 'name',
			cellWrap: true,
			hideable: true,
			hidden: true,
		},
		{
			text: 'Водитель',
			flex: 3,
			dataIndex: 'driver_name',
			renderer: 'getDriverName',
			cellWrap: true,
			hideable: true,
		},
		{
			text: 'Раб. время',
			flex: 1,
			dataIndex: 'worktime',
			renderer: 'getWorkTime',
			align: 'center',
			hideable: true,
			hidden: true,
		},
		{
			text: 'Выезд',
			flex: 1,
			dataIndex: 'route_begin_endtime',
			renderer: 'getRouteBeginTime',
			align: 'center',
			hidden: true,
			hideable: true,
		},
		{
			text: 'Возврат',
			flex: 1,
			dataIndex: 'route_end_endtime',
			renderer: 'getRouteEndTime',
			align: 'center',
			hidden: true,
			hideable: true,
		},
		{
			sortable: false,
			text: 'Вмест.',
			flex: 1,
			renderer: 'getCapacity',
			hideable: true,
			tooltip: 'Вместимость машины вода баллоны емкости',
		},
		{
			menuDisabled: true,
			hideable: true,
			sortable: false,
			align: 'center',
			text: 'Р',
			tooltip: 'Максимальное количество рейсов машины',
			width: 25,
			resizable: false,
			dataIndex: 'maxraces',
			hideable: true,
			hidden: true,
			renderer: 'getNumbers',
		},
		{
			menuDisabled: true,
			hideable: true,
			sortable: false,
			align: 'center',
			text: 'П',
			tooltip: 'Перерыв между рейсами, мин.',
			width: 25,
			resizable: false,
			dataIndex: 'race_breaking_time',
			hideable: true,
			hidden: true,
			renderer: 'getNumbers',
		},
		{
			menuDisabled: true,
			hideable: true,
			resizable: false,
			xtype: 'checkcolumn',
			tooltip: 'Признак использования газа',
			dataIndex: 'fuel_gas',
			text: 'Г',
			width: 25,
			listeners: {
        			beforecheckchange: function() {
            					return false; // HERE
        			}
    			},
		},
		{
			menuDisabled: true,
			hideable: true,
			sortable: false,
			align: 'center',
			tooltip: 'Емкость топливного бака',
			text: 'Бак',
			width: 40,
			dataIndex: 'fuel_tank_capacity',
			hideable: true,
			hidden: true,
			renderer: 'getNumbers',
		},
		{
			menuDisabled: true,
			hideable: true,
			sortable: false,
			align: 'center',
			tooltip: 'Расход топлива литров на 100 км',
			text: 'Расх.',
			width: 40,
			dataIndex: 'fuel_rate_by_100',
			hideable: true,
			hidden: true,
			renderer: 'getNumbers',
		},
		]
	},
});