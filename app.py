import cv2
import numpy as np
import open3d as o3d
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def create_point_cloud_from_depth(depth_path):
    depth = o3d.io.read_image(depth_path)

    intrinsic = o3d.camera.PinholeCameraIntrinsic(
        o3d.camera.PinholeCameraIntrinsicParameters.PrimeSenseDefault
    )

    extrinsic = np.array([
        [1,  0, 0, 0],
        [0, -1, 0, 0],
        [0,  0, 1, 0],
        [0,  0, 0, 1]
    ])

    pcd = o3d.geometry.PointCloud.create_from_depth_image(
        depth,
        intrinsic,
        extrinsic=extrinsic,
        depth_scale=1000.0,
        depth_trunc=1000.0,
        stride=1
    )
    return pcd

@app.route('/pointcloud1', methods=['GET'])
def get_pointcloud1():
    frame = request.args.get('frame', default='1')
    depth_path = os.path.join("media/capture/depth", f"depth_{frame}.png")

    if not os.path.exists(depth_path):
        return jsonify({"error": f"Depth image not found: {depth_path}"}), 404

    try:
        pcd = create_point_cloud_from_depth(depth_path)
        points = np.asarray(pcd.points).tolist()
        colors = np.asarray(pcd.colors).tolist()
        return jsonify({"points": points, "colors": colors})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/pointcloud2', methods=['GET'])
def get_pointcloud2():
    frame = request.args.get('frame', default='1')
    depth_path = os.path.join("media/capture/depth", f"depth_{frame}.png")

    if not os.path.exists(depth_path):
        return jsonify({"error": f"Depth image not found: {depth_path}"}), 404

    try:
        pcd = create_point_cloud_from_depth(depth_path)
        points = np.asarray(pcd.points).tolist()
        colors = np.asarray(pcd.colors).tolist()
        return jsonify({"points": points, "colors": colors})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
