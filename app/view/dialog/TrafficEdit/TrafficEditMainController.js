Ext.define('Opt.view.dialog.TrafficEdit.TrafficEditMainController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.trafficeditcontroller',

	onShow: function(){
		this.fireEvent("TrafficEditShow");
	},

	onWindowResize: function () {
		Ext.getCmp('trafficeditmap').doResize();
	},

	saveRecord: function (dialog) {
		dialog.updateRecord();

		var record = dialog.getRecord();
        	var store = record.store;

		if (store) {
			if (record.phantom) {
				store.add(record);
			}
			store.sync({
				failure: function (batch) {
					store.rejectChanges();
					Opt.app.showError("Ошибка", batch.exceptions[0].getError().response);
				},

				success: function (batch, options) {
					//console.log(batch);
				}
			});
		} else {
			record.save();
		}
	},

	onSaveClick: function (button) {
		var self = this;
		var store, record;

		var form = button.up('window').down('form');
		var formValues = form.getValues();

		form.updateRecord();

		var pointGrid = button.up('window').down('trafficpointsgridpanel');

		record = form.getRecord();
		record.set('points', Ext.pluck(pointGrid.getStore().data.items, 'data'));

		var formIsValid = true;

		if (formValues.name == '') {
			formIsValid = false;
		}

		if (formValues.speed == '') {
			formIsValid = false;
		}

		if (!formIsValid) {
			Ext.Msg.alert('Внимание', 'Не заполнены поля формы!');
			return;
		};

		var mapCmp = Ext.getCmp('trafficeditmap');

		if (!mapCmp.startTrafficMarker || !mapCmp.finishTrafficMarker) {
			formIsValid = false;
		}

		if (!formIsValid) {
			Ext.Msg.alert('Внимание', 'Участок дороги не выделен!');
			return;
		};
		
		this.saveRecord(form);
		button.up('window').close();
	},

	closeView: function (dialog) {
		this.getView().close();
	},
});