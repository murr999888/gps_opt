Ext.define('Opt.store.CalcAlgorithm', {
    	extend: 'Ext.data.Store',
	proxy: {
		type: 'memory',
	},
	data: [
		{
			id: 15,
			name: 'Automatic',
		}, 
		{
			id: 3,
			name: 'PathCheapestArc',
		}, 
		{
			id: 10,
			name: 'Savings',
		}, 
		{
			id: 6,
			name: 'AllUnperformed',
		}, 
		{
			id: 1,
			name: 'GlobalCheapestArc',
		}, 
		{
			id: 2,
			name: 'LocalCheapestArc',
		}, 
		{
			id: 12,
			name: 'FirstUnboundMinValue',
		},
	]
});