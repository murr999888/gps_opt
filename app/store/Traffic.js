Ext.define('Opt.store.Traffic', {
    	extend: 'Ext.data.Store',
    	model: 'Opt.model.Traffic',
	autoLoad: true,
	//autoSync: true,
	pageSize: undefined,
	proxy: {
        	type: 'ajax',
            	writer: {
			allowSingle: false,
			writeAllFields: true,
	                type: 'json',
            	},
            	reader: {
	                type: 'json',
       		        successProperty: 'success',
                	rootProperty: 'data',
                	messageProperty: 'message'
            	},
        	api: {
    			create  : 'api/traffic/create',
    			read    : 'api/traffic/read',
    			update  : 'api/traffic/update',
    			destroy : 'api/traffic/delete'
		},
    	},
});