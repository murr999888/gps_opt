Ext.define('Opt.view.tabs.tab2.MenuTab2Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menutab2controller',

	setDefaultValues: function () {
		var form = Ext.getCmp("formparamtab2").getForm();

		form.setValues({
			formparamtab2date: new Date(),
			worktime_begin_1: def_route_time_begin,
			worktime_begin: hmsToSecondsOnly(def_route_time_begin),
			worktime_end_1: def_route_time_end,
			worktime_end: hmsToSecondsOnly(def_route_time_end),
			useGlobalPenalty: true,
			globalPenalty: 3,
			maxslacktime: 0,
			maxsolvetime: 10,
			timebreakraces: 30,
		});
	},

	onDateChange: function (field, newValue, oldValue, eOpts) {
		this.fireEvent("distributed_orders_change_date");
	},

	onWorktimeBeginChange: function (field, newValue, oldValue, eOpts) {
		if (oldValue) {
			var seconds = hmsToSecondsOnly(newValue);
			var form = this.lookupReference('formparamtab2').getForm();

			form.setValues({
				worktime_begin: seconds
			});
		}
	},

	onWorktimeEndChange: function (field, newValue, oldValue, eOpts) {
		if (oldValue) {
			var seconds = hmsToSecondsOnly(newValue);
			var form = this.lookupReference('formparamtab2').getForm();

			form.setValues({
				worktime_end: seconds
			});
		}
	},

	setGlobalPenaltyField: function (checkboxVal) {
		var form = Ext.getCmp("formparamtab2");
		if (form) {
			var field = form.getForm().findField("globalPenalty");
			field.setReadOnly(!checkboxVal);
		}
	},

	onChangeUseGlobalPenalty: function (checkbox, newValue, oldValue, eOpts) {
		this.setGlobalPenaltyField(newValue);
	},
});
