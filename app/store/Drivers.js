Ext.define('Opt.store.Drivers', {
    	extend: 'Ext.data.Store',
    	model: 'Opt.model.Drivers',
	//autoLoad: true,
	proxy: {
        	type: 'ajax',
		url: 'api/db/db_1cbase',
		
		extraParams:{
			param: 'Drivers'
		},

		actionMethods: {
            		read: 'GET',
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
        		var emptyRecord = Ext.create('Opt.model.Drivers', {
				id: 0,
				name: '< не выбран >',
			});

            		this.autoSync = false;
            		this.insert(0, emptyRecord);
            	}
        }
});


