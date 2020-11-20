var mainCityName = "г.Мариуполь";
var socketSrv = "10.10.1.4";
//var socketSrv = "127.0.0.1";
var socketAddr = "ws://"+ socketSrv + ":4649/Solver";
var testmode = true;

var max_penalty_value = 24*60;

var socket;
var sliderHTML = '<div style="padding-left:1em">|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<div>Low&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Average &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;High </div></div>';
var kav = "'";
var speedLimit = 65;
var speedLimitMax = 90;

var finishMarker = null;

var def_tracker_time_begin = '07:30:00';
var def_tracker_time_end = '20:00:00';

var def_route_time_begin = 8*60*60;
var def_route_time_end = 20*60*60;

var minPartTrackDuration = 60;
var maxLatestTrackerTime = 5 * 60 * 1000;

var update_interval = 10 * 1000;
var time_porog = 40; //время (секунды) от последней позиции, свыше которого счиатем, что трекер стоит

var batteryVoltage = {minVal: 3.3, maxVal: 4.3};
var accumVoltage = {minVal: 10, maxVal: 14.5};

// Показывать данные
var showAltitude = false; // Высота над уровнем моря
var showAcc = true; // Состояние зажигания
var showSatellite = true; // Количество спутников
var showAddParam = false; // Дополнительные параметры (температура, напряжение и пр.)

var indicatorTitleSpanWidth = 85;
var popupIndicatorWidth = 30;

var maxZoomLevel = 18;

var routeOSRM = null;
var osm = null;
var roadMutant = null;
var satMutant = null;

var pad = {
    paddingTopLeft: L.point(25, 30), //наоборот left - top
    paddingBottomRight: L.point(5, 5)
};

var radiusClosestStop = 50;
// Струмок
var strumokpoint = [47.07559, 37.50796];

// геоограда - Струмок
var gf_1 = [47.07555, 37.50734]; // левый
var gf_2 = [47.07667, 37.50863]; // верхний
var gf_3 = [47.07628, 37.50941]; // правый
var gf_4 = [47.07514, 37.50812]; // нижний

var geofence_strumok = [gf_1, gf_2, gf_3, gf_4];

var arrSimpleCityBounds = 

	[
		[47.026608446430544, 37.46646916132715], 
		[47.09490115201504 , 37.4699023888662 ],
		[47.13882414022814 , 37.46852909785058], 
		[47.16450694870298 , 37.47264897089746], 
		[47.17757706560562 , 37.51247441035058], 
		[47.17384307470158 , 37.531013839061515], 
		[47.20790600856813 , 37.53719364863183], 
		[47.237285213027434, 37.58182560663964], 
		[47.20137508540242 , 37.58182560663964], 
		[47.1794439625956  , 37.59349858027245], 
		[47.161705790893194, 37.63195072870995], 
		[47.207439540721055, 37.71572148066308], 
		[47.20184160657914 , 37.74181400995996], 
		[47.1318175838793  , 37.69649540644433], 
		[47.08181070019114 , 37.723274581249015], 
		[47.026608446430544, 37.46646916132715]
	]
;

var eventsCount = 15;
var popupOptionsPos = {
	maxWidth: 600,
	autoPan: true
};

function getDDMMYYYY(str) {	
	if (str.length == 6) {
		var year = str.substring(0, 4);
		var month = str.substring(4, 6);
		var day = str.substring(6, 8);

		return year + '-' + month + '-' + day;
	} else {
		return str;
	}
}

function Parse1CData(ms) {
	var date = new Date();
	date.setTime(ms);

        var hours = date.getHours();
	if (hours < 10) {
		hours = "0" + hours;
	}

        var minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes;
	}

        var seconds = date.getSeconds();
	if (seconds < 10) {
		seconds = "0" + seconds;
	}

        var day = date.getDate();
	if (day < 10) {
		day = "0" + day;
	}
        var month = date.getMonth()+1;
	if (month < 10) {
		month = "0" + month;
	}
        var year = date.getFullYear();
        return "" + year + month + day + hours + minutes + seconds;
    }


function _toRadian (degree) {
  return degree * Math.PI / 180;
};

function getDistance(array, decimals) {

  decimals = decimals || 3;
  var earthRadius = 6378.137, // km
    distance = 0,
    len = array.length,
    i,
    x1,
    x2,
    lat1,
    lat2,
    lon1,
    lon2,
    dLat,
    dLon,
    a,
    c,
    d;
  for (i = 0; (i + 1) < len; i++) {
    x1 = array[i];
    x2 = array[i + 1];

    lat1 = parseFloat(x1[0]);
    lat2 = parseFloat(x2[0]);
    lon1 = parseFloat(x1[1]);
    lon2 = parseFloat(x2[1]);

    dLat = _toRadian(lat2 - lat1);
    dLon = _toRadian(lon2 - lon1);
    lat1 = _toRadian(lat1);
    lat2 = _toRadian(lat2);

    a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    d = earthRadius * c;
    distance += d;
  }
  distance = Math.round(distance * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return distance;
};

var arr_snd = [];

function play(audio, callback) {
	audio.play();
      	if (callback) {
        	//When the audio object completes it's playback, call the callback
        	//provided      
        	audio.addEventListener('ended', callback);
      	}
}

function playNext() {
	if (arr_snd.length > 0) {
		var currFile = arr_snd[0];
		var audio = new Audio(currFile);
		play(audio, function(){
			arr_snd.shift();
			playNext();
		});
	}
}

function addAndPlay(sndFile) {
	arr_snd.push(sndFile);
	if (arr_snd.length == 1) {  	// если в массиве только этот элемент, то запустим проигрывание
		playNext();		// если там больше - значит воспроизведение уже идет и новый файл будет проигран в очереди
	}
}


function getStrCourse(grad) {
    var strC = '';
    if (grad > 348.75 && grad < 360) {
        strC = 'С';
    }

    if (grad >= 0 && grad <= 11.25) {
        strC = 'С';
    }

    if (grad > 11.25 && grad <= 33.75) {
        strC = 'C-СВ';
    }

    if (grad > 33.75 && grad <= 56.25) {
        strC = 'СВ';
    }

    if (grad > 56.25 && grad <= 78.75) {
        strC = 'В-СВ';
    }

    if (grad > 78.75 && grad <= 101.25) {
        strC = 'В';
    }

    if (grad > 101.25 && grad <= 123.75) {
        strC = 'В-ЮВ';
    }

    if (grad > 123.75 && grad <= 146.25) {
        strC = 'ЮВ';
    }

    if (grad > 146.25 && grad <= 168.75) {
        strC = 'Ю-ЮВ';
    }

    if (grad > 168.75 && grad <= 191.25) {
        strC = 'Ю';
    }

    if (grad > 191.25 && grad <= 213.75) {
        strC = 'Ю-ЮЗ';
    }

    if (grad > 213.75 && grad <= 236.25) {
        strC = 'ЮЗ';
    }

    if (grad > 236.25 && grad <= 258.75) {
        strC = 'З-ЮЗ';
    }

    if (grad > 258.75 && grad <= 281.25) {
        strC = 'З';
    }

    if (grad > 281.25 && grad <= 303.75) {
        strC = 'З-СЗ';
    }

    if (grad > 303.75 && grad <= 326.25) {
        strC = 'СЗ';
    }

    if (grad > 326.25 && grad <= 348.75) {
        strC = 'C-СЗ';
    }

    return '<span title="' + Math.round(grad) + '&deg;">' + strC + '</span><img class = "arrow" title="' + Math.round(grad) + '&deg;" style="margin-left: 5px; margin-bottom: -3px; transform: rotate(' + grad + 'deg);" src="images/arrow-up.png"></img>';
}

function getClusterPopup(layer) {
    	var popupClasterText = '<table class="clusterPopupTable" style="width: 100%;"><tbody>';
    	var bounds = layer.getBounds();

	var childMarkers = layer.getAllChildMarkers();
	//console.log(childMarkers);

	for (var i = 0; i < childMarkers.length; i++) {
		var feature = childMarkers[i].feature;
            	popupClasterText = popupClasterText + '<tr><td><span';

            	if (feature.properties.flagneisp == 1) {
                	popupClasterText = popupClasterText + ' class="red"'
            	}

            	popupClasterText = popupClasterText + '>';

            	popupClasterText = popupClasterText + '<b>' + feature.properties.naim + '</b><br />';

            	if (feature.properties.adres != '') {
                	popupClasterText = popupClasterText + feature.properties.adres + '<br />';
            	}

            	popupClasterText = popupClasterText + feature.properties.sod + feature.properties.vremya + '</span>';

	}

    	popupClasterText = popupClasterText + '</td></tr></tbody></table>';

    	layer.bindPopup(popupClasterText, popupOptionsCluster);
    	layer.openPopup();
}



function secToMin(x) {
    var h, m, s;
    if (x == 0) {
        return '-';
    }
    if (x > 0) {
        if (x < 60) {
            h = 0;
            m = 0;
            s = x;
        }

        if (x >= 60) {
            sec = x / 60;
            a = (sec.toString()).split(".");
            s = x - (a[0] * 60);

            if (a[0] < 60) {
                h = 0;
                m = a[0];
            }

            if (a[0] >= 60) {
                b = ((a[0] / 60).toString()).split(".");
                h = b[0];
                m = a[0] - (b[0] * 60);
            }
        }

        if (h < 10) {
            h = h.toString();
            h = "0" + h;
        }
        if (m < 10) {
            m = m.toString();
            m = "0" + m;
        }
        if (s < 10) {
            s = s.toString();
            s = "0" + s;
        }

        if (h == "00") {
            return (m + ":" + s);
        }

        if (h == "00" && m == "00") {
            return (s + " сек.");
        }

        return (h + ":" + m + ":" + s);
    }
}

function minToHHMM(minutes) {
	var m = minutes % 60;
	var h = (minutes - m)/60;
	return (h<10 ? "0" : "") + h.toString() + ":" + (m<10 ? "0" : "") + m.toString();
}

function convertTimestampToDate(timestamp) {
    var d = new Date(timestamp * 1000); // Convert the passed timestamp to milliseconds
    var yyyy = d.getFullYear();
    var mm = ('0' + (d.getMonth() + 1)).slice(-2); // Months are zero based. Add leading 0.
    var dd = ('0' + d.getDate()).slice(-2); // Add leading 0.
    var hh = ('0' + d.getHours()).slice(-2);
    var mn = ('0' + d.getMinutes()).slice(-2); // Add leading 0.
    var ss = ('0' + d.getSeconds()).slice(-2);

    // ie: 2013-02-18, 8:35 AM	
    var time = dd + '-' + mm + '-' + yyyy + ' ' + hh + ':' + mn + ':' + ss;

    return time;
}

function convertTimestampToHHMM(timestamp) {
    if (timestamp == 0) {
        return '';
    };

    var d = new Date(timestamp * 1000); // Convert the passed timestamp to milliseconds
    var yyyy = d.getFullYear();
    var mm = ('0' + (d.getMonth() + 1)).slice(-2); // Months are zero based. Add leading 0.
    var dd = ('0' + d.getDate()).slice(-2); // Add leading 0.
    var hh = ('0' + d.getHours()).slice(-2);
    var mn = ('0' + d.getMinutes()).slice(-2); // Add leading 0.
    var ss = ('0' + d.getSeconds()).slice(-2);

    // ie: 2013-02-18, 8:35 AM	
    var time = hh + ':' + mn;

    return time;
}


function convertTimestampToHHMMSS(timestamp) {
    if (!timestamp || timestamp == 0) {
        return '';
    };

    var d = new Date(timestamp * 1000); // Convert the passed timestamp to milliseconds
    var yyyy = d.getFullYear();
    var mm = ('0' + (d.getMonth() + 1)).slice(-2); // Months are zero based. Add leading 0.
    var dd = ('0' + d.getDate()).slice(-2); // Add leading 0.
    var hh = ('0' + d.getHours()).slice(-2);
    var mn = ('0' + d.getMinutes()).slice(-2); // Add leading 0.
    var ss = ('0' + d.getSeconds()).slice(-2);

    // ie: 2013-02-18, 8:35 AM	
    var time = hh + ':' + mn + ':' + ss;

    return time;
}

function secToHHMMSS(sec) {
	if (!sec) return '';
	if (sec == 0) return '00:00:00';
 	var sec_num = parseInt(sec, 10); // don't forget the second param
	var hours   = Math.floor(sec_num / 3600);
    	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    	var seconds = sec_num - (hours * 3600) - (minutes * 60);

    	if (hours   < 10) {hours   = "0" + hours;}
    	if (minutes < 10) {minutes = "0" + minutes;}
    	if (seconds < 10) {seconds = "0" + seconds;}
    	return hours + ':' + minutes + ':' + seconds;
}

function secToHHMM(sec) {
	if (!sec || sec == 0) return '';
 	var sec_num = parseInt(sec, 10); // don't forget the second param
	var hours   = Math.floor(sec_num / 3600);
    	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    	var seconds = sec_num - (hours * 3600) - (minutes * 60);

    	if (hours   < 10) {hours   = "0" + hours;}
    	if (minutes < 10) {minutes = "0" + minutes;}
    	if (seconds < 10) {seconds = "0" + seconds;}
    	return hours+':'+minutes;
}

function getDuration(difference_ms) {
    if (!difference_ms || difference_ms == 0) {
        return '';
    };

    //take out milliseconds
    difference_ms = difference_ms / 1000;

    var seconds = Math.floor(difference_ms % 60);
    if (seconds < 10) {
        seconds = '0' + seconds
    };
    difference_ms = difference_ms / 60;

    var minutes = Math.floor(difference_ms % 60);
    if (minutes < 10) {
        minutes = '0' + minutes
    };

    difference_ms = difference_ms / 60;

    var hours = Math.floor(difference_ms % 24);
    if (hours < 10) {
        hours = '0' + hours
    };

    var days = Math.floor(difference_ms / 24);

    var str = '';

    if (days == 0) {
	return hours + ':' + minutes + ':' + seconds;
    }

    if (days < 10) {
	return days + ' дн., ' + hours + ':' + minutes + ':' + seconds;
    }

    cutDaysOver = 90;	

    if (days >= 10 && days <= cutDaysOver) {
	return days + ' ' + declOfNum(days);
    }

    if (days > cutDaysOver) {
	return '> ' + cutDaysOver + ' дней';
    }
}

function declOfNum(number) {  
    titles = ['день','дня','дней'];
    cases = [2, 0, 1, 1, 1, 2];  
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
}

function strDistance(distance) {
    return L.PolylineUtil.readableDistance(distance, true);
}

function stripHTML(str) {
    return StrippedString = str.replace(/(<([^>]+)>)/ig, "");
}

function pip(point, vs) {
	// ray-casting algorithm based on
	// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

	var x = point[0],
		y = point[1];

	var inside = false;
	for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
		var xi = vs[i][0],
			yi = vs[i][1];
		var xj = vs[j][0],
			yj = vs[j][1];

		var intersect = ((yi > y) != (yj > y)) &&
			(x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) inside = !inside;
	}

	return inside;
}



function showHideDP(id) {
    var x = document.getElementById(id);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function closeParent(div) {
    div.parentNode.parentNode.parentNode.style = 'display:none;';
}

L.Polyline = L.Polyline.include({
    getDistance: function (system) {
        // distance in meters
        var mDistanse = 0,
            length = this._latlngs.length;
        for (var i = 1; i < length; i++) {
            mDistanse += this._latlngs[i].distanceTo(this._latlngs[i - 1]);
        }
        // optional
        if (system === 'imperial') {
            return mDistanse / 1609.34;
        } else {
            return mDistanse / 1000;
        }
    }
});

function getProcent(level, minLev, maxLev){
	level = Number(level);

	if (maxLev && level > maxLev) {
		level = maxLev;
	}

	if (minLev && level < minLev) {
		level = minLev;
	}

       	return ((level - minLev) / (maxLev - minLev) * 100).toFixed(0);
}

function getIndicator5(level, minLev, maxLev, title){
	if (!title) {
		title = level;
	}

	var h = 10;

	var fill = getProcent(level, minLev, maxLev);
	var st = '';

	if (fill < 20) {
		st = 'red';
	} else 

	if (fill <= 50) {
		st = 'yellow';
	} else  

	if (fill > 50) {
		st = 'green';
	}

	var str = '<div title="' + title + ' ('+ fill + '%)" style="display: inline-block; margin-bottom: -1px; background-color: #ccc; width: ' + popupIndicatorWidth + 'px;height: ' + h + 'px; border: 1px solid #bbb">'
		  + '<div style="background-color: ' + st + '; width: ' + fill + '%;height: ' + (h-2) + 'px;"></div>'
		  +'</div>';

	return str;
}

function getIndicatorOnOff(level, minLev, maxLev, titleOn, titleOff){
	var h = 8;

	var fill = getProcent(level, minLev, maxLev);

	var st = '';
	var title = '';

	if (fill < 50) {
		st = '#ccc';
		title = titleOff;
	}

	if (fill >= 50) {
		st = 'green';
		title = titleOn;
	}                                                                                                                                                   //h
	                                                                                                           //popupIndicatorWidth
	var str = '<div title="'+ title +'" style="display: inline-block; margin-bottom: -1px; border-radius: 8px; background-color: ' + st + '; width: ' + 10 + 'px;height: ' + 10 + 'px; border: 1px solid #bbb;"></div>';
	return str;
}

function hmsToSecondsOnly(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}

function intersect(arr1, arr2) {
    var arr3 = [];
    for(i = 0; i < arr1.length; i++) {
        for(j = 0; j < arr2.length; j++) {
            if (arr1[i] == arr2[j]) {
                var is_duplicate = false;
                for (k = 0; k < arr3.length; k++) {
                    if (arr1[i] == arr3[k]) {
                        is_duplicate = true;
                    }    
                }
                if (is_duplicate == false) {
                    arr3.push(arr1[i]);                
                }
            }
        }
    }
    return arr3;
}

	function clearStore (str) {
		var genStore = Ext.getStore(str);
		if (genStore) {
			genStore.suspendEvents();
			genStore.removeAll();
			genStore.sync();
			genStore.resumeEvents();
			genStore.fireEvent('remove');
		} else {
			if (str != 'tab2droppedgrid'){
				var cmp = Ext.getCmp(str);
				var store = cmp.getView().store;
				store.suspendEvents();
				store.removeAll();
				store.sync();
				store.resumeEvents();
				cmp.view.refresh();
			} else {
       				var cmp = Ext.getCmp('tab2droppedgrid');
				var store = cmp.getView().store;
				store.reload();
			}
		}
	}

