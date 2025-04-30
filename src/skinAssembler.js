// Complete rewrite: Simple, robust, and always updates the canvas and preview

const PARTS = [
  'Misc', 'Legs', 'Torso', 'Arms', 'Hands', 'Jaw', 'Feet', 'Head'
];
const PART_PATHS = {
  Misc: 'Resources/Textures/Parts/Misc/',
  Legs: 'Resources/Textures/Parts/Legs/',
  Torso: 'Resources/Textures/Parts/Torso/',
  Arms: 'Resources/Textures/Parts/Arms/',
  Hands: 'Resources/Textures/Parts/Hands/',
  Jaw: 'Resources/Textures/Parts/Jaw/',
  Feet: 'Resources/Textures/Parts/Feet/',
  Head: 'Resources/Textures/Parts/Head/',
};
const DEFAULT_PARTS = {
  Misc: 'Base.png',
  Legs: 'legs_TEST.png',
  Torso: 'torso_TEST.png',
  Arms: 'test_ARMS_long.png',
  Hands: 'test_HANDS_bracer.png',
  Jaw: 'test_JAW_clean.png',
  Feet: 'test_SHOES_normal.png',
  Head: 'head_TEST_long.png',
};

export class SkinAssembler {
  constructor(width = 64, height = 64) {
    this.width = width;
    this.height = height;
    this.parts = { ...DEFAULT_PARTS };
    this.availableImages = {};
    this.currentIndices = {};
    for (const part of PARTS) {
      this.availableImages[part] = [];
      this.currentIndices[part] = 0;
    }
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this._imageCache = {};
  }

  setAvailableImages(part, imageList) {
    if (PARTS.includes(part)) {
      this.availableImages[part] = imageList;
      this.currentIndices[part] = 0;
      if (imageList.length > 0) {
        this.parts[part] = imageList[0];
      }
    }
  }

  setPart(part, filename) {
    if (PARTS.includes(part)) {
      this.parts[part] = filename;
      const idx = this.availableImages[part].indexOf(filename);
      if (idx !== -1) this.currentIndices[part] = idx;
    }
  }

  nextImage(part) {
    const images = this.availableImages[part];
    if (images && images.length > 0) {
      this.currentIndices[part] = (this.currentIndices[part] + 1) % images.length;
      this.parts[part] = images[this.currentIndices[part]];
    }
  }

  prevImage(part) {
    const images = this.availableImages[part];
    if (images && images.length > 0) {
      this.currentIndices[part] = (this.currentIndices[part] - 1 + images.length) % images.length;
      this.parts[part] = images[this.currentIndices[part]];
    }
  }

  getCurrentImage(part) {
    return this.parts[part];
  }

  async _loadImage(path) {
    if (this._imageCache[path]) return this._imageCache[path];
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        this._imageCache[path] = img;
        resolve(img);
      };
      img.onerror = reject;
      img.src = path;
    });
  }

  async assembleSkin() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (const part of PARTS) {
      const filename = this.parts[part];
      if (!filename) continue;
      const path = PART_PATHS[part] + filename;
      try {
        const img = await this._loadImage(path);
        this.ctx.drawImage(img, 0, 0, this.width, this.height);
      } catch (e) {
        // Ignore missing images
      }
    }
    // No THREE.js dependency here; just update the canvas
    return this.canvas;
  }
}

/**
 * Converts the assembled skin (canvas or Blob) to an image source (data URL).
 * @param {HTMLCanvasElement|Blob} skinData - The assembled skin as a canvas or Blob.
 * @param {function} callback - Receives the image src (data URL) as argument.
 */
export function getSkinImageSrc(skinData, callback) {
    if (skinData instanceof HTMLCanvasElement) {
        // Canvas: get data URL directly
        const dataUrl = skinData.toDataURL('image/png');
        callback(dataUrl);
    } else if (skinData instanceof Blob) {
        // Blob: use FileReader to get data URL
        const reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result);
        };
        reader.readAsDataURL(skinData);
    } else {
        throw new Error('Unsupported skin data type');
    }
}
