document.addEventListener('DOMContentLoaded', async () => {
  const video = document.getElementById('video');
  const canvas = document.getElementById('overlay');
  const landmarks = document.querySelector('.landmarks');
  const gridLines = document.querySelector('.grid-lines');
  const statusElement = document.getElementById('status');
  
  // Update status
  const updateStatus = (message) => {
    statusElement.textContent = message;
  };

  try {
    updateStatus('Loading face detection models...');
    // Load face-api models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/weights'),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/weights')
    ]);
    updateStatus('Models loaded successfully');
  } catch (err) {
    console.error('Error loading models:', err);
    updateStatus('Error loading face detection models. Please check your connection and reload.');
    return;
  }

  // Access webcam with error handling
  try {
    updateStatus('Requesting camera access...');
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });
    video.srcObject = stream;
    updateStatus('Camera connected');
  } catch (err) {
    console.error('Error accessing camera:', err);
    updateStatus(`Camera access error: ${err.message}`);
    return;
  }

  // Set up canvas
  video.addEventListener('play', () => {
    const displaySize = { width: video.clientWidth, height: video.clientHeight };
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;
    
    // Generate grid pattern
    generateGrid();
    
    // Start face detection
    detectFace();
    updateStatus('Face tracking active');
  });

  function generateGrid() {
    const gridSize = 10;
    const cellSize = 200 / gridSize;
    
    for (let i = 0; i <= gridSize; i++) {
      const y = i * cellSize;
      const horizontalPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      horizontalPath.setAttribute('d', `M0 ${y} H200`);
      gridLines.appendChild(horizontalPath);
      
      const x = i * cellSize;
      const verticalPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      verticalPath.setAttribute('d', `M${x} 0 V200`);
      gridLines.appendChild(verticalPath);
    }
  }

  async function detectFace() {
    try {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(true);

      if (detection) {
        const displaySize = { width: video.clientWidth, height: video.clientHeight };
        const resizedDetection = faceapi.resizeResults(detection, displaySize);
        
        // Clear previous landmarks
        landmarks.innerHTML = '';
        
        // Draw new landmarks
        resizedDetection.landmarks.positions.forEach(point => {
          const scaledX = (point.x / displaySize.width) * 200;
          const scaledY = (point.y / displaySize.height) * 200;
          
          const landmark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          landmark.setAttribute('cx', scaledX);
          landmark.setAttribute('cy', scaledY);
          landmarks.appendChild(landmark);
        });
      }
    } catch (err) {
      console.error('Face detection error:', err);
      updateStatus('Face detection error - retrying...');
    }

    requestAnimationFrame(detectFace);
  }
});