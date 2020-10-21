Ext.define('Opt.view.tabs.fuelStationsViewer.FuelStationGridController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.fuelstationsviewerfuelstationgrid',
	checkedAll: true,
	fuelStationEdit: null,
	requires: [
		'Opt.ux.GridPrinter',
		'Opt.view.dialog.SetServiceTime',
	],

	stateful: true,
	stateId: 'tab2fuelstationgridpanel',

	listen: {
		controller: {
			'*': {
				fuelstationsviewermapRender: 'onMapRender',
				fuelstationsViewerShow: 'setGridTitle',
			}
		},
	},

	init: function () {
		var self = this;
		this.getView().getSelectionModel().setSelectionMode('MULTI')

		var store = this.getView().store;
		store.sort('klient_name', 'ASC');

		store.on('update', function(){
			self.setGridTitle();
		});

		store.on('load', function(){
			self.setGridTitle();
		});
	},

	setService: function () {
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки для изменения!');
			return;
		}

		this.msgbox = null;
		this.msgbox = Ext.create('widget.setservicetime', { parentGrid: grid });
		this.msgbox.show();
	},

	setGridTitle: function(){
        	var store = this.getView().store;

		var inUseCount = 0;
		store.each(function(record){
			if(record.get("in_use")){
				inUseCount++;
			}
		});
		var checkedStr = '';
		if (inUseCount > 0) checkedStr = '&#10003;' + inUseCount + ' ';
		this.getView().setTitle('Список заправок ' + checkedStr + '(' + store.count() + ')');
	},

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},

	afterRender: function(){
		this.setGridTitle();
	},

	getServiceTime: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (val > 0) {
			return minToHHMM(val.toFixed());
		} else {
			return "";
		}
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		Ext.getCmp('fuelstationsviewermap').setCenter(record.get('lon'), record.get('lat')); 
	},

	onChangeInUse: function (checkbox, rowIndex, checked, record, e, eOpts) {
		record.commit();
		record.save();
	},

	onHeaderCheckChange: function (column, checked, e, eOpts) {
		var store = this.getView().store;
		store.suspendEvents();
		store.commitChanges();
		store.resumeEvents();
		this.getView().view.refresh();
	},

	clearFuelStations: function() {
		Ext.getCmp('fuelstationsfindfield').setValue('');
		var store = this.getView().store;
		store.removeAll();
		store.sync();
		store.save();
		this.clearFuelStationsOnMap();
	},

	showFuelStationsOnMap: function () {
		var store = this.getView().store;
		if (store.count() > 0) {
			var geoJSON = Ext.getCmp('fuelstationsviewermap').constructOrdersGeoJSON(store);
			Ext.getCmp('fuelstationsviewermap').setFuelStationsOnMap(geoJSON);
		}
	},

	clearFuelStationsOnMap: function () {
		Ext.getCmp('fuelstationsviewermap').resetFuelStations();
	},

	loadFuelStationFromNN: function(){
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
 				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					Opt.app.showError("Ошибка!", error.message);
					return;
        			}

				store.suspendEvents();

				store.removeAll();
				store.save();

				store.loadData(respObj.data);
				store.save();

				store.each(function (record) {
					record.set('in_use', true);
					record.save();
				});

				store.resumeEvents();
				grid.unmask();
				grid.view.refresh();
				self.setGridTitle();
				self.showFuelStationsOnMap();
			},

			failure: function (response) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
				grid.unmask();
			}
		});
	},
	
	loadFuelStation: function(){
		var self = this;
		Ext.Msg.show({
			title: 'Внимание',
			message: 'Данные будут загружены. Все изменения будут сброшены.<br />Продолжить?',
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION,
			fn: function (btn) {
				if (btn === 'yes') {
					self.loadFuelStationFromNN();
				} else if (btn === 'no') {
					return;
				}
			}
		});
	},

	onMapRender: function (comp, map, layers) {
		this.showFuelStationsOnMap();
	},

	zoomFuelStation: function(){
		Ext.getCmp('fuelstationsviewermap').markersFitBounds();
	},
});