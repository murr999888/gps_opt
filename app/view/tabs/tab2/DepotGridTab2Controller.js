Ext.define('Opt.view.tabs.tab2.DepotGridTab2Controller', {
	extend: 'Opt.view.DepotGridController',
	alias: 'controller.tab2depotgrid',
	requires: [
		'Opt.ux.GridPrinter',
		'Opt.view.dialog.MainDepotEdit',
	],

	init: function () {
		var self = this;
		this.getView().getSelectionModel().setSelectionMode('MULTI');
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
});