Ext.define('Opt.view.dialog.RegisterController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.register',

	onCreateClick: function () {
		var form = this.lookupReference('form');
		if (form.isValid()) {
			Ext.Ajax.request({
				scope: this,
				method: 'POST',
				url: 'api/register',
				params: form.getValues(),
				callback: this.onCreateReturn
			});
		}
	},

	onCreateReturn: function (options, success, response) {

		if (success) {
			var answ = Ext.decode(response.responseText);
			if (answ.id == '0') {
				Opt.app.showError('Такое имя пользователя занято.');
				return;
			}

			this.closeView();
			Opt.app.setUser(Ext.decode(response.responseText));
			Opt.app.showToast('Регистрация успешна..');
		} else {
			Opt.app.showError(response);
		}

	}
});
