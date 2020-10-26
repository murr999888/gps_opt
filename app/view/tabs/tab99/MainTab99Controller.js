Ext.define('Opt.view.tabs.tab99.MainTab99Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.mainTab99Controller',
	requires: [
		'Opt.ux.GridPrinter',
	],

	rw: null,

	init: function () {
		var self = this;
		Ext.tip.QuickTipManager.init();

		var isAdmin = Opt.app.user.get('isadmin');
		if (!isAdmin) {
			Ext.getCmp('helpButtonOpenEditor').setDisabled(true);
		}

		Ext.getStore('HelpTableContent').on('load', function () {
			var grid = Ext.getCmp('helptabletab99');
			grid.getSelectionModel().select(0);
		})
	},

	listen: {
		controller: {
			'*': {
				refreshHelp: 'loadText',
			}
		}
	},

	loadText: function () {
		var filename = this.filename;
		var helpcontenttab99 = Ext.getCmp('helpcontenttab99');
		Ext.Ajax.request({
			url: 'help.php',
			method: 'GET',
			params: {
				param: 'getHelp',
				filename: filename,
			},

			success: function (response, opts) {
				helpcontenttab99.setHtml(response.responseText);
				helpcontenttab99.body.scrollTo('Top');
			},

			failure: function (response, opts) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
			}
		});
	},

	afterRender: function () {

	},

	openEditor: function () {
		var filename = this.filename;
		var editor = Ext.create('Opt.view.dialog.HelpEditor', { filename: filename }).show();
	},

	onCellClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		if (this.filename != record.get('file')) {
			this.filename = record.get('file');
			this.loadText();
		}
	},

	onSelectRow: function (row, record, index) {
		if (this.filename != record.get('file')) {
			this.filename = record.get('file');
			this.loadText();
		}
	},

	getNum: function (value, metaData, record, rowIndex) {
		if(!rowIndex) {
                 	if (!this.rw) this.rw = 0;
			return this.rw++;
		} else {
			this.rw = null;
			return rowIndex++;
		};
	},

	refreshTableContent: function () {
		this.rw = null;
		Ext.getStore('HelpTableContent').reload();
	},

	printTable: function () {
		this.rw = null;
		var grid = Ext.getCmp("helptabletab99");
		Opt.ux.GridPrinter.print(grid);
	},

	printContent: function () {
		var helpcontenttab99 = Ext.getCmp('helpcontenttab99');
		var height = screen.height;
		var width = screen.width;

		var win = window.open("", "Справка", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=" + width + ",height=" + height);
		var html = helpcontenttab99.html;

		var find = './help';
		var re = new RegExp(find, 'g');
		html = html.replace(re, window.location.href + '/help');
		win.document.body.innerHTML = html;
	},

	printAllHelp: function(){
		var height = screen.height;
		var width = screen.width;
	        //window.open("help.php?param=getAllHelp", "Вся справка", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=" + width + ",height=" + height);
		window.open("help.php?param=getAllHelp", "Вся справка");
	},
});
