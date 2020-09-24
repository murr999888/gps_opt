Ext.define('Opt.view.tabs.tab3.TrafficGridTab3Controller', {
	extend: 'Opt.view.TrafficGridController',
	alias: 'controller.tab3trafficgrid',
	checkedAll: true,
	trafficEdit: null,
	stateful: true,
	stateId: 'tab3trafficgridpanel',
	trafficEdit: null,

	requires: [
		'Opt.view.dialog.TrafficEdit.TrafficEditMain',
	],

	loadTraffic: function(){
		var store = this.getView().getStore();
		store.reload();
	},

	deleteTrafficRecords: function(selection){
		var store = this.getView().getStore();
		for (var i=0; i<selection.length; i++) {
			store.remove(selection[i]);
		}
		store.sync();
	},

	removeTraffic: function(){
		var self = this;
		var grid = this.getView();

        	var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}
	
		Ext.Msg.show({
			title: 'Внимание',
			message: 'Вы собираетесь удалить ' + selection.length + ' строк. Продолжить?',
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION,
			fn: function (btn) {
				if (btn === 'yes') {
					self.deleteTrafficRecords(selection);
				} else if (btn === 'no') {
					return;
				}
			}
		});
	},

	addTraffic: function(){
		if (!this.trafficEdit) {
			this.trafficEdit = Ext.create('widget.trafficedit');
		}
        	var record = Ext.create('Opt.model.Traffic');
		record.set('points',[]);

        	record.store = this.getView().getStore();
		this.trafficEdit.down('trafficpointsgridpanel').getStore().removeAll();

        	this.trafficEdit.down('form').loadRecord(record);
        	this.trafficEdit.show().focus();
	},

	onEditRecord : function (grid, rowIndex, colIndex, item, e, record) {
		if (!this.trafficEdit) {
			this.trafficEdit = Ext.create('widget.trafficedit');
		}

                this.trafficEdit.down('trafficpointsgridpanel').getStore().removeAll();
        	this.trafficEdit.down('form').loadRecord(record);
		this.trafficEdit.down('trafficpointsgridpanel').getStore().loadData(record.get("points"));
        	this.trafficEdit.show().focus();
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		this.fireEvent("getTrafficLineOnMap", record.get('id'));
	},

	onMapRender: function (comp, map, layers) {
		//this.showFuelStationsOnMap();
	},
});