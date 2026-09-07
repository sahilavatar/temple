import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ModelLoader {
  private static loader = new GLTFLoader();

  /**
   * Attempts to load a GLTF/GLB model from URL or local path
   */
  public static async loadModel(url: string): Promise<THREE.Group | null> {
    return new Promise((resolve) => {
      this.loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          // Enable shadows and proper materials
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          resolve(model);
        },
        undefined,
        (err) => {
          // Model not found or error loading, fall back silently
          console.info(`Custom 3D model not found at ${url}, using procedural idol.`, err);
          resolve(null);
        }
      );
    });
  }

  /**
   * Loads a model from an uploaded File or Blob
   */
  public static async loadFromFile(file: File): Promise<THREE.Group | null> {
    const objectUrl = URL.createObjectURL(file);
    try {
      const model = await this.loadModel(objectUrl);
      return model;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }
}
