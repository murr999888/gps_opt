Ext.define('Opt.Application', {
	extend: 'Ext.app.Application',
	requires: [
		'Opt.util.HttpStateProvider',
	],
	name: 'Opt',
	models: [
		'Server',
		'User',
		'Auto',
		'Auto2',
		'RouteList',
		'RouteLegs',
		'DroppedOrder',
		'OrderGood',
		'AllowedAuto',
		'AutosGroup',
		'SettingsGlobal',
		'SettingsUser',
		'Drivers',
		'HelpTableContent',
		'CalcLog',
		'FuelStation',
		'Depot',
		'MainDepot',
		'Traffic',
		'TrafficPoints',
		'RoadSign',
		'DepotGood',
		'DeliveryGroup',
	],
	stores: [
		'Auto',
		'Auto2',
		'ClientGroup',
		'Product',
		'AutosGroup',
		'SettingsGlobal',
		'SettingsUser',
		'Drivers',
		'HelpTableContent',
		'DroppedGoodsStore',
		'OrdersUnloadingGoodsStore',
		'OrdersLoadingGoodsStore',
		'RoutesUnloadingGoodsStore',
		'RoutesLoadingGoodsStore',
		'CalcLog',
		'FuelStations',
		'MainDepot',
		'Depots',
		'Traffic',
		'RoadSigns',
		'RefuelMode',
		'CalcAlgorithm',
		'TempResults',
		'DeliveryGroups',
	],

	controllers: [
		'Root'
	],

	setSocket: function (socket) {
		this.socket = socket;
	},

	getSocket: function () {
		return this.socket;
	},

	getMainDepot: function () {
		var store = Ext.getStore("MainDepot");
		var mainDepot = store.getAt(0);
		return mainDepot;
	},

	setMainDepot: function (depot) {
		var store = Ext.getStore("MainDepot");
		var record  = Ext.create("Opt.model.MainDepot", depot);
		record.set("in_use", true);
		record.set("node_type", 0);
		record.set("goods", []);
		record.set("strings", []);
      		record.set("goods_capacity_in",[]);
       		record.set("goods_capacity_out",[]);

		store.insert(0, record);
		store.sync();
	},

	setUser: function (data) {
		var reader = Ext.create('Ext.data.reader.Json', {
			model: 'Opt.model.User'
		});
		this.user = reader.readRecords(data).getRecords()[0];
	},

	getUser: function () {
		return this.user;
	},

	setServer: function (data) {
		var reader = Ext.create('Ext.data.reader.Json', {
			model: 'Opt.model.Server'
		});
		this.server = reader.readRecords(data).getRecords()[0];
	},

	getServer: function () {
		return this.server;
	},

	showError: function (title, message) {
		if (typeof title === 'undefined') {
			title = 'Внимание!';
		}
		if (Ext.isString(message)) {
			Ext.Msg.alert(title, message);
		} else if (message && message.responseText) {
			Ext.Msg.alert(title, '' +
				'<br><br><textarea readonly rows="5" style="resize: none; width: 100%;">' +
				message.responseText + '</textarea>');
		} else if (message.statusText) {
			Ext.Msg.alert(title, message.statusText);
		} else {
			Ext.Msg.alert(title, "Ошибка соединения.");
		}
	},

	showToast: function (title, message, autoClose) {
		var params = {
			html: message,
			title: title,
			bodyStyle: { "background-color": "#fff" },
			minWidth: 200,
			closable: true,
			align: 'br',
			autoCloseDelay: 5000,
			closeable: true
		};

		if (typeof autoClose === 'undefined') {

		} else {
			params.autoClose = autoClose
		}

		Ext.toast(params);
	},

	getPrintTmpl: function () {
		var printTmpl = new Ext.XTemplate(
			'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
			'<html>',
			'<head>',
			'<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />',
			'<link type="text/css" rel="stylesheet" href="css/print.css?' + Date.now() + '" />',
			'<title>{title}</title>',
			'</head>',
			'<body><h3>{title}</h3>{content}</body>',
			'</html>'
		);

		return printTmpl;
	},

	onAppUpdate: function () {
		Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
			function (choice) {
				if (choice === 'yes') {
					window.location.reload();
				}
			}
		);
	},
});