function initPointCloudScene(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 3);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });

  return { scene, camera, renderer };
}

function loadDepthImageData(imagePath) {
  return new Promise((resolve, reject) => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      imagePath,
      (texture) => {
        const img = texture.image;
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve({ imageData, width: canvas.width, height: canvas.height });
      },
      undefined,
      (err) => {
        reject(err);
      }
    );
  });
}

function createPointCloudGeometry(imageData, width, height) {
  const data = imageData.data;
  const positions = [];
  const colors = [];

  const fx = 525;
  const fy = 525;
  const cx = width / 2;
  const cy = height / 2;
  const maxDepth = 10;

  for (let v = 0; v < height; v++) {
    for (let u = 0; u < width; u++) {
      const index = (v * width + u) * 4;
      const depthIntensity = data[index] / 255; 
      const z = depthIntensity * maxDepth;
      const x = ((u - cx) * z) / fx;
      const y = ((v - cy) * z) / fy;
      positions.push(x, -y, z);
      colors.push(depthIntensity, depthIntensity, depthIntensity);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3)
  );
  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
  return geometry;
}


function init() {
  const canvasIds = ["canvas1", "canvas2"];
  const depthImages = [
    "media/capture/depth/depth_1.png",
    "media/test_only/depth_frame_0006.png"
  ];
  const scenes = [];
  const fixedColors = [0x00ff00, 0xff0000]; 

  canvasIds.forEach((id, index) => {
    const container = document.getElementById(id);
    const sceneObj = initPointCloudScene(container);
    scenes.push(sceneObj);

    loadDepthImageData(depthImages[index])
      .then(({ imageData, width, height }) => {
        const geometry = createPointCloudGeometry(imageData, width, height);
        const material = new THREE.PointsMaterial({
          size: 0.005, 
          color: new THREE.Color(fixedColors[index]),
          vertexColors: false,
        });
        const pointCloud = new THREE.Points(geometry, material);
        sceneObj.scene.add(pointCloud);
        console.log(`Point cloud added to ${id}`);
      })
      .catch((err) => {
        console.error(`Error loading depth image for ${id}:`, err);
      });
  });
}

init();

document.addEventListener("DOMContentLoaded", function () {
  const btnColor = document.getElementById("btnColor");
  const btnDepth = document.getElementById("btnDepth");
  const btnPointCloud = document.getElementById("btnPointCloud");

  const canvas1 = document.getElementById("canvas1");
  const canvas2 = document.getElementById("canvas2");

  const colorImages = {
      canvas1: "media/logos/asulogo.png",
      canvas2: "media/logos/meteorstudiologo.jpeg",
  };

  const depthImages = {
      canvas1: "media/test_only/depth_frame_0006.png",
      canvas2: "media/test_only/depth_frame_0006.png",
  };

  function showOverlay(imageSrc, canvas) {
      let overlay = canvas.querySelector(".overlay");
      if (!overlay) {
          overlay = document.createElement("img");
          overlay.classList.add("overlay");
          canvas.appendChild(overlay);
      }
      overlay.src = imageSrc;
      overlay.style.display = "block";
  }

  function removeOverlay(canvas) {
      const overlay = canvas.querySelector(".overlay");
      if (overlay) {
          overlay.style.display = "none";
      }
  }

  btnColor.addEventListener("click", function () {
      showOverlay(colorImages.canvas1, canvas1);
      showOverlay(colorImages.canvas2, canvas2);

      btnColor.style.display = "none";
      btnDepth.style.display = "none";
      btnPointCloud.style.display = "inline-block";
  });

  btnDepth.addEventListener("click", function () {
      showOverlay(depthImages.canvas1, canvas1);
      showOverlay(depthImages.canvas2, canvas2);

      btnColor.style.display = "none"; 
      btnDepth.style.display = "none"; 
      btnPointCloud.style.display = "inline-block"; 
  });

  btnPointCloud.addEventListener("click", function () {
      removeOverlay(canvas1);
      removeOverlay(canvas2);

      btnPointCloud.style.display = "none";
      btnColor.style.display = "inline-block"; 
      btnDepth.style.display = "inline-block"; 
  });
});
