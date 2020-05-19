Ext.define('Ext.ux.CKeditor', {
    	extend: 'Ext.form.field.TextArea',
    	alias: 'widget.ckeditor',
    
    	defaultListenerScope: true,
	fieldRendered: false,
	fieldChanged: false,
    
    	listeners: {
      		instanceReady: 'instanceReady',
      		resize: 'resize',
      		boxready : 'onBoxReady',
    	},

    	editorId: null,
    	editor:null,
    	CKConfig: {},

    	constructor: function () {
        	this.callParent(arguments);
    	},

	init: function(){
		//console.log('init');
	},

    	initComponent: function () {
        	this.callParent(arguments);
		var self = this;

        	self.on("afterrender", function () {
			var self = this;
            		Ext.apply(self.CKConfig, {
                		height: self.getHeight(),
                		width: self.getWidth()
            		});

            		self.editor = CKEDITOR.replace(self.inputEl.id, { removeButtons: 'Maximize', width: 800, height: 600 });
			CKFinder.setupCKEditor(self.editor);
            		self.editorId = self.inputEl.id;
            		self.editor.name = self.name;

            		self.editor.on("instanceReady", function (ev) {
                		self.fireEvent(
                    			"instanceReady",
                    			self,
                    			self.editor
                		);
            		}, self);

			self.editor.on('change',function(){
    				self.fieldChanged = true;
			});
        	}, self);
    	},

    	instanceReady : function (ev) {
        	// Set read only to false to avoid issue when created into or as a child of a disabled component.
        	ev.editor.setReadOnly(false);
		this.fieldRendered = true;
		Ext.getCmp('helpeditor').setHeight(Ext.getCmp('helpeditor').getHeight()+1)

    	},

    	onRender: function (ct, position) {
        	if (!this.el) {
            		this.defaultAutoCreate = {
                		tag: 'textarea',
                		autocomplete: 'off'
            		};
        	}

        	this.callParent(arguments)
    	},

    	setValue: function (value) {
        	this.callParent(arguments);
        	if (this.editor) {
            		this.editor.setData(value);
        	}
    	},

    	getValue: function () {
        	if (this.editor) {
            		return this.editor.getData();
        	}
        	else {
            		return ''
        	}
    	},

	destroy: function(){
        	// delete instance
		var instance = CKEDITOR.instances[self.editorId];
        	if(instance){
			instance.destroy();
        	}

		this.callParent(arguments);
	},

    	resize: function(win, width, height,opt) {
		var self = this;
		if (self.fieldRendered) {
			self.editor.resize(width, height);
		}
    	},

    	onBoxReady : function(win, width, height, eOpts){
    	},

});