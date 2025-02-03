document.addEventListener('DOMContentLoaded', () => {
  const gridLines = document.querySelector('.grid-lines');
  const landmarks = document.querySelector('.landmarks');
  
  // Generate grid pattern
  const gridSize = 10;
  const cellSize = 200 / gridSize;
  
  // Create horizontal and vertical grid lines
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
  
  // Generate random landmark points
  const numLandmarks = 68; // Typical number of facial landmarks
  for (let i = 0; i < numLandmarks; i++) {
    const angle = (i / numLandmarks) * Math.PI * 2;
    const radius = 60 + Math.random() * 20;
    const x = 100 + Math.cos(angle) * radius;
    const y = 100 + Math.sin(angle) * radius;
    
    const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    point.setAttribute('cx', x);
    point.setAttribute('cy', y);
    landmarks.appendChild(point);
  }
  
  // Animate landmarks
  function animateLandmarks() {
    const points = landmarks.querySelectorAll('circle');
    points.forEach(point => {
      const originalX = parseFloat(point.getAttribute('cx'));
      const originalY = parseFloat(point.getAttribute('cy'));
      
      setInterval(() => {
        const offsetX = (Math.random() - 0.5) * 2;
        const offsetY = (Math.random() - 0.5) * 2;
        point.setAttribute('cx', originalX + offsetX);
        point.setAttribute('cy', originalY + offsetY);
      }, 100);
    });
  }
  
  animateLandmarks();
});