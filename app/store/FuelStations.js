Ext.define('Opt.store.FuelStations', {
    	extend: 'Ext.data.Store',
	model: 'Opt.model.FuelStation',
	autoLoad: true,
	autoSync: true,
	pageSize: undefined,
	sorters: [
    		{
        		property: 'klient_name',
        		direction: 'ASC'
    		}
	],

	//sortRoot: 'clientName',
	sortOnLoad: true,
});