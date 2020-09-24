Ext.define('Opt.store.Auto2', {
    	extend: 'Ext.data.Store',
    	model: 'Opt.model.Auto2',
	autoLoad: true,
	pageSize: undefined,
	listeners: {
        	load: function (store, records, successful, operation, eOpts) {
		}
	}
});