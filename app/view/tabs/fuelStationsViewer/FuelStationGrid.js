Ext.define('Opt.view.tabs.fuelStationsViewer.FuelStationGrid', {
	extend: 'Ext.grid.Panel',
	title: 'Заправки',
	alias: 'widget.fuelstationsviewerfuelstationgridpanel',
	controller: 'fuelstationsviewerfuelstationgrid',
	requires: [
		'Opt.view.tabs.fuelStationsViewer.FuelStationGridController',
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

	tools: [
		{
			type: 'refresh',
			handler: 'loadFuelStation',
			tooltip: 'Загрузить'
		},

		{
			type: 'print',
			handler: 'printTable',
			tooltip: 'Печать'
		}
	],
/*
	dockedItems: 
	[
		{
			xtype: 'toolbar',
			dock: 'top',
			items: [
					{
						xtype: 'button',
						id: 'fuelstationsfindbutton',
						text: 'Найти',
						handler: 'findFuelStations',
						margin : '0 3px 0 3px',

					},      	
					{
						xtype: 'button',
						id: 'fuelstationsclearbutton',
						text: 'Очистить',
						handler: 'clearFuelStations',
						margin : '0 3px 0 3px',
					},      	
      					{
						xtype: 'textfield',
						labelWidth: 38,
						fieldLabel: '',
						value: '',
						margin : '0 0 0 3px',
						id: 'fuelstationsfindfield',
						emptyText: 'Мариуполь заправка',
						flex: 1,
						listeners: {
              						specialkey: function(f,e){
                						if (e.getKey() == e.ENTER) {
                    							this.fireEvent('findFuelStations', this);
                						}
              						}
            					},
					},
					{
						xtype: 'button',
						id: 'fuelstationsshowbutton',
						text: 'Показать',
						handler: 'showFuelStationsOnMap',
						margin : '0 3px 0 3px',
					},
					{
						xtype: 'button',
						id: 'fuelstationsremovebutton',
						text: 'Убрать',
						handler: 'clearFuelStationsOnMap',
						margin : '0 3px 0 3px',
					},
			]
		},
		{
			xtype: 'toolbar',
			dock: 'top',
			items: [
					{
						xtype: 'button',
						id: 'fuelstationsdeletebutton',
						text: 'Удалить',
						handler: 'deleteFuelStations',
						margin : '0 0 0 3px',

					},      	
			]
		},
	],
*/
	columns: {
		defaults: {
			//sortable: false,
			hideable: false
		},

		items: [
		{
			hideable: false,
			resizeable: false,
			menuDisabled: true,
			xtype: 'checkcolumn',
			text: '',
			dataIndex: 'in_use',
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
			text: 'Запр.',
			flex: 1,
			align: 'center',
			hideable: true,
			dataIndex: 'service_time',
			renderer: 'getServiceTime',
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