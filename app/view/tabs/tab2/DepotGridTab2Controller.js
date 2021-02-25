Ext.define('Opt.view.tabs.tab2.DepotGridTab2Controller', {
	extend: 'Opt.view.DepotGridController',
	alias: 'controller.tab2depotgrid',
	requires: [
		'Opt.ux.GridPrinter',
		'Opt.view.dialog.MainDepotEdit',
		'Opt.view.dialog.DepotEdit',
	],

	init: function () {
		var self = this;
	},

	openMainDepoDialog: function(){
		var self = this;
		var mainDepot = Opt.app.getMainDepot();
		var record = mainDepot;

		if (!this.mainDepotEditDialog || this.mainDepotEditDialog.destroyed) this.mainDepotEditDialog = Ext.create('widget.maindepotedit');
		this.mainDepotEditDialog.down('form').loadRecord(record);

		var form = this.mainDepotEditDialog.down('form').getForm();
		form.setValues({
			timewindow_begin_1: secToHHMM(record.get("timewindow_begin")),
			timewindow_end_1: secToHHMM(record.get("timewindow_end")),
		});

		this.mainDepotEditDialog.show().focus();
	},

       	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		var self = this;

		if (!this.depotEditDialog || this.depotEditDialog.destroyed) this.depotEditDialog = Ext.create('widget.depotedit');
		this.depotEditDialog.down('form').loadRecord(record);

		var form = this.depotEditDialog.down('form').getForm();
		form.setValues({
			timewindow_begin_1: secToHHMM(record.get("timewindow_begin")),
			timewindow_end_1: secToHHMM(record.get("timewindow_end")),
			service_time_min: Math.ceil(record.get("service_time") / 60),
		});

		this.depotEditDialog.show().focus();
	},

	refreshDepots: function(){
		var self = this;
		var grid = this.getView();
		var store = grid.getStore();
		var params = {
			param: 'LoadPlaces',
		};

		self.getView().mask("Загрузка");

		Ext.Ajax.request({
			url: 'api/db/db_1cbase',
			method: 'GET',
			params: params,
			success: function (response) {
 				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					Opt.app.showError("Ошибка!", error.message);
					return;
        			}
				store.suspendEvents();
				store.removeAll();
				//store.loadData(respObj.data);
				for(var i=0; i < respObj.data.length; i++){
					var rec = Ext.create('Opt.model.Depot', respObj.data[i]);
					store.add(rec);
				}
				store.save();
				store.resumeEvents();
				self.getView().unmask();
				self.getView().view.refresh();
			},

			failure: function (response) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
				self.getView().unmask();
			}
		});

	},
});