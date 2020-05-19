Ext.define('Opt.store.AutosGroup', {
    	extend: 'Ext.data.Store',
    	model: 'Opt.model.AutosGroup',
	//autoLoad: true,
	proxy: {
        	type: 'ajax',
		url: 'api/db/db_1cbase',
		
		extraParams:{
			param: 'AutosGroups'
		},

		actionMethods: {
            		read   : 'GET',
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
        		var emptyRecord = Ext.create('Opt.model.AutosGroup', {
				id: 0,
				name: '< по всем >',
			});

            		this.autoSync = false;
            		this.insert(0, emptyRecord);
            	}
        }
});


