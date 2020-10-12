Ext.define('Opt.model.RouteLegs', {
    	extend: 'Ext.data.Model',
    	identifier: 'negative',
// node_type
// 0 - депо
// 1 - обычный заказ
// 2 - дополнительное место загрузки
// 3 - заправка

	fields: [
		{
        		name: 'in_use',
        		type: 'boolean',
		},

		{
        		name: 'id',
    		},
		{
        		name: 'node_type',
        		type: 'number',
			defaultValue: 1,
    		},
		{
        		name: 'isAdded',
        		type: 'boolean',
			defaultValue: true, 
    		},

		{
        		name: 'penalty',
        		type: 'number',
			defaultValue: 30, 
    		},

		{
        		name: 'city',
        		type: 'string',
			defaultValue: '',
    		},

		{
        		name: 'isOtherCity',
        		type: 'boolean',
			defaultValue: false,
    		},

		{
        		name: 'adres',
        		type: 'string',
			defaultValue: '',
    		},

		{
        		name: 'district',
        		type: 'string',
			defaultValue: '',
    		},

		{
        		name: 'dop',
        		type: 'string',
			defaultValue: '',
    		},

		{
        		name: 'goods',
    		},

		{
        		name: 'goods_filter',
			type: 'string',
			defaultValue: '',
    		},

		{
        		name: 'strings',
    		},

		{
        		name: 'full_name',
        		type: 'string',
			defaultValue: '',
    		},

		{
        		name: 'klient_id',
        		type: 'string',
			defaultValue: '',
    		},

		{
        		name: 'klient_name',
        		type: 'string',
			defaultValue: '',
    		},

		{
        		name: 'klient_group_id',
        		type: 'string',
			defaultValue: '',
    		},

		{
        		name: 'klient_group_name',
        		type: 'string',
			defaultValue: '',
    		},

		{
        		name: 'lat',
        		type: 'number',
    		},

		{
        		name: 'lon',
        		type: 'number',
    		},

		{
        		name: 'num_in_routelist',
        		type: 'number',
    		},

		{
        		name: 'order_id',
        		type: 'string',
    		},

		{
        		name: 'order_number',
        		type: 'string',
    		},

		{
        		name: 'order_date',
        		type: 'string',
    		},

		{
        		name: 'sod',
        		type: 'string',
			defaultValue: '',
    		},

		{
			name: 'weight',
			type: 'number'
		},

		{
			name: 'capacity',
			type: 'number'
		},

		{
        		name: 'timewindow_begin',
        		type: 'number',
    		},

		{
        		name: 'timewindow_end',
        		type: 'number',
    		},

		{
        		name: 'timewindow_string',
        		type: 'string',
			defaultValue: '',
    		},

		{
        		name: 'tochka_id',
        		type: 'string',
			defaultValue: '',
    		},

		{
        		name: 'tochka_name',
        		type: 'string',
			defaultValue: '',
    		},

		{
        		name: 'distance',
        		type: 'number',
			defaultValue: 0, 
    		},

		{
        		name: 'duration',
        		type: 'number',
			defaultValue: 0, 
    		},

		{
        		name: 'arriving_time',
        		type: 'number',
			defaultValue: 0, 
    		},

		{
        		name: 'arriving_time_end',
        		type: 'number',
			defaultValue: 0, 
    		},

		{
        		name: 'service_time',
        		type: 'number',
			defaultValue: 0,
    		},

		{
        		name: 'waiting_time',
        		type: 'number',
			defaultValue: 0,
    		},

		{
        		name: 'departure_time',
        		type: 'number',
			defaultValue: 0,
    		},
	],
});
