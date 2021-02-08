Ext.define('Opt.view.tabs.MainTabController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.mainTabController',

	requires: [
		'Opt.view.dialog.DeliveryGroupsList',
	],

	openDeliveryGroups: function(){
		if (!this.deliveryGroupsList)  this.deliveryGroupsList = Ext.create('widget.deliverygroupslist');
		this.deliveryGroupsList.show().focus();
	},

	logout: function () {
		Ext.Msg.show({
			title: 'Внимание',
			message: 'Правда выходим из программы?',
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION,
			fn: function (btn) {
				if (btn === 'yes') {
					Ext.create('Opt.view.dialog.LoginController').logout();
				} else if (btn === 'no') {
					return;
				}
			}
		});
	},
});