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
		//this.getView().getSelectionModel().setSelectionMode('MULTI');
	},

	openMainDepoDialog: function(){
		var self = this;
		var mainDepot = Opt.app.getMainDepot();
		var record = mainDepot;

		if (!this.mainDepotEdit) this.mainDepotEdit = Ext.create('widget.maindepotedit');
		this.mainDepotEdit.down('form').loadRecord(record);

		var form = this.mainDepotEdit.down('form').getForm();
		form.setValues({
			timewindow_begin_1: secToHHMM(record.get("timewindow_begin")),
			timewindow_end_1: secToHHMM(record.get("timewindow_end")),
		});

		this.mainDepotEdit.on('close', function (panel) {
			//self.onCloseEditOrderDialog(panel);
		});

		this.mainDepotEdit.show().focus();
	},

       	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		var self = this;

		if (!this.depotEdit) this.depotEdit = Ext.create('widget.depotedit');
		this.depotEdit.down('form').loadRecord(record);

		var form = this.depotEdit.down('form').getForm();
		form.setValues({
			timewindow_begin_1: secToHHMM(record.get("timewindow_begin")),
			timewindow_end_1: secToHHMM(record.get("timewindow_end")),
			service_time_min: Math.ceil(record.get("service_time") / 60),
		});


		this.depotEdit.on('close', function (panel) {
			//self.onCloseEditOrderDialog(panel);
		});

		this.depotEdit.show().focus();
	},

	refreshDepots: function(){
		var self = this;
		var grid = this.getView();
		var store = grid.getStore();
//var store = Ext.getStore('Depots');
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