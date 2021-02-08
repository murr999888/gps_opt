Ext.define('Opt.model.DeliveryGroup', {
    	extend: 'Ext.data.Model',
	//identifier: 'negative',
	//idProperty: 'baseId',
    	fields: [
		{
        		name: 'id',
        		type: 'string',
		},
		{
        		name: 'name',
        		type: 'string',
		},
		{
        		name: 'transit_restricted',
        		type: 'boolean',
		},
		{	
			name:'displayField', 
			convert: function(value, record) {
				if (record.get('id') == "00000000-0000-0000-0000-000000000000"){
					return record.get('name');
				} else {
    					return record.get('name') + (record.get('transit_restricted') ? ' (транзит запрещен)' : '');
				}
			}
		},
 	],
});