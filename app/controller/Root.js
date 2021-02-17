Ext.define('Opt.controller.Root', {
    extend: 'Ext.app.Controller',
    alias: 'controller.root',

    lastWSStateConnected: false,

    requires: [
        'Opt.view.dialog.Login',
        'Opt.view.Main',
    ],

    //при запуске
    init: function() {
        //Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
	Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider());
	Ext.Ajax.setTimeout(60*60000);
    },

    // при пуске и после создания вьюпорта
    onLaunch: function() {
        //проверяется наличие сервера
        // если есть отклик - запускается коллбек
        Ext.Ajax.request({
            scope: this,
            url: 'api/server',
            callback: this.onServerReturn
        });
    },

    // проверка наличия сессии
    onServerReturn: function(options, success, response) {
        var token, parameters = {};
        if (success) {
            Opt.app.setServer(Ext.decode(response.responseText));

            token = Ext.Object.fromQueryString(window.location.search).token;
            if (token) {
                console.log('Token: ' + token);
                parameters.token = token;
            }

            Ext.Ajax.request({
                scope: this,
                url: 'api/session',
                method: 'GET',
                params: parameters,
                callback: this.onSessionReturn
            });
        } else {
            Opt.app.showError("Ошибка", response);
        }
    },

    // если сессия существует - загружаем приложение,	
    // если сессии нет - выводим окно логина

    onSessionReturn: function(options, success, response) {
        Ext.get('spinner').setVisible(false);
        if (success) {
            Opt.app.setUser(Ext.decode(response.responseText));
            this.loadApp();
        } else {
            this.login = Ext.create('widget.login', {
                listeners: {
                    scope: this,
                    login: this.onLogin
                }
            });
            this.login.show();
        }

    },

    // логин состоялся - запускаем приложение
    onLogin: function() {
        this.login.close();
        this.loadApp();
    },

    // загружаются хранилища и запускается основное окно
    loadApp: function() {
        var self = this;

        /*
        		var v;
        		var serverStateProvider = new Opt.util.HttpStateProvider({
                    		userId: Opt.app.getUser().id, 
        			url: 'api/state', 
        			stateRestoredCallback: function () {
                        		if (!v) {
                            			v = Ext.create('widget.main');
                        		}
                    		}
        		});

        		Ext.state.Manager.setProvider(serverStateProvider);
        */
        Ext.getStore('Product').load();
	Ext.getStore('Goods').load();
	Ext.getStore('Traffic').load();
        Ext.getStore('ClientGroup').load();
	Ext.getStore('AutosGroup').load();
	Ext.getStore('Drivers').load();
	Ext.getStore('HelpTableContent').load();
        Ext.getStore('CalcLog').load();	
        Ext.getStore('Auto').load();
	Ext.getStore('MainDepot').load();
	Ext.getStore('Depots').load();
	Ext.getStore('DeliveryGroups').load();
	Ext.getStore('TempResults').load();

	if (Ext.getStore('MainDepot').count() == 0) {
		Opt.app.getMainDepotFromServer();
	}

        Ext.create('widget.main');
        Ext.get('spinner').setVisible(false);
        self.createWS();
    },

    createWS: function(first) {
        var self = this;

        var socket = Opt.app.getSocket();

        //pathname = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        if (socket) {
            socket.onclose = function() {};
            socket.close(1000);
            Opt.app.setSocket(null);
        };

	socket = new WebSocket(socketAddr);
        Opt.app.setSocket(socket);

        socket.onerror = function(evt) {
            console.log(evt);
            if (socket) {
                socket.close(1000);
                Opt.app.setSocket(null);
            };
        }

        socket.onclose = function(event) {
            Ext.getCmp('maintab').header.setIconCls('fa fa-red-indicator fa-shadow fa-circle');

            if (this.lastWSStateConnected) {
                Opt.app.showToast('Внимание!', 'Потеряно соединение с сервером..');
                self.lastWSStateConnected = false;
                self.fireEvent("serverDisconnect");
            }

	    console.log("serverDisconnect");
	    console.log(event);

            setTimeout(function() {
                self.createWS(false);
            }, 5000);
        }

        socket.onopen = function() {
            Ext.getCmp('maintab').header.setIconCls('fa fa-green-indicator fa-shadow fa-circle');
            if (!this.lastWSStateConnected) {
                if (!first) Opt.app.showToast('Внимание!', 'Установлено соединение с сервером..');
                this.lastWSStateConnected = true;
            }
        }

        socket.onmessage = function(event) {
            try {
                var data = Ext.decode(event.data);
            } catch (ex) {
                console.log(ex);
                console.log(data);
                return;
            }

            if (data.error && data.solve == 'optimize_route' && data.error != 'OK') {
                self.fireEvent('optimized_route_error', data);
            }

            if (data.error && data.solve == 'distribute_orders' && data.error != 'OK') {
                self.fireEvent('distributed_orders_error', data);
            }

            if (data.solve && data.solve == 'optimize_route') {
                self.fireEvent('optimized_route_recieved', data);
            }

            if (data.solve && data.solve == 'distribute_orders') {
                self.fireEvent('distributed_orders_recieved', data);
            }

            if (data.solve && data.solve == 'addingorders_toroutes') {
                self.fireEvent('adding_orders_recieved', data);
            }

            if (data.error && data.solve == 'addingorders_toroutes' && data.error != 'OK') {
                self.fireEvent('adding_orders_error', data);
            }

            if (data.solve && data.solve == 'Unknown') {
		self.fireEvent('optimized_route_error', data);
                self.fireEvent('distributed_orders_error', data);
		self.fireEvent('adding_orders_error', data);
            }
        };
    },

});