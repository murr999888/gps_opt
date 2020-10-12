Ext.define('Opt.view.AutoGridController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.autogrid',
	checkedAll: true,
	autoEdit: null,
	requires: [
		'Opt.view.dialog.AutoEdit',
	],

	init: function () {
		
		var store = Ext.create('Ext.data.Store', {
			model: 'Opt.model.Auto',
			proxy: {
				type: 'memory',
			},
		});
		
		this.getView().setStore(store);
		store.load();
		this.getView().getSelectionModel().setSelectionMode('MULTI')
	},

	onCellDblClick: function (grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
		//this.autoEdit = null;
		//this.autoEdit = Ext.create('widget.autoedit');
		if (!this.autoEdit)  this.autoEdit = Ext.create('widget.autoedit');
		this.autoEdit.down('form').loadRecord(record);
		var form = this.autoEdit.lookupReference('form').getForm();

		form.setValues({
			worktime_begin_1: secToHHMM(record.get("worktime_begin")),
			worktime_end_1: secToHHMM(record.get("worktime_end")),
			route_begin_endtime_1: secToHHMM(record.get("route_begin_endtime")),
			route_end_endtime_1: secToHHMM(record.get("route_end_endtime")),
		});

		var store = this.autoEdit.down('allowedclientgroups').store;

		store.removeAll();

		var allowedGroups = record.get("allowed_clientgroups");
		if (allowedGroups) {
			//store.suspendEvents();
			store.loadData(allowedGroups);
			store.sync();
			//store.resumeEvents();
		}

		this.autoEdit.show().focus();

	},

	getRouteBeginTime: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var worktime_begin = record.get("worktime_begin");
		var worktime_end = record.get("worktime_end");
		var route_begin_endtime = record.get("route_begin_endtime");

		if (!(worktime_begin == route_begin_endtime) && !(worktime_end == route_begin_endtime)) {
			return secToHHMM(worktime_begin.toFixed()) + " - " + secToHHMM(route_begin_endtime.toFixed());;
		} else {
			return "";
		}
	},

	getRouteEndTime: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var worktime_end = record.get("worktime_end");
		var route_end_endtime = record.get("route_end_endtime");

		if (!(worktime_end == route_end_endtime)) {
			return "до " + secToHHMM(route_end_endtime.toFixed());
		} else {
			return "";
		}
	},

	getTime: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (val > 0) {
			return secToHHMM(val.toFixed());
		} else {
			return "";
		}
	},

	getWorkTime: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var worktime_begin = record.get("worktime_begin").toFixed();
		var worktime_end = record.get("worktime_end").toFixed();
		return secToHHMM(worktime_begin) + "-" + secToHHMM(worktime_end);
	},

	getDriverName: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		var id = record.get('driver_id');
		if (id == 0) {
			metadata.style = 'background-color: yellow;'; 
		}
		return val;
	},

	getCapacity: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		return record.get("water") + "/" + record.get("bottle") + "/" + record.get("tank");
	},

	getNumbers: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		metadata.style = 'text-align: right;'; 
		if (val == 0) {
			return "";
		}
		return val;
	},

	onChangeInUse: function (checkbox, rowIndex, checked, record, e, eOpts) {
		record.commit();
		record.save();
	},

	getFuelIcon: function (val, metadata, record, rowIndex, colIndex, store, view) {// tdCls, tdAttr, and tdStyle
		if (record.get('fuel_first_station') != 0) {
			//metadata.tdCls = 'vert_middle';
			return '<div style="height: 14px; width: 14px; background: url(css/images/gas_station_16x16.png) no-repeat; no-repeat center center; background-size: 14px; "></div>';
		}
		return val;
	},

	onHeaderCheckChange: function (column, checked, e, eOpts) {
		var store = this.getView().store;
		store.suspendEvents();
		store.save();
		store.resumeEvents();
		this.getView().view.refresh();
	},
});