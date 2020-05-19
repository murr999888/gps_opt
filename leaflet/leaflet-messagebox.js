L.Control.Messagebox = L.Control.extend({
    options: {
        position: 'topright',
        timeout: 3000
    },

    onAdd: function (map) {
        this._container = L.DomUtil.create('div', 'leaflet-control-messagebox');

	var head = '<div class="info_mainheader"><div class="info_head" id="info_head"></div><div class="info_close"><span style="margin-left: 15px; cursor: pointer; color:#ccc; font-size: 10px;" onclick="closeParent(this);">Скрыть</span></div></div>';
	var mess = '<div class="info_mess" id="info_mess"></div>';
	this._container.innerHTML =  head + mess;

        L.DomEvent.disableScrollPropagation(this._container);
	L.DomEvent.disableClickPropagation(this._container);
        return this._container;
    },

    setMess: function (message) {
        var elem = this._container.getElementsByClassName("info_mess")[0];
	if (elem){
	        elem.innerHTML = message;
	}
    },

    getMess: function (message) {
        var elem = this._container.getElementsByClassName("info_mess")[0];
	if (elem){
        	return elem.innerHTML;
	}
    },

    setHead: function (message) {
        var elem = this._container.getElementsByClassName("info_head")[0];
	if (elem){
	        elem.innerHTML = message;
	}
    },

    getHead: function (message) {
        var elem = this._container.getElementsByClassName("info_head")[0];
	if (elem){
        	return elem.innerHTML;
	}
    },

    show: function (message, header) {
        var elem = this._container;

	if (header){
		this.setHead(header);
	}

	if (message) {
		this.setMess(message);
	}

        elem.style.display = 'block';
    },

    hide: function(){
        var elem = this._container;
	elem.style.display = 'none';
    },

    open: function(){
        var elem = this._container;
	elem.style.display = 'block';
    },

    isOpen: function(){
        var elem = this._container;
	return elem.style.display == 'block';
    }
});

L.Map.mergeOptions({
    messagebox: false
});

L.Map.addInitHook(function () {
    if (this.options.messagebox) {
        this.messagebox = new L.Control.Messagebox();
        this.addControl(this.messagebox);
    }
});

L.control.messagebox = function (options) {
    return new L.Control.Messagebox(options);
};
