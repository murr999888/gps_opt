Ext.define('Opt.ux.NumberPrompt', {
    extend: 'Ext.window.MessageBox',
    initComponent: function() {
        this.callParent();
        var index = this.promptContainer.items.indexOf(this.textField);
        this.promptContainer.remove(this.textField);
        this.textField = this._createNumberField();
        this.promptContainer.insert(index, this.textField);
	this.textField.setValue(30);

    },

    _createNumberField: function() {
        //copy paste what is being done in the initComonent to create the textfield
        return new Ext.form.field.Number({
                        id: this.id + '-textfield',
                        anchor: '100%',
			width: 50,
			fieldStyle: 'text-align: right;',
			value: 30,
			maxValue: 180,
			minValue: 0,
			step: 10,
                        enableKeyEvents: true,
                        listeners: {
                            keydown: this.onPromptKey,
                            scope: this
                        }
        });
    }
});
