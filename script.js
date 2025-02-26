import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const imagePaths = {
    canvas1: {
        msb: "media/msblsb/msb.png",
        lsb: "media/msblsb/lsb.png"
    },
    canvas2: {
        msb: "media/msblsb/msb.png",
        lsb: "media/msblsb/lsb.png"
    }
};

const fx = 504.135, fy = 504.129;
const cx = 324.466, cy = 327.652;
const depthScale = 1 / 1000; 

function createScene(canvasId) {
    const container = document.getElementById(canvasId);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 0.1;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 1.5;
    controls.zoomSpeed = 2.0;
    controls.panSpeed = 1.2;
    controls.enablePan = true;
    controls.minDistance = 0.05;
    controls.maxDistance = 2000;

    controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN 
    };

    controls.touchRotateSpeed = 2.0;
    controls.touchZoomSpeed = 2.0;
    controls.touchPanSpeed = 1.5;  

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

const scenes = {
    canvas1: createScene("canvas1"),
    canvas2: createScene("canvas2")
};

function loadImage(imagePath) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imagePath;
    });
}

async function loadPointCloud(canvasId) {
    const { msb, lsb } = imagePaths[canvasId];

    try {
        const [msbImg, lsbImg] = await Promise.all([loadImage(msb), loadImage(lsb)]);

        const width = msbImg.width;
        const height = msbImg.height;

        const canvasMSB = document.createElement("canvas");
        canvasMSB.width = width;
        canvasMSB.height = height;
        const ctxMSB = canvasMSB.getContext("2d");
        ctxMSB.drawImage(msbImg, 0, 0, width, height);
        const msbData = ctxMSB.getImageData(0, 0, width, height).data;

        const canvasLSB = document.createElement("canvas");
        canvasLSB.width = width;
        canvasLSB.height = height;
        const ctxLSB = canvasLSB.getContext("2d");
        ctxLSB.drawImage(lsbImg, 0, 0, width, height);
        const lsbData = ctxLSB.getImageData(0, 0, width, height).data;

        const points = [];
        for (let v = 0; v < height; v++) {
            for (let u = 0; u < width; u++) {
                const idx = (v * width + u) * 4;
                const msb = msbData[idx];
                const lsb = lsbData[idx]; 
                const depthValue = msb * 256 + lsb;
                const z = depthValue * depthScale;
                if (z > 0) {
                    const x = ((u - cx) * z) / fx;
                    const y = -((v - cy) * z) / fy;
                    points.push(x, y, z);
                }
            }
        }

        const pointsArray = new Float32Array(points);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(pointsArray, 3));

        const material = new THREE.PointsMaterial({
            color: canvasId === "canvas1" ? 0x8C1D40 : 0xFFC627, 
            size: 0.0005
        });

        const pointCloud = new THREE.Points(geometry, material);
        pointCloud.scale.z = -1;
        scenes[canvasId].scene.add(pointCloud);
    } catch (err) {
        console.error(`Error loading images for ${canvasId}:`, err);
    }
}

loadPointCloud("canvas1");
loadPointCloud("canvas2");