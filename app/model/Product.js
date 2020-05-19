Ext.define('Opt.model.Product', {
    	extend: 'Ext.data.Model',
	identifier: 'negative',
    	fields: [
		{
        		name: 'id',
        		type: 'string'
		},
		{
			name: 'name',
			type: 'string'
		},
		{
			name: 'short_name',
			type: 'string'
		}
		]
	}
);