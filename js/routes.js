var finishMarker = null;

var isFirefox = navigator.userAgent.match('Firefox');
//if (isFirefox) {
	var routeServerUrl = 'http://10.10.1.10:5000/route/v1';
//} else {
//	var routeServerUrl = 'http://10.10.1.2:5000/route/v1';
//}
//var routeServerUrl = './api/db/routeproxy/route/v1';

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
