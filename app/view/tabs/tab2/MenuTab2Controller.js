Ext.define('Opt.view.tabs.tab2.MenuTab2Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menutab2controller',

	setDefaultValues: function () {
		var form = Ext.getCmp("formparamtab2").getForm();

		form.setValues({
			formparamtab2date: new Date(),
			maxslacktime: 5,
			maxsolvetime: 15,
			maxordersinroute: 0,
			maxraces: 1,
			refuelmode: 0,
			refuel_full_tank: false,
			useGLS: false,
			solutionstrategy: 3,
			fixedcostallvehicles: 0,
			globalspancoeff_time: 0,
		});
	},

	onDateChange: function (field, newValue, oldValue, eOpts) {
		this.fireEvent("distributed_orders_change_date");
	},

	onRefuelModeSelect: function(combo, record, eOpts){
		var form = Ext.getCmp("formparamtab2").getForm();
		form.setValues({
			refuel_full_tank: false,
		});	

		if (record.get("id") == 2) {
			Ext.getCmp('formparamtab2refuel_full_tank').setDisabled(false);
		} else {
			Ext.getCmp('formparamtab2refuel_full_tank').setDisabled(true);
		}
		this.fireEvent("tab2refuelmodeselected");
	},
});
