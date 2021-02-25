Ext.define('Opt.view.tabs.tab3.TrafficGridTab3Controller', {
	extend: 'Opt.view.TrafficGridController',
	alias: 'controller.tab3trafficgrid',
	checkedAll: true,
	trafficEdit: null,
	stateful: true,
	stateId: 'tab3trafficgridpanel',
	trafficEdit: null,

	requires: [
		'Opt.view.dialog.TrafficEdit.TrafficEditMain',
	],
	
	loadMask: null,

	afterRender: function(){
      		this.loadMask = new Ext.LoadMask({
   			msg    : 'Ждите окончания выполнения запроса ...',
    			target : Ext.getCmp('maintab3'),
			style: 'z-index: 1000;',
		});
	},

	sendTraffic: function(){
		var self = this;
		Ext.Msg.show({
			title: 'Внимание',
			message: 'Обновление данных на сервере может занять несколько минут. Продолжить?',
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION,
			fn: function (btn) {
				if (btn === 'yes') {
					self.sendTrafficToOSRM();
				} else if (btn === 'no') {
					return;
				}
			}
		});
	},

	sendTrafficToOSRM: function(){
		var self = this;
		var store = this.getView().getStore();

		var data = [];

		store.each(function(record){
			var traffic = {
				id: record.get("id"),
				name: record.get("name"),
				speed: record.get("speed"),
				rate: record.get("rate"),
				both_direction: record.get("both_direction"),
				points: record.get("points"),
			};
			data.push(traffic);					
		});

		var params = {
			param: 'setTraffic',
			data: data
		};

		this.loadMask.show();

		Ext.Ajax.request({
			url: 'api/db/vrp',
			method: 'POST',
			jsonData: params,

			success: function (response) {
 				try {
					respObj = Ext.JSON.decode(response.responseText);
			        } catch(error) {
					self.loadMask.hide();
					Opt.app.showError("Ошибка!", error.message);
					console.log(error);
					return;
        			}

				self.loadMask.hide();

				if (respObj.success) {
					Ext.Msg.alert("Внимание!", respObj.message + '<br />' + respObj.data);
				}
			},

			failure: function (response) {
				self.loadMask.hide();
				Ext.Msg.alert("Ошибка!", "Статус запроса: " + response.status);
				console.log(response);
				return;
			}
		});
	},

	loadTraffic: function(){
		var store = this.getView().getStore();
		store.reload();
	},

	deleteTrafficRecords: function(selection){
		var store = this.getView().getStore();
		for (var i=0; i<selection.length; i++) {
			store.remove(selection[i]);
		}
		store.sync();
	},

	removeTraffic: function(){
		var self = this;
		var grid = this.getView();

        	var selection = grid.getSelection();
		if (selection.length == 0) {
			Ext.Msg.alert('Внимание!', 'Выделите строки!');
			return;
		}
	
		Ext.Msg.show({
			title: 'Внимание',
			message: 'Вы собираетесь удалить ' + selection.length + ' строк. Продолжить?',
			buttons: Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION,
			fn: function (btn) {
				if (btn === 'yes') {
					self.deleteTrafficRecords(selection);
				} else if (btn === 'no') {
					return;
				}
			}
		});
	},

	addTraffic: function(){
		if (!this.trafficEdit) {
			this.trafficEdit = Ext.create('widget.trafficedit');
		}
        	var record = Ext.create('Opt.model.Traffic');
		record.set('points',[]);

        	record.store = this.getView().getStore();
		this.trafficEdit.down('trafficpointsgridpanel').getStore().removeAll();

        	this.trafficEdit.down('form').loadRecord(record);
		this.trafficEdit.down('htmlcombo').setValue('css/images/signs/znak-proezd-16-16.png');
        	this.trafficEdit.show().focus();
	},

	onEditRecord : function (grid, rowIndex, colIndex, item, e, record) {
		if (!this.trafficEdit || this.trafficEdit.destroyed) this.trafficEdit = Ext.create('widget.trafficedit');

                this.trafficEdit.down('trafficpointsgridpanel').getStore().removeAll();
        	this.trafficEdit.down('form').loadRecord(record);
		this.trafficEdit.down('trafficpointsgridpanel').getStore().loadData(record.get("points"));
        	this.trafficEdit.show().focus();
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		this.fireEvent("getTrafficLineOnMap", record.get('id'));
	},
});