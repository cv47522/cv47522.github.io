const modelParams = {
  flipHorizontal: false,   // flip e.g for video
  imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
  maxNumBoxes: 1,        // maximum number of boxes to detect
  iouThreshold: 0.5,      // ioU threshold for non-max suppression
  scoreThreshold: 0.79,    // confidence threshold for predictions.
}

navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

//Select everything in my html
const video = document.querySelector('#video');
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
let model;

handTrack.startVideo(video)
	.then(status => {
		if(status){
			navigator.getUserMedia({video: {}}, stream => {
				video.srcObject = stream;
				setInterval(runDetection, 100);
			},
			err => console.log(err)
			);
		}
	});
/************* */
var gateway = `ws://${window.location.hostname}/ws`;
var websocket;
function initWebSocket() {
  console.log('Trying to open a WebSocket connection...');
  websocket = new WebSocket(gateway);
  websocket.onopen    = onOpen;
  websocket.onclose   = onClose;
  websocket.onmessage = onMessage; // <-- add this line
}
function onOpen(event) {
  console.log('Connection opened');
}

function onClose(event) {
  console.log('Connection closed');
  setTimeout(initWebSocket, 2000);
}
function onMessage(event) {
  var state;
  if (event.data == "1"){
	state = "ON";
  }
  else{
	state = "OFF";
  }
  document.getElementById('state').innerHTML = state;
}

window.addEventListener('load', onLoad);

function onLoad(event) {
  initWebSocket();
  initButton();
}

function initButton() {
  document.getElementById('button').addEventListener('click', toggle);
}

function toggle(){
  websocket.send('toggle');
}

/************ */
	function runDetection(){
		model.detect(video).then(predictions => {
			console.log(predictions);
			model.renderPredictions(predictions, canvas, context, video);
			if(predictions.length > 0){
				let hand1 = predictions[0].bbox;
				let x = hand1[0];
				let y = hand1[1];
				console.log(x);
				console.log(y);
				/*if(y > 0){
					if (x < 200){
						document.getElementsByTagName("h3")[0].style.opacity = "0%";
					} else if(x > 400){
							document.getElementsByTagName("h3")[0].style.opacity = "100%";
						} else if(x > 300){
								document.getElementsByTagName("h3")[0].style.opacity = "60%";
							} else if(x > 200){
									document.getElementsByTagName("h3")[0].style.opacity = "30%";
								}
				}*/
				if(x >= 200 && x <= 300){
					if(y >= 100 && y <= 200){
						document.getElementsByTagName("h3")[0].style.opacity = "100%";
						console.log("in area");
					} else {
						document.getElementsByTagName("h3")[0].style.opacity = "0%";
					} 
				} else {
						document.getElementsByTagName("h3")[0].style.opacity = "0%";
					}
			}
		});
	}

handTrack.load(modelParams).then(lmodel => {
	model = lmodel;
	});