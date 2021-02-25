Ext.define('Opt.view.tabs.tab2.RoutesGridTab2Controller', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.tab2routesgrid',
	checkedAll: true,
	routelistEdit: null,
	requires: [
		'Opt.view.dialog.RouteListEdit',
		'Opt.view.dialog.TempResultViewer',
		'Opt.view.dialog.GoodsEdit',
		'Opt.ux.GridPrinter',
	],

	calc_stat: null,
	calc_params: null,

	listen: {
		controller: {
			'*': {
				distributed_orders_change_date: 'distributed_orders_change_date',
				tab2routesgridsettitle: 'setTitle',
				tab2routesgridsetstat: 'setStat',
				tab2routesgridsetparams: 'setParams',
			}
		}
	},

	init: function () {
		var self = this;
		this.ordersEditStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.RouteLegs',
			proxy: {
				type: 'memory',
			},
		});

		var store = this.getView().getStore();
		store.on('load', function(){
			self.setTitle();
		});

		store.on('update', function(){
                       	self.setTitle();
		});


		var tempResultsStore = Ext.getStore('TempResults');
		tempResultsStore.on('clear', function(){
			self.setResultButtonDisabled(tempResultsStore.count() == 0);
		});

		tempResultsStore.on('datachanged', function(){
			self.setResultButtonDisabled(tempResultsStore.count() == 0);
		});
	},

	setResultButtonDisabled: function(disabled){
		Ext.getCmp('tab2resultsbutton').setDisabled(disabled);
	},

	setStat: function(calc_stat){
		this.calc_stat = calc_stat;
		this.setTitle();
	},

	setParams: function(calc_params){
		this.calc_params = calc_params;
	},

	setTitle: function(){
		var form = Ext.getCmp('formparamtab2');
		var formVal = form.getForm().getFieldValues();

		var orders_date = formVal.solvedate;

		var store = this.getView().getStore();
		strTitle = 'Маршрутные листы за ' + orders_date + ' ';

		var inUseCount = 0;
		store.each(function(record){
			if(record.get("in_use")){
				inUseCount++;
			}
		});
		var checkedStr = '';
		if (inUseCount>0) checkedStr = '&#10003;' + inUseCount + ' ';

		strTitle = strTitle + checkedStr + '(' + store.count() + ') '

		if (this.calc_stat) {
			 strTitle = strTitle + '<span title="Сумма длин всех маршрутов">' + this.calc_stat.total_distance + ' м.</span>, <span title="Сумма продолжительностей всех маршрутов">' + secToHHMMSS(this.calc_stat.total_duration) + '</span>, заказов (' + this.calc_stat.orders_routes_count + ')';
		}

       		this.getView().setTitle(strTitle);
	},

	setButtonsDisabled: function(disabled){
		Ext.getCmp('tab2getRoutesUnloadingGoodsButton').setDisabled(disabled);
		Ext.getCmp('tab2getRoutesLoadingGoodsButton').setDisabled(disabled);
		Ext.getCmp('tab2getRoutesPrintButton').setDisabled(disabled);
		Ext.getCmp('tab2mapbutton').setDisabled(disabled);
	},

	afterRender: function(){
		this.setColumnsDefault(0);
	},

	distributed_orders_change_date: function () {
		this.clearRoutes();
	},

	printTable: function () {
		var grid = this.getView();
		Opt.ux.GridPrinter.print(grid);
	},

	onChangeInUse: function (checkbox, rowIndex, checked, record, e, eOpts) {
		record.commit();
		this.setTitle();
	},

	onHeaderCheckChange: function (column, checked, e, eOpts) {
		var store = this.getView().getStore();
		store.suspendEvents();
		store.commitChanges();
		store.resumeEvents();
		this.getView().view.refresh();
		this.setTitle();
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		var self = this;
		var beginGoodsEditStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.OrderGood',
			proxy: {
				type: 'memory',
			},
		});

		var endGoodsEditStore = Ext.create('Ext.data.Store', {
			model: 'Opt.model.OrderGood',
			proxy: {
				type: 'memory',
			},
		});

		beginGoodsEditStore.sort([
    			{
        			property : 'isPack',
        			direction: 'DESC'
    			},
    			{
        			property : 'name',
        			direction: 'ASC'
    			}
		]);		

		endGoodsEditStore.sort([
    			{
        			property : 'isPack',
        			direction: 'DESC'
    			},
    			{
        			property : 'name',
        			direction: 'ASC'
    			}
		]);

		beginGoodsEditStore.filterBy(function (record) {
			if (record.get("kolvo") > 0) return true;
		});

		endGoodsEditStore.filterBy(function (record) {
			if (record.get("kolvo") > 0) return true;
		});

		if (!this.routelistEdit || this.routelistEdit.destroyed) this.routelistEdit = Ext.create('widget.routelistedit');

		this.routelistEdit.down('form').loadRecord(record);

		this.routelistEdit.down('routelistbegingoodsgrid').setStore(beginGoodsEditStore);
		this.routelistEdit.down('routelistendgoodsgrid').setStore(endGoodsEditStore);

		beginGoodsEditStore.loadData(record.get('begin_goods'));
		endGoodsEditStore.loadData(record.get('end_goods'));

		this.routelistEdit.down('ordersgridpanel').setStore(this.ordersEditStore);
		this.ordersEditStore.loadData(record.get('orders'));

		var form = this.routelistEdit.lookupReference('form').getForm();
		form.setValues({
			route_begin_1: secToHHMMSS(record.get("route_begin_calc")),
			route_end_1: secToHHMMSS(record.get("route_end_calc")),
			duration_1: secToHHMMSS(record.get("duration")),
			durationFull_1: secToHHMMSS(record.get("durationFull")),
			date_1: getDDMMYYYY(record.get("date")),
		});

		this.routelistEdit.show().focus();
/*
		if (record.get('isRefueled')) {
			Ext.getCmp('routelistedit_icon_refuel').setSrc('css/images/gas_station_32x32.png');
		} else {
	                Ext.getCmp('routelistedit_icon_refuel').setSrc('');
		}
*/

		if (record.get('isReloaded')) {
			Ext.getCmp('routelistedit_icon_reload').setSrc('css/images/truck_load3_32x32.png');
		} else {
	                Ext.getCmp('routelistedit_icon_reload').setSrc('');
		}

	},

	getDriverName: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var id = record.get('driver_id');
		if (id == 0) {
			metadata.style = 'background-color: yellow;'; 
		}
		return val;
	},

	getTime: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (val > 0) {
			return secToHHMMSS(val.toFixed());
		} else {
			return "";
		}
	},

	openViewer: function () {
		var routeListStore = this.getView().store;
		if (routeListStore.count() == 0) {
			Ext.Msg.alert('Внимание!', 'Таблица маршрутов пуста.');
			return;
		}

		var droppedOrderStore = Ext.getCmp('tab2droppedgrid').store;

		if (!this.viewer || this.viewer.destroyed) this.viewer = Ext.create('widget.resultviewermain', { closable: true });

		Ext.getCmp('resultviewerroutesgrid').setStore(routeListStore);
		Ext.getCmp('resultviewerdroppedgrid').setStore(droppedOrderStore);

		Ext.getCmp('resultviewerroutesgrid').getView().getSelectionModel().select(0);
		this.viewer.show();
		this.viewer.focus();
		Ext.getCmp('resultviewerroutesgrid').focus();
		Ext.getCmp('resultviewerroutesgrid').setTitle(Ext.getCmp('tab2routesgrid').getTitle());
		if (this.viewer.mapRendered) this.fireEvent("resultviewermapRender");
	},

	onPressClearRoutes: function(){
		var self = this;
		Ext.Msg.show({
			title: 'Внимание',
			message: 'Таблицы маршрутов будет очищена. Продолжить?',
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION,
			fn: function (btn) {
				if (btn === 'yes') {
					self.clearRoutes();
				} else if (btn === 'no') {
					return;
				}
			}
		});
	},

	clearRoutes: function () {
		clearStore('tab2routesgrid');
		clearStore('tab2droppedgrid');
		Ext.getCmp('tab2routesgrid').setTitle("Маршрутные листы");
		Ext.getCmp('tab2droppedgrid').setTitle("Отброшенные заказы");
	},


	saveRoutes: function () {
		var self = this;
		var routeListStore = this.getView().store;
		if (routeListStore.count() == 0) {
			Ext.Msg.alert('Внимание!', 'Таблица маршрутов пуста.');
			return;
		}

		Ext.Msg.show({
			title: 'Внимание',
			message: 'Данные будут сохранены в NN.<br />Таблицы заказов и маршрутов будут очищены. Продолжить?',
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION,
			fn: function (btn) {
				if (btn === 'yes') {
					self.sendRoutes();
				} else if (btn === 'no') {
					return;
				}
			}
		});
	},

	sendRoutes: function () {
		var self = this;

		Ext.getCmp('maintab2').mask("Идет сохранение результатов... ");

		var routes = [];
		var store = this.getView().store;
		store.each(function (record) {
			routes.push(record.getData());
		});

		var params = {
			param: 'saveDistrRoutes',
			routes: routes
		};

		Ext.Ajax.request({
			url: 'api/db/db_1cbase',
			method: 'POST',
			jsonData: params,

			success: function (response) {
				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					Ext.getCmp('maintab2').unmask();
					Opt.app.showError("Ошибка!", error.message);
					return;
        			}

				if (respObj.success) {
					self.clearStores();
					Ext.getCmp('maintab2').unmask();
					Ext.Msg.alert("Внимание!", respObj.message);
				}
			},

			failure: function (response) {
				Ext.getCmp('maintab2').unmask();
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
			}
		});

	},

	clearStores: function () {
		clearStore('tab2ordersgrid');
		clearStore('tab2routesgrid');
		clearStore('tab2droppedgrid');
		clearStore('DroppedGoodsStore');
		clearStore('OrdersGoodsStore');
		clearStore('RoutesGoodsStore');

		Ext.getCmp('tab2ordersgrid').setTitle("Заказы");
		Ext.getCmp('tab2routesgrid').setTitle("Маршрутные листы");
		Ext.getCmp('tab2droppedgrid').setTitle("Отброшенные заказы");

	},

	loadRoutes: function () {
		var self = this;
		var store = this.getView().store;

		if (store.count() > 0) {
			Ext.Msg.show({
				title: 'Внимание',
				message: 'Таблица  маршрутов будет очищена. Продолжить?',
				buttons: Ext.Msg.YESNO,
				icon: Ext.Msg.QUESTION,
				fn: function (btn) {
					if (btn === 'yes') {
						self.getRoutes();
					} else if (btn === 'no') {
						return;
					}
				}
			});
		} else {
			self.getRoutes();
		}
	},

	getRoutes: function () {
		var self = this;

		this.clearRoutes();

		var store = this.getView().store;

		var form = Ext.getCmp('formparamtab2');
		var formVal = form.getForm().getFieldValues();
		var orders_date = formVal.solvedate;

		orders_date = orders_date.replace(/-/g, '/'); // для IE 

		var datetimeBegin = Date.parse(orders_date + ' ' + "00:00:00");
		var datetimeEnd = Date.parse(orders_date + ' ' + "23:59:59");

		var params = {
			param: 'RouteListsWithOrders',
			datetime_begin: Parse1CData(datetimeBegin),
			datetime_end: Parse1CData(datetimeEnd),
			use_plantime: true,
			not_on_route: true,
			orders_backup: true,
			use_progressive_penalty: true,
		};

		this.getView().mask("Loading...");

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

				var data = respObj.data;

				store.suspendEvents();
				store.loadData(data.routes);

				store.each(function (record) {
					record.beginEdit();
					record.set('in_use', false);
					record.commit();
				});

				store.sync();
				store.resumeEvents();
				store.fireEvent('load');

				if (data.goods.length > 0) {
					var goodsStore = Ext.getStore('RoutesGoodsStore');

					var goodsData = [];
					Ext.Array.forEach(data.goods, function (item) {
						var record = item;
						if (record.kolvo > 0) {
							goodsData.push(record);
						}
					});

					goodsStore.suspendEvents();
					goodsStore.loadData(goodsData);
					goodsStore.sync();
					goodsStore.resumeEvents();
					goodsStore.fireEvent('load');
				}

				self.getView().view.refresh()
				self.getView().unmask();

				Ext.getCmp('tab2routesgrid').setTitle("Маршрутные листы (" + store.count() + ")");
			},

			failure: function (response) {
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
				self.getView().unmask();
			}
		});
	},

	setColumnsDefault: function(mode){
		return;

		var dim = Ext.getBody().getViewSize();
		if (dim.width > 1366) return;

		var columnManager = this.getView().getColumnManager();
		if (mode == 0) {
                	columnManager.getHeaderByDataIndex('route_begin_plan').hide();
			columnManager.getHeaderByDataIndex('route_end_plan').hide();
                	columnManager.getHeaderByDataIndex('route_begin_calc').show();
			columnManager.getHeaderByDataIndex('route_end_calc').show();
		} else {
                	columnManager.getHeaderByDataIndex('route_begin_plan').show();
			columnManager.getHeaderByDataIndex('route_end_plan').show();
                	columnManager.getHeaderByDataIndex('route_begin_calc').hide();
			columnManager.getHeaderByDataIndex('route_end_calc').hide();
		}
	},
	
	onModeSelect: function(combo, record, index, eOpts ) {
		var buttonGetRoutes = Ext.getCmp('tab2ButtonLoadRoutes');
		var checkboxSwapOrders = Ext.getCmp('tab2allowswaporders');
		var mode = record.get('id');
		if ( mode == 0) {
			buttonGetRoutes.setDisabled(true);
			checkboxSwapOrders.setDisabled(true);
		} else {
			buttonGetRoutes.setDisabled(false);
			checkboxSwapOrders.setDisabled(false);
		}

		this.setColumnsDefault(mode);
	},

	onBeforeModeSelect: function(combo, record, index, eOpts ) {
		var store = this.getView().store;
		if (store.count() > 0) {
			Opt.app.showError('Внимание!','Перед изменением режима распределения заказов <br />очистите таблицу маршрутов!');
			return false;
		}
	},

	getGoods: function(title, goodstable){
	        var sumGoodsArr = []; 
		var store = this.getView().getStore();

		if (!this.goodsDialog || this.goodsDialog.destroyed) this.goodsDialog = Ext.create('widget.goodsedit', {title: title});

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
				var routelist = store.getAt(i);
				var orders = routelist.get('orders');
				for (var j=0; j < orders.length; j++){
					var order = orders[j];
					if (order.node_type == 1) {
						var goods = order[goodstable];
						for (var k=0; k < goods.length; k++){
							var good = goods[k];
							var index = sumGoodsArr.findIndex((element)=>element.id == good.id); 
							if (index == -1) {
								if (good.kolvo > 0){
									var goodCopy = $.extend(true, {}, good);
									sumGoodsArr.push(goodCopy);
								}
							} else {
								sumGoodsArr[index].kolvo = sumGoodsArr[index].kolvo + good.kolvo;
							};
						}
					}; 
				}
			};
			goodsGridStore.loadData(sumGoodsArr);
		},0);
	},

	getUnloadingGoods: function(){
		this.getGoods('Отгрузка по маршрутам.', 'unloading_goods');
	},

	getLoadingGoods: function(){
		this.getGoods('Погрузка по маршрутам.', 'loading_goods');
	},

	getIcon: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (record.get('isRefueled')) {
			metadata.tdCls = 'vert_middle';
			return '<div style="height: 14px; width: 14px; background: url(css/images/gas_station_16x16.png) no-repeat; no-repeat center center; background-size: 14px; "></div>';
		}
		return '';
	},

	printLoadList: function(){
		var self = this;
		var grid = this.getView();
		var store = this.getView().getStore();
		var data = Ext.pluck(store.data.items, 'data');
		var routelists = data.filter(function(routelist){
			return routelist.in_use == true;
		});

	    	var template = new Ext.XTemplate(
      		'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
      		'<html>',
        		'<head>',
          		'<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />',
	  		'<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">',
	  		'<link type="text/css" rel="stylesheet" href="css/font-awesome/font-awesome-all.css" />',
	  		'<link type="text/css" rel="stylesheet" href="css/main.css" />',
          		'<link type="text/css" rel="stylesheet" href="css/print.css?' + Date.now() + '" />',
          		'<title>Загрузка по маршрутным листам</title>',
        		'</head>',
        		'<body>',
				this.getTimeStamp(),
				'<br />',
				grid.getTitle().replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, ""), 
		  		'<h3>Загрузка по маршрутным листам</h3>',
	      	    		'<tpl for=".">',
					'<div class="dontbreak">',
					'<div class="route">',
					'<span style="margin-bottom: 10px;"><b>Машина: {auto_name}, водитель: {driver_name}</b></span><br>',
					'<span style="margin-bottom: 10px;"><b>Вода: {water}, баллонов: {bottle}, емкостей: {tank}</b></span><br>',
					'<span style="margin-bottom: 10px;">Рейс: <b>{race_number}</b>, выезд: <b>{[secToHHMMSS(values.route_begin_calc)]}</b>, возврат: <b>{[secToHHMMSS(values.route_end_calc)]}</b>, длина: <b>{distance}</b>, длительность: <b>{[secToHHMMSS(values.durationFull)]}</b></span><br>',
					'<br>',
					'<span>В начале:</span><br>',
					'<table class="print">',
						'<tr style="background-color: #eee;">',
        						'<td style="width: 300px; text-align: center;">Наименование</td>',
							'<td style="width: 50px; text-align: center;">Ед.</td>',
							'<td style="width: 50px; text-align: center;">Кол-во</td>',
						'</tr>',
						'<tpl for="begin_goods">',
							'<tr>',
	        						'<td>{name}</td>',
								'<td style="text-align: right;">{ed}</td>',
								'<td style="text-align: right;">{kolvo}</td>',
							'</tr>',
      						'</tpl>',
					'</table>',          
					'{[this.getRoutelistOrdersUnloadingGoodsTmpl(values)]}',
					'{[this.getRoutelistOrdersLoadingGoodsTmpl(values)]}',
					'<tpl if="end_goods.length &gt; 0">',
					'<span>В конце:</span><br>',
					'<table class="print">',
						'<tr style="background-color: #eee;">',
        						'<td style="width: 300px; text-align: center;">Наименование</td>',
							'<td style="width: 50px; text-align: center;">Ед.</td>',
							'<td style="width: 50px; text-align: center;">Кол-во</td>',
						'</tr>',
						'<tpl for="end_goods">',
							'<tr>',
	        						'<td>{name}</td>',
								'<td style="text-align: right;">{ed}</td>',
								'<td style="text-align: right;">{kolvo}</td>',
							'</tr>',
      						'</tpl>',
					'</table>',
					'</tpl>',
					'</div>',
					'</div>',
       	    			'</tpl>',
				'<br />',
				'<br />',
        		'</body>',
      		'</html>',
		{
			getRoutelistOrdersUnloadingGoodsTmpl: function(routelist){
				return self.getRoutelistOrdersGoodsTmpl(routelist, "unloading_goods");
			},

			getRoutelistOrdersLoadingGoodsTmpl: function(routelist){
				return self.getRoutelistOrdersGoodsTmpl(routelist, "loading_goods");
			},
		});

		var html = template.apply(routelists);
    
    		//open up a new printing window, write to it, print it and close
    		var win = window.open('', 'printgrid' + Date.now());
    
    		win.document.write(html);
		win.document.close();
	},

        getRoutelistOrdersGoodsTmpl: function(routelist, goodstable){
		var sumGoodsArr = []; 
		var orders = routelist.orders;
		for (var j=0; j < orders.length; j++){
			var order = orders[j];
			if (order.node_type == 1) {
				var goods = order[goodstable];
				for (var k=0; k < goods.length; k++){
					var good = goods[k];
					var index = sumGoodsArr.findIndex((element)=>element.id == good.id); 
					if (index == -1) {
						if (good.kolvo > 0){
							var goodCopy = $.extend(true, {}, good);
							sumGoodsArr.push(goodCopy);
						}
					} else {
						sumGoodsArr[index].kolvo = sumGoodsArr[index].kolvo + good.kolvo;
					};
				}
			}; 
		}

		sumGoodsArr.sort(function (a, b) {
			if (a.isPack > b.isPack) return 1;
  			if (a.isPack < b.isPack) return -1;
  			if (a.name > b.name) return 1;
  			if (a.name < b.name) return -1;

  			return 0;
		});

		var template = new Ext.XTemplate(
       		        '<table class="print">',
				'<tr style="background-color: #eee;">',
        				'<td style="width: 300px; text-align: center;">Наименование</td>',
					'<td style="width: 50px; text-align: center;">Ед.</td>',
					'<td style="width: 50px; text-align: center;">Кол-во</td>',
				'</tr>',
				'<tpl for=".">',
					'<tr>',
						'<td>{name}</td>',
						'<td style="text-align: right;">{ed}</td>',
						'<td style="text-align: right;">{kolvo}</td>',
					'</tr>',
      				'</tpl>',
			'</table>',
		);

		var title = '';
		if (goodstable == "unloading_goods") {
	                title = "Отгрузка по заказам:<br>";
		}

		if (goodstable == "loading_goods") {
	                title = "Погрузка по заказам:<br>";
		}
       	
		if (sumGoodsArr.length > 0){
			return title + template.apply(sumGoodsArr);
		} else {
		  	return '';
		}

		return template.apply(sumGoodsArr);
	},

	printAutosList: function(){
		var grid = this.getView();
		var store = this.getView().getStore();
		var data = Ext.pluck(store.data.items, 'data');
		var routelists = data.filter(function(routelist){
			return routelist.in_use == true;p
		});

		var autos = [];
		var sum = {
			routes: 0, 
			orders: 0,
			duration: 0, 
			distance: 0
		};

		Ext.each(routelists, function(routelist){
			var au = autos.find(function(auto){
				return auto.id == routelist.auto_id;
			});

			if (!au) {
				autos.push(
					{
						id: routelist.auto_id, 
						name: routelist.auto_name, 
						duration: routelist.durationFull, 
						distance: routelist.distance,
						routes: 1,
						orders: routelist.ordersCount,
						worktime_begin: routelist.route_begin_calc,
						worktime_end: routelist.route_end_calc,
					}
				);
			} else {
				au.duration += routelist.durationFull;
				au.distance += routelist.distance;
				au.routes++;
				au.orders += routelist.ordersCount;
				if(routelist.route_begin_calc < au.worktime_begin) au.worktime_begin = routelist.route_begin_calc;
				if(routelist.route_end_calc > au.worktime_end) au.worktime_end = routelist.route_end_calc;
			}

			sum.routes++;
			sum.orders += routelist.ordersCount;
			sum.duration += routelist.durationFull;
			sum.distance += routelist.distance;
		});

		autos.sort(function(a,b){
			if (a.auto_name > b.auto_name) {
				return -1;			
			} else {
				return 0;
			}
		});

		var sumTemplate = new Ext.XTemplate(
			'<tr style="background-color: #eee; font-weight: bold;">',
				'<td colspan="2">Всего:</td>',
				'<td style="text-align: right;">{routes}</td>',
				'<td style="text-align: right;">{orders}</td>',
				'<td style="text-align: right;">{distance}</td>',
				'<td style="text-align: right;">{[secToHHMMSS(values.duration)]}</td>',
				'<td colspan="2"></td>',
			'</tr>',
		);

		var sumTr = sumTemplate.apply(sum);

	    	var template = new Ext.XTemplate(
      		'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
      		'<html>',
        		'<head>',
          		'<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />',
	  		'<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">',
	  		'<link type="text/css" rel="stylesheet" href="css/font-awesome/font-awesome-all.css" />',
	  		'<link type="text/css" rel="stylesheet" href="css/main.css" />',
          		'<link type="text/css" rel="stylesheet" href="css/print.css?' + Date.now() + '" />',
          		'<title>Сводка расчета маршрутных листов</title>',
        		'</head>',
        		'<body>',
				this.getTimeStamp(),
				'<br />',
				grid.getTitle().replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, ""),
		  		'<h3>Сводка расчета маршрутных листов</h3>',
				 this.getParamTemplate(),
				 this.getStatTemplate(),
				'<table class="print">',
					'<tr style="background-color: #eee; text-align: center;">',
						'<td style="width: 20px;">№</td>',
        					'<td style="width: 300px;">Наименование</td>',
						'<td style="width: 50px;">Маршрутов</td>',
						'<td style="width: 50px;">Заказов</td>',
						'<td style="width: 50px;">Длина</td>',
						'<td style="width: 50px;">Длит.</td>',
						'<td style="width: 50px;">Начало</td>',
						'<td style="width: 50px;">Конец</td>',
					'</tr>',
	      	    			'<tpl for=".">',
						'<tr>',
							'<td style="text-align: right;">{#}</td>',
        						'<td>{name}</td>',
							'<td style="text-align: right;">{routes}</td>',
							'<td style="text-align: right;">{orders}</td>',
							'<td style="text-align: right;">{distance}</td>',
							'<td style="text-align: right;">{[secToHHMMSS(values.duration)]}</td>',
							'<td style="text-align: right;">{[secToHHMMSS(values.worktime_begin)]}</td>',
							'<td style="text-align: right;">{[secToHHMMSS(values.worktime_end)]}</td>',
						'</tr>',
       	    				'</tpl>',
					sumTr,
				'</table>',
				'<br />',
				'<br />',
        		'</body>',
      		'</html>'
    		);

		var html = template.apply(autos);
    
    		//open up a new printing window, write to it, print it and close
    		var win = window.open('', 'printgrid' + Date.now());
    
    		win.document.write(html);
		win.document.close();
	},

	getParamTemplate: function(){
		var date = parseInt(this.calc_params.orders_date);
		var new_date = new Date(date / 10000, (date % 10000 / 100)-1, date % 100);
		this.calc_params.orders_date_text = new_date.toLocaleDateString();

		this.calc_params.refuel_mode_text = Ext.getStore("RefuelMode").getById(this.calc_params.refuel_mode).get("name");
		this.calc_params.solution_strategy_text = Ext.getStore("CalcAlgorithm").getById(this.calc_params.solution_strategy).get("name");

        	var paramTemplate = new Ext.XTemplate(
		'<table class="print_sm">',
		'<tr style="background-color: #eee; font-weight: bold;">',
			'<td style="text-align: center;">Параметр</td>',
			'<td style="text-align: center;">Значение</td>',
		'</tr>',
		'<tr>',
			'<td>Дата</td>',
			'<td style="font-weight: bold;">{orders_date_text}</td>',
		'</tr>',
		'<tr>',
			'<td>Допустимое время ожидания, мин.</td>',
			'<td style="font-weight: bold;">{[values.time_waiting/60]}</td>',
		'</tr>',
		'<tr>',
			'<td>Стоимость машины, мин.</td>',
			'<td style="font-weight: bold;">{fixed_cost_all_vehicles}</td>',
		'</tr>',
		'<tr>',
			'<td>Глобальный коэффициент дуги (продолжительность)</td>',
			'<td style="font-weight: bold;">{globalspancoeff_duration}</td>',
		'</tr>',
		'<tr>',
			'<td>Глобальный коэффициент дуги (расстояние)</td>',
			'<td style="font-weight: bold;">{globalspancoeff_distance}</td>',
		'</tr>',
		'<tr>',
			'<td>Минимизация времени</td>',
			'<td style="font-weight: bold;">',
			'<tpl if="minimize_time">',
				'Да',
			'<tpl else>',
				'Нет',
			'</tpl>',
			'</td>',
		'</tr>',
		'<tr>',
			'<td>Мягкая нижняя граница (вода, л.)</td>',
			'<td style="font-weight: bold;">{softlowerbound_water}</td>',
		'</tr>',
		'<tr>',
			'<td>Расчет заправок</td>',
			'<td style="font-weight: bold;">{refuel_mode_text}</td>',
		'</tr>',
		'<tr>',
			'<td>Заправка по расходу "до полного"</td>',
			'<td style="font-weight: bold;">',
			'<tpl if="refuel_full_tank">',
				'Да',
			'<tpl else>',
				'Нет',
			'</tpl>',
			'</td>',
		'</tr>',
		'<tr>',
			'<td>Алгоритм</td>',
			'<td style="font-weight: bold;">{solution_strategy_text}</td>',
		'</tr>',
		'<tr>',
			'<td>Использовать локальный поиск</td>',
			'<td style="font-weight: bold;">',
			'<tpl if="use_guided_local_search">',
				'Да',
			'<tpl else>',
				'Нет',
			'</tpl>',
			'</td>',
		'</tr>',
		'<tr>',
			'<td>Макс. время поиска решения, мин</td>',
			'<td style="font-weight: bold;">{time_limit}</td>',
		'</tr>',
		'</table>',
		);

		return paramTemplate.apply(this.calc_params);
	},

	getStatTemplate: function(){
        	var statTemplate = new Ext.XTemplate(
		'<table class="print">',
		'<tr>',
			'<td style="background-color: #eee; text-align: center;">Начало расчета</td>',
			'<td style="text-align: center; font-weight: bold;">{calc_begin}</td>',
			'<td style="background-color: #eee; text-align: center;">Конец расчета</td>',
			'<td style="text-align: center; font-weight: bold;">{calc_end}</td>',
			'<td style="background-color: #eee; text-align: center;">Длительность</td>',
			'<td style="text-align: center; font-weight: bold;">{calc_time}</td>',
		'</tr>',
		'<tr>',
			'<td style="background-color: #eee; text-align: center;">Заказов всего</td>',
			'<td style="text-align: center; font-weight: bold;">{orders_all_count}</td>',
			'<td style="background-color: #eee; text-align: center;">Распределено</td>',
			'<td style="text-align: center; font-weight: bold;">{orders_routes_count}</td>',
			'<td style="background-color: #eee; text-align: center;">Отброшено</td>',
			'<td style="text-align: center; font-weight: bold;">{dropped_orders_count}</td>',
		'</tr>',
		'</table>',	
		);

		return statTemplate.apply(this.calc_stat);
	},

	getTimeStamp: function(){
       		var dateTime = new Date(); 
		return '<span>Сформировано ' + dateTime.toLocaleString() + '</span>';
	},

	openResultDialog: function(){
		var self = this;
		if (!this.tempResultsEdit || this.tempResultsEdit.destroyed) this.tempResultsEdit = Ext.create('widget.tempresultviewer');
		this.tempResultsEdit.show();
	},
});