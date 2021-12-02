
 
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

let x =[];
let y = [0];
let z = '???'

for(let i = 1; i <= 100; i++){
 let b = i;
  x.push(b)
}

let itemFromArray = function(ele){
  return ele[Math.floor(Math.random()*ele.length)]
}
z =itemFromArray(x)
let a = itemFromArray(x)
x.unshift(a)
let c = itemFromArray(x)

// Draw face landmarks
let videoDiv = document.querySelector('.videoDiv')
function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
    {color: '#56e4ff', lineWidth: 2});
  
    
  // lucky number section
  if((results.poseLandmarks?.[20]?.x < 0.3) && results.poseLandmarks?.[20]?.y < 0.3){
     
      document.querySelector('.sect1').style.visibility ='hidden'
      document.querySelector('.ruollette').style.visibility ='visible'
      // ruollette move 5 seconds
      setTimeout(() => {
        document.getElementById('lucky').innerHTML = z
        document.querySelector('.sect1').style.visibility ='visible'
        document.querySelector('.ruollette').style.visibility ='hidden'
      }, 5000);
    }

    // change background section
  if(results.poseLandmarks?.[19]?.x > 0.7 && results.poseLandmarks?.[19]?.y>0.8 ){
      document.body.style.backgroundImage = "url('img"+y[0]+".jpeg')";
     }else {
            y.unshift (Math.floor((Math.random() * 4) + 1))
          }
          // video section
  if(results.poseLandmarks?.[19]?.x > 0.7 && results.poseLandmarks?.[19]?.y < 0.2){
    
    document.querySelector('.playVid').style.visibility ='hidden'
    document.querySelector('.background').style.visibility ='hidden'
    videoDiv.style.visibility= 'visible'
    videoDiv.setAttribute('autoplay','')
    videoDiv.style.width = '400px'
    videoDiv.style.height = '300px'
    videoDiv.load()
    videoDiv.addEventListener('ended',function(){
      videoDiv.style.visibility= 'hidden'
      document.querySelector('.playVid').style.visibility ='visible'
      document.querySelector('.background').style.visibility ='visible'
    })
    console.log(videoDiv)
   }
   
   if(results.poseLandmarks?.[19]?.x <0.2 ){
     videoDiv.pause()
   }

   if(results.poseLandmarks?.[20]?.x >0.7 ){
    videoDiv.play()
    
  }
  // draw stickfigure 
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
      {color: '#56e4ff', lineWidth: 4});
  drawLandmarks(canvasCtx, results.poseLandmarks,
      {color: '#3364ff', lineWidth: 2});
  drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
      {color: '#56e4ff', lineWidth: 5});
  drawLandmarks(canvasCtx, results.leftHandLandmarks,
      {color: '#3364ff', lineWidth: 2});
  drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
      {color: '#56e4ff', lineWidth: 5});
  drawLandmarks(canvasCtx, results.rightHandLandmarks,
      {color: '#3364ff', lineWidth: 2});
  canvasCtx.restore();
}


const holistic = new Holistic({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
  }});

  // set option
holistic.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
holistic.onResults(onResults);
// Input camera
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await holistic.send({image: videoElement});
  },
  width: 100,
  height: 100
});
camera.start();

