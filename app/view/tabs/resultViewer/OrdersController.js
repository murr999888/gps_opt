Ext.define('Opt.view.tabs.resultViewer.OrdersController', {
	extend: 'Opt.view.RouteLegGridController',
	alias: 'controller.resultviewerorders',
	requires: [
		'Opt.ux.GridPrinter',
	],

	orderStore: null,
	orderEdit: null,
	fullZoom: true,

	init: function () {
		this.orderStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.RouteLegs',
			proxy: {
				type: 'memory',
			},
		});

		this.getView().setStore(this.orderStore);
	},

	getGoods: function(title, goodstable){
	        var sumGoodsArr = []; 
		var store = this.getView().getStore(); 

		if (!this.goodsDialog) this.goodsDialog = Ext.create('widget.goodsedit', { title: title});

		var goodsGrid = this.goodsDialog.down('ordergoodsgrid');
		var goodsGridStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.OrderGood',
			proxy: {
				type: 'memory',
			},
		});

		goodsGridStore.sort([
    			{
        			property : 'name',
        			direction: 'ASC'
    			},
		]);

		goodsGrid.setStore(goodsGridStore);
		this.goodsDialog.show();
		this.goodsDialog.focus();

		setTimeout(function(){
			for (var i=0; i < store.count(); i++){
				var order = store.getAt(i);
				var goods = order.get(goodstable);
				for (var j=0; j < goods.length; j++){
					var good = goods[j];
					var index = sumGoodsArr.findIndex((element)=>element.id == good.id); 
					if (index == -1) {
						if (good.kolvo > 0){
							var goodCopy = $.extend(true, {}, good);
							sumGoodsArr.push(goodCopy);
						}
					} else {
						sumGoodsArr[index].kolvo = sumGoodsArr[index].kolvo + good.kolvo;
					};
				}; 
			};
			
			goodsGridStore.loadData(sumGoodsArr);
		},0);
	},
	

	getUnloadingGoods: function(){
		this.getGoods('Отгрузка по заказам.', 'unloading_goods');
	},

	getLoadingGoods: function(){
		this.getGoods('Погрузка по заказам.', 'loading_goods');
	},

	getFuelIcon: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (record.get('node_type') == 3) {
			//metadata.tdCls = 'vert_middle';
			return '<div style="height: 14px; width: 14px; background: url(css/images/gas_station_16x16.png) no-repeat; no-repeat center center; background-size: 14px; "></div>';
		}
		return val;
	},

	beforeRender: function () {
		var grid = this.getView();
		var columns = grid.getColumns();
		columns[8].setText('См.');
	},

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},

	openEditDialog: function (record, editable) {
		this.orderEdit = null;
		Ext.suspendLayouts();
		this.orderEdit = Ext.create('widget.orderedit');

		this.orderEdit.readOnly = true;

		this.orderEdit.down('form').loadRecord(record);

		var orderGoodsStore = this.orderEdit.down('ordergoodsgrid').store;
		orderGoodsStore.suspendEvents();
		orderGoodsStore.loadData(record.get("goods"));
		orderGoodsStore.sync();
		orderGoodsStore.resumeEvents();

		orderGoodsStore.filterBy(function (record) {
			if (record.get("kolvo") > 0) return true;
		});

		this.orderEdit.down('tabpanel').items.items[1].setDisabled(true);
		//this.orderEdit.down('allowedautosgrid').store.loadData(record.get("allowed_autos"));

		var form = this.orderEdit.down('form').getForm();
		form.setValues({
			service_time_min: Math.ceil(record.get("service_time") / 60),
		});
		Ext.resumeLayouts();
		this.orderEdit.show().focus();
	},

	onEditRecord: function (grid, rowIndex, colIndex, item, e, record) {
		this.openEditDialog(record);
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		if (rowIndex == 0) {
			console.log("Первую пропускаем..");
			return;
		}

                this.fullZoom = false;

		var recTo = record.data;
		var store = grid.store;
		var recFrom = store.getAt(rowIndex - 1).data;
		var mapComp = Ext.getCmp('resultviewermap');
		var map = mapComp.map;

		Ext.getCmp('resultviewermap').deleteLineLeg();

		var lineOptions = [{
			color: 'blue',
			opacity: 1,
			weight: 3,
			pane: 'routelinesBlue',
		}];

		var router = new L.Routing.OSRMv1({
			serviceUrl: routeServerUrl
		});

		fromPoint = new L.Routing.waypoint();
		fromPoint.latLng = L.latLng(recFrom.lat, recFrom.lon);
		tempFromMarker = L.marker(L.latLng(recFrom.lat, recFrom.lon));

		toPoint = new L.Routing.waypoint();
		toPoint.latLng = L.latLng(recTo.lat, recTo.lon);
		tempToMarker = L.marker(L.latLng(recTo.lat, recTo.lon));

		router.route([fromPoint, toPoint], function (error, routes) {
			if (error) { 
				Opt.app.showToast("Внимание!", "Ошибка сервера <br />" + error.message);
				//console.log(error);
			}

			if (routes) {
				var lineLeg = L.Routing.line(routes[0], {
					styles: lineOptions
				});

				Ext.getCmp('resultviewermap').deleteLineLeg();

				mapComp.lineLeg = lineLeg;
				mapComp.lineLeg.addTo(mapComp.map);
				mapComp.setArrows();

				mapComp.setFinishMarkerR(toPoint.latLng);

				var gr = L.featureGroup([mapComp.lineLeg, tempFromMarker, tempToMarker]);
				mapComp.map.fitBounds(gr.getBounds(), pad);
				tempFromMarker = null;
				tempToMarker = null;
				gr = null;

				mapComp.lineLeg.on('linetouched', function (touchData) {
					var popupLineLeg = L.popup({
						closeOnClick: true
					});

					popupLineLeg.setLatLng(touchData.latlng);
					var popupContent = '';

					popupContent = popupContent + '<div style="color: green;"><b>' + recFrom.full_name + '</b><br />';

					if (recFrom.adres != recFrom.full_name && recFrom.adres != '') {
						popupContent = popupContent + '(' + recFrom.adres + ') </div>';
					} else {
						popupContent = popupContent + '</div>';
					}

					popupContent = popupContent + '<div style="color: brown;"><b>' + recTo.full_name + '</b><br />';

					if (recTo.adres != recTo.full_name && recTo.adres != '') {
						popupContent = popupContent + '(' + recTo.adres + ') </div>';
					} else {
						popupContent = popupContent + '</div>';
					}

					popupContent = popupContent + '<div>';

					if (recTo.stop_time > 0) {
						popupContent = popupContent + 'Стоянка: ' + secToMin(recTo.stop_time.toFixed()) + '<br />'
					}
	
					popupContent = popupContent + 'Расстояние: <b>' + routes[0].summary.totalDistance.toFixed() + '</b><br />' + 'Время в пути: <b>' + secToMin(routes[0].summary.totalTime.toFixed()) + '</b></div>';

					popupLineLeg.setContent(popupContent);
					popupLineLeg.openOn(map);
				});

			}

		});
	},

	routeZoom: function () {
		var mapComp = Ext.getCmp('resultviewermap');
		if (!this.fullZoom){
			mapComp.markersFitBounds();
			this.fullZoom = true;
		} else {
			if (mapComp.lineLeg) {
				var t = L.featureGroup([mapComp.lineLeg]); 
				mapComp.map.fitBounds(t.getBounds(), pad);
				this.fullZoom = false;
			}
		}
	},
});