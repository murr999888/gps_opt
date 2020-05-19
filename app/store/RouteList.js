Ext.define('Opt.store.RouteList', {
    	extend: 'Ext.data.Store',
    	model: 'Opt.model.RouteList',
	proxy: {
        	type: 'ajax',
		url: 'api/db/db_1cbase',
		
		extraParams:{
			param: 'RouteListsOpt',
			includeTemplate: true,
		},
		actionMethods: {
            		read   : 'GET',
            		update : 'POST'
        	},
            	reader: {
	                type: 'json',
       		        successProperty: 'success',
                	rootProperty: 'data',
                	messageProperty: 'message'
            	},
    	},
});

