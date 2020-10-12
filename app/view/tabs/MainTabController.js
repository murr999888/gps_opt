Ext.define('Opt.view.tabs.MainTabController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.mainTabController',

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