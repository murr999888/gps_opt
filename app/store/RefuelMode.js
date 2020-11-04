Ext.define('Opt.store.RefuelMode', {
    	extend: 'Ext.data.Store',
	proxy: {
		type: 'memory',
	},
	data: [
		{
			id: 0,
			name: '< не рассчитывать >',
    		}, 
		{
       			id: 1,
			name: 'сначала заправить..',
    		}, 
		{
       			id: 2,
			name: 'по расходу топлива',
		}, 
	]
});