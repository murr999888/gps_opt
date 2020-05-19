Ext.define('Opt.view.dialog.WaitingCalcController', {
	extend: 'Opt.view.dialog.BaseEditController',
	alias: 'controller.waitingcalc',
	timerId: null,

	init: function () {

	},

	getPanelText: function(timerIncr, timerDecr){
		return '<div style="font-size: 18px; text-align: center;">Прошло: <b><span style="color: brown;">' + secToHHMMSS(timerIncr) + '</span></b>, <br />осталось <b><span style="color: blue;">~' + secToHHMMSS(timerDecr) + '</span></b></div>';
	},

	afterRender: function(){
		var self = this;
		var timerIncr = this.getView().timerIncr;
		var timerDecr = this.getView().timerDecr;

		var panelText = this.getView().down('panel');
		panelText.setHtml(this.getPanelText(timerIncr, timerDecr));

		var win = self.getView();
      		this.timerId = setInterval(function () {
			panelText.setHtml(self.getPanelText(timerIncr, timerDecr));
			++timerIncr;
			if (--timerDecr < 0) {
				clearInterval(self.timerId);
				win.destroy();
			}
		}, 1000);
	},

	pressBreakButton: function (button) {
		var self = this;
		button.setDisabled(true);
		this.fireEvent("breakCalcCommand");
		if (this.timerId) {
			clearInterval(this.timerId);
			this.timerId = null;
		}
		//this.getView().destroy();
	},
});