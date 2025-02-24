from flask import Flask, jsonify, request
from flask_cors import CORS
import open3d as o3d
import numpy as np

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

@app.route('/api/pointcloud', methods=['GET'])
def get_pointcloud():
    # Use the query parameter "img" (default to depth_1.png if not provided)
    depth_image_path = request.args.get('img', 'media/capture/depth/depth_1.png')
    
    try:
        depth = o3d.io.read_image(depth_image_path)
    except Exception as e:
        return jsonify({'error': f"Error reading image: {e}"}), 500

    # Define camera intrinsics. Adjust these values if needed.
    width = 1280
    height = 1296
    fx = 525.0
    fy = 525.0
    cx = width / 2.0
    cy = height / 2.0
    intrinsic = o3d.camera.PinholeCameraIntrinsic(width, height, fx, fy, cx, cy)
    
    # Create the point cloud from the depth image.
    pcd = o3d.geometry.PointCloud.create_from_depth_image(
        depth,
        intrinsic,
        depth_scale=1000.0,
        depth_trunc=10.0,
        stride=1
    )
    
    # Flip orientation to be upright.
    pcd.transform([[1, 0, 0, 0],
                   [0, -1, 0, 0],
                   [0, 0, -1, 0],
                   [0, 0, 0, 1]])
    
    points = np.asarray(pcd.points).tolist()
    print(f"Image: {depth_image_path} produced {len(points)} points")  # Debug log
    return jsonify({'points': points})

if __name__ == '__main__':
    app.run(debug=True)
