Ext.define('Opt.view.dialog.LoginController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.login',

	requires: [
		'Opt.view.dialog.Register'
	],

	init: function () {

		this.lookupReference('registerButton').setDisabled(
			!Opt.app.getServer().get('registration'));
	},

	login: function () {

		var form = this.lookupReference('form');
		if (form.isValid()) {
			Ext.get('spinner').setVisible(true);
			this.getView().setVisible(false);

			Ext.Ajax.request({
				scope: this,
				method: 'POST',
				url: 'api/login',
				params: form.getValues(),
				callback: function (options, success, response) {
					var user, password;
					Ext.get('spinner').setVisible(false);
					if (success) {
						if (this.lookupReference('rememberField').getValue()) {
							user = Ext.util.Base64.encode(this.lookupReference('userField').getValue());
							password = Ext.util.Base64.encode(this.lookupReference('passwordField').getValue());
							Ext.util.Cookies.set('user', user, Ext.Date.add(new Date(), Ext.Date.YEAR, 1));
							Ext.util.Cookies.set('password', password, Ext.Date.add(new Date(), Ext.Date.YEAR, 1));
						}
						Opt.app.setUser(Ext.decode(response.responseText));
						this.fireViewEvent('login');
					} else {
						this.getView().setVisible(true);

						if (response.status === 401) {
							Opt.app.showError("Необходима авторизация");
						} else {
							Opt.app.showError(response.responseText);
						}
					}
				}
			});
		}
	},

	logout: function () {

		Ext.util.Cookies.clear('user');
		Ext.util.Cookies.clear('password');
		Ext.Ajax.request({
			scope: this,
			method: 'POST',
			url: 'api/logout',
			callback: function () {
				window.location.reload();
			}
		});
	},

	onAfterRender: function (field) {
		field.focus();
	},

	onSpecialKey: function (field, e) {
		if (e.getKey() === e.ENTER) {
			this.login();
		}
	},

	onLoginClick: function () {
		Ext.getElementById('submitButton').click();
		this.login();
	},

	onRegisterClick: function () {
		Ext.create('Opt.view.dialog.Register').show();
		//this.getView().setVisible(false);
	}
});
