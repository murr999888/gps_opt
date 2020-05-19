Ext.define('Opt.store.CalcLog', {
    	extend: 'Ext.data.Store',
    	model: 'Opt.model.CalcLog',
	proxy: {
        	type: 'ajax',
            	writer: {
			allowSingle: false,
			writeAllFields: true,
	                type: 'json',
       		        //successProperty: 'success',
	              	//rootProperty: 'data',
                	//messageProperty: 'message'
            	},
            	reader: {
	                type: 'json',
       		        successProperty: 'success',
                	rootProperty: 'data',
                	messageProperty: 'message'
            	},
        	api: {
    			create  : 'api/log/create',
    			read    : 'api/log/read',
    			update  : 'api/log/update',
    			destroy : 'api/log/delete'
		},
    	},
});