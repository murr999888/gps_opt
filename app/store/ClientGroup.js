Ext.define('Opt.store.ClientGroup', {
    	extend: 'Ext.data.Store',
    	model: 'Opt.model.ClientGroup',
	autoLoad: true,
	proxy: {
        	type: 'ajax',
		url: 'api/db/db_1cbase',
		
		extraParams:{
			param: 'ClientGroups'
		},

		actionMethods: {
            		read   : 'GET',
            		//update : 'POST'
        	},

            	reader: {
	                type: 'json',
       		        successProperty: 'success',
                	rootProperty: 'data',
                	messageProperty: 'message'
            	},
    	},

	listeners: {
        	load: function (store, records, successful, operation, eOpts) {
        		var emptyRecord = Ext.create('Opt.model.ClientGroup', {
				id: 0,
				name: '< по всем >',
			});

            		this.autoSync = false;
            		this.insert(0, emptyRecord);
            	}
        }
});


