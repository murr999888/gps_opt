Ext.define('Opt.view.tabs.MainTabController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.mainTabController',

	logout: function () {
		Ext.create('Opt.view.dialog.LoginController').logout();
	},
});