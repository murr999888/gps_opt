Ext.define('Opt.view.tabs.fuelStationsViewer.FuelStationGridController', {
	extend: 'Opt.view.FuelStationGridController',
	alias: 'controller.fuelstationsviewerfuelstationgrid',
	checkedAll: true,
	fuelStationEdit: null,
	requires: [
		//'Opt.view.dialog.FuelStationEdit',
		'Opt.ux.GridPrinter',
	],

	stateful: true,
	stateId: 'tab2fuelstationgridpanel',

	listen: {
		controller: {
			'*': {
				fuelstationsviewermapRender: 'onMapRender',
			}
		},
	},

	loadFuelStation: function(){
		var self = this;
		var params = {
			param: 'fuelStations'
		};

		var grid = self.getView();
		var store = grid.store;

		grid.mask('Обновление..');

       		Ext.Ajax.request({
			url: 'api/db/db_1cbase',
			method: 'GET',
			params: params,

			success: function (response) {
				store.suspendEvents();

 				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					Opt.app.showError("Ошибка!", error.message);
					return;
        			}

				store.removeAll();
				store.save();

				store.loadData(respObj.data);
				store.save();

				store.each(function (record) {
					record.beginEdit();
					record.set('in_use', true);
					record.save();
				});
				grid.unmask();
				grid.view.refresh();
			},

			failure: function (response) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
				grid.unmask();
			}
		});
	},

	onMapRender: function (comp, map, layers) {
		this.showFuelStationsOnMap();
	},
});