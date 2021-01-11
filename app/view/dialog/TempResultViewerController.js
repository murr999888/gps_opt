Ext.define('Opt.view.dialog.TempResultViewerController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.tempresultviewer',

	closeView: function () {
		this.getView().hide();
	},
});