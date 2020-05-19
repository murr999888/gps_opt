Ext.define('Opt.store.Auto2', {
    	extend: 'Ext.data.Store',
    	model: 'Opt.model.Auto2',

autoLoad: true,
/*
//autoSync: true,
	proxy: {
        	type: 'ajax',
            	writer: {
			writeAllFields: true,
	                type: 'json',
       		        successProperty: 'success',
                	rootProperty: 'data',
                	messageProperty: 'message'
            	},
            	reader: {
	                type: 'json',
       		        successProperty: 'success',
                	rootProperty: 'data',
                	messageProperty: 'message'
            	},
        	api: {
    			create  : 'api/autos/create',
    			read    : 'api/autos/read',
    			update  : 'api/autos/update',
    			destroy : 'api/autos/delete'
		},
    	},
*/

	listeners: {
        	load: function (store, records, successful, operation, eOpts) {
		}
	}
});