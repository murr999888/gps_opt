Ext.define('Opt.view.tabs.tab2.MenuTab2Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menutab2controller',

	setDefaultValues: function () {
		var form = Ext.getCmp("formparamtab2").getForm();

		form.setValues({
			formparamtab2date: new Date(),
			maxslacktime: 5,
			maxsolvetime: 60,
			maxordersinroute: 0,
			refuelmode: 0,
			useGLS: false,
		});
	},

	onDateChange: function (field, newValue, oldValue, eOpts) {
		this.fireEvent("distributed_orders_change_date");
	},
});
