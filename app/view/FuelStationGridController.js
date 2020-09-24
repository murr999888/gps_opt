Ext.define('Opt.view.FuelStationGridController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.fuelstationgrid',
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
				findFuelStations: 'findFuelStations',
			}
		},

		component: {
			'*': {
				findFuelStations: 'findFuelStations',
			}
		}
	},

	init: function () {
		var self = this;
		this.getView().getSelectionModel().setSelectionMode('MULTI')

		var store = this.getView().store;
		store.sort('klient_name', 'ASC');

		store.on('datachanged', function(){
			self.setGridTitle();
		});

		store.on('load', function(){
			self.setGridTitle();
		});
	},

	setGridTitle: function(){
        	var store = this.getView().store;
		this.getView().setTitle("Список заправок (" + store.count() + ")");	
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
		store.save();
		store.resumeEvents();
		this.getView().view.refresh();
	},

	findFuelStations: function(){
		var self = this;
	        var stations = [];

		var grid = self.getView();
        	var store = this.getView().store;

		var queryString = Ext.getCmp('fuelstationsfindfield').getValue();

		if (queryString.trim() =='') {
			Opt.app.showError("Ошибка!", "Введите строку поиска.");
			return;
		}

		var params = {
			q: queryString,
			format: 'json',
			limit: 50,
			namedetails: 1,
			addressdetails: 1,
			extratags: 1,
			'accept-language': 'uk',
			dedupe:0,
		};

		var data = respObj;

		var form = Ext.getCmp('formparamtab2');
		var formVal = form.getForm().getFieldValues();
		var orders_date = formVal.solvedate;

		orders_date = orders_date.replace(/-/g, '/'); // для IE 

		var datetimeBegin = Date.parse(orders_date + ' ' + "00:00:00");
		var datetimeEnd = Date.parse(orders_date + ' ' + "23:59:59");

	        grid.mask('Обновление..');

		Ext.Ajax.request({
			url: 'https://nominatim.openstreetmap.org/search',
			method: 'GET',
			params: params,
			async: true,
			success: function (response) {
 				try {
					data = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					Opt.app.showError("Ошибка!", error.message);
					return;
        			}

				var addedCount = 0;
				store.suspendEvents();
				data.forEach(function(record){
					if(record.type != 'fuel') return;

	                                var stationId = record.place_id;
					var stationIndex = store.find("id", stationId);
					
					var gas = false;

					if (record.extratags) {
						if (record.extratags['fuel:cng'] || record.extratags['fuel:lpg']) {
							gas = true;
						}
					}

					var name = '';

					//if (record.extratags.description) {
					//	name = record.extratags.description;
					//} else 
					if (record.address.amenity) {						
						name = record.address.amenity;
						if (record.extratags) {
							if (record.namedetails && record.namedetails.ref && name.search(record.namedetails.ref) == -1) {
								name = name + ' №' + record.namedetails.ref;
							}
						}
					} else {
						name = record.address.road;
					}

					if (stationIndex != -1) {
						var station = store.getAt(stationIndex);
						if (station) {
							station.beginEdit();
							station.set("city",record.address.city);
							station.set("district", record.address.suburb);
							station.set("adres", record.address.road + ', ' + (record.address.neighbourhood ? record.address.neighbourhood + ', ':'') + (record.address.suburb ? record.address.suburb : ''));
							station.set("full_name", record.address.amenity ? record.address.amenity : record.address.road);
							station.set("klient_id", record.place_id);
							station.set("klient_name", name);
							station.set("klient_group_name", 'Заправки');
							station.set("lat", record.lat);
							station.set("lon", record.lon);
							station.set("gas", gas);
							station.commit();
							station.save();
						}

					} else {
						var station = Ext.create('Opt.model.FuelStation',{
							in_use: true,
							id: record.place_id,
							order_id: record.place_id,
							order_date: datetimeBegin,
							city: record.address.city,
							district: record.address.suburb,
							adres: record.address.road + ', ' + (record.address.neighbourhood ? record.address.neighbourhood + ', ':'') + (record.address.suburb ? record.address.suburb : ''),
							full_name: record.address.amenity ? record.address.amenity : record.address.road,
							klient_id: record.place_id,
							klient_name: name,
							klient_group_name: 'Заправки',
							lat: record.lat,
							lon: record.lon,
							gas: gas,
						});

						addedCount++;
						store.add(station);
						station.save();
					}
				});


				store.sync();
				store.resumeEvents();
				self.getView().view.refresh();

				self.getView().setTitle("Список заправок (" + store.count() + ")");

				grid.unmask();

				self.showFuelStationsOnMap();

				if (addedCount > 0) {
					Opt.app.showToast("Внимание", "Добавлено " + addedCount + " строк(и).", true);
				}
			},

			failure: function (response) {
				grid.unmask();
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
			}
		});
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

	deleteFuelStations: function(){
		var store = this.getView().store;
		var grid = this.getView();
		var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}

		for(var i=0; i < selection.length; i++){
			var record = selection[i];
			store.remove(record);
		}
	},
});