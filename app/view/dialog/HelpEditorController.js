Ext.define('Opt.view.dialog.HelpEditorController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.helpeditor',

	requires: [
		//'Opt.view.BaseWindow'
	],

	init: function () {
		Ext.tip.QuickTipManager.init();
	},

	afterRender: function () {
		var editor = this.getView().down('ckeditor');
		var filename = this.getView().filename;

		Ext.Ajax.request({
			url: 'help.php',
			method: 'GET',
			params: {
				param: 'getHelp',
				filename: filename,
			},

			success: function (response, opts) {
				editor.setValue(response.responseText);
			},

			failure: function (response, opts) {
				console.log('server-side failure with status code ' + response.status);
			}
		});
	},

	sendDataToServer: function (closeWindow) {
		var self = this;
		var editor = this.getView().down('ckeditor');
		var filename = this.getView().filename;
		Ext.Ajax.request({
			url: 'help.php',
			method: 'POST',
			params: {
				param: 'saveHelp',
				filename: filename,
				text: editor.getValue(),
			},

			success: function (response, opts) {
				editor.fieldChanged = false;
				self.fireEvent('refreshHelp');
				if (closeWindow) {
					self.getView().destroy();
				}

				Opt.app.showToast('Внимание!', 'Текст документа сохранен.');
			},

			failure: function (response, opts) {
				console.log('server-side failure with status code ' + response.status);
			}
		});
	},

	saveText: function () {
		this.sendDataToServer(false);
	},

	saveTextAndClose: function () {
		this.sendDataToServer(true);
	},

	closeEditor: function () {
		var self = this;
		var changed = this.getView().down('ckeditor').fieldChanged;
		if (changed) {
			Ext.Msg.show({
				title: 'Внимание',
				message: 'Измененные данные не будут сохранены. Продолжить?',
				buttons: Ext.Msg.YESNO,
				icon: Ext.Msg.QUESTION,
				fn: function (btn) {
					if (btn === 'yes') {
						self.getView().destroy();
					} else if (btn === 'no') {
						return;
					}
				}
			});
		} else {
			self.getView().destroy();
		}
	},
});

