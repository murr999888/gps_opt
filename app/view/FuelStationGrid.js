Ext.define('Opt.view.FuelStationGrid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.fuelstationgridpanel',
	controller: 'fuelstationgrid',
	requires: [
		'Opt.view.FuelStationGridController',
	],

	listeners: {
		celldblclick: 'onCellDblClick',
	},

	store: 'FuelStations',
	remoteSort: false,

	viewConfig: {
		stripeRows: false,
		preserveScrollOnRefresh: true,
		getRowClass: function (record, rowIndex, rowParams, store) {
			var cl = '';

			if (!record.get('in_use') == true) {
				cl = cl + ' row-bk-grey';
			}

			return cl;
		},
	},

	bufferedRenderer: false,
	columns: {
		defaults: {
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
			//checked: true,
			listeners: {
				checkchange: 'onChangeInUse',
				headercheckchange: 'onHeaderCheckChange',
			}
		},

		{
			text: 'Наименование',
			flex: 1,
			dataIndex: 'klient_name',
			cellWrap: true,
			hideable: false,
			hidden: false,
		},
		{
			text: 'Город',
			flex: 1,
			dataIndex: 'city',
			cellWrap: true,
			hideable: true,
			hidden: false,
		},
		{
			text: 'Адрес',
			flex: 3,
			dataIndex: 'adres',
			cellWrap: true,
			hideable: true,
			hidden: false,
		},
		{
			//disabled: true,
			hideable: false,
			xtype: 'checkcolumn',
			text: 'Газ',
			dataIndex: 'gas',
			menuDisabled: true,
			headerCheckbox: false,
			width: 50,
			//checked: true,
			listeners: {
        			beforecheckchange: function() {
            				return false; // HERE
        			}
    			}
		},
		]
	},
});