// Barebones GUI for cycling between skin parts
import { SkinAssembler } from './skinAssembler.js';
import { updateSkinTextureFromDataUrl } from './modelLoader.js';

const assembler = new SkinAssembler();

// Map of part to available images (from your folder structure)
const PART_IMAGES = {
    Misc: ['Base.png', 'template.png'],
    Legs: ['legs_TEST.png'],
    Torso: ['torso_TEST.png'],
    Arms: ['test_ARMS_long.png', 'test_ARMS_short.png', 'test_ARMS_shorter.png'],
    Hands: ['test_HANDS_bracer.png', 'test_HANDS_nothing.png'],
    Jaw: ['test_JAW_beard.png', 'test_JAW_clean.png'],
    Feet: ['test_SHOES_normal.png', 'test_SHOES_tall.png'],
    Head: ['head_TEST_long.png', 'head_TEST.png'],
};

// Set available images for each part
for (const part in PART_IMAGES) {
    assembler.setAvailableImages(part, PART_IMAGES[part]);
}

// Use a dedicated preview assembler to avoid interfering with the main skin
const previewAssembler = new SkinAssembler(64, 64);
for (const part in PART_IMAGES) {
    previewAssembler.setAvailableImages(part, PART_IMAGES[part]);
    previewAssembler.setPart(part, assembler.getCurrentImage(part));
}

function getMainPreviewImg() {
    return document.getElementById('skinPreview');
}

async function updateMainPreview() {
    await assembler.assembleSkin(); // Always assemble before updating
    const dataUrl = assembler.canvas.toDataURL('image/png');
    const mainPreviewImg = getMainPreviewImg();
    if (mainPreviewImg) {
        mainPreviewImg.src = dataUrl;
    }
    // Update the Three.js model texture as well
    updateSkinTextureFromDataUrl(dataUrl);
}

document.addEventListener('DOMContentLoaded', () => {
    // Create a container for the GUI
    const guiDiv = document.createElement('div');
    guiDiv.style.position = 'fixed';
    guiDiv.style.bottom = '10px';
    guiDiv.style.left = '10px';
    guiDiv.style.top = '';
    guiDiv.style.right = '';
    guiDiv.style.background = 'rgba(0, 0, 0, 0)';
    guiDiv.style.color = 'white';
    guiDiv.style.padding = '4px';
    guiDiv.style.zIndex = 1000;
    guiDiv.style.width = 'min(98vw, 260px)'; // Wider on mobile, max 260px
    guiDiv.style.maxWidth = '260px';
    guiDiv.style.minWidth = '140px';
    guiDiv.style.overflow = 'auto';
    guiDiv.style.fontSize = 'clamp(10px, 1.2vw, 14px)'; // Smaller font size
    guiDiv.style.fontFamily = 'monospace, sans-serif';
    document.body.appendChild(guiDiv);

    // For each part, add prev/next buttons and a label
    for (const part of Object.keys(PART_IMAGES)) {
        const partDiv = document.createElement('div');
        partDiv.style.display = 'flex';
        partDiv.style.alignItems = 'center';
        partDiv.style.flexWrap = 'nowrap';
        partDiv.style.marginBottom = '2px';
        partDiv.style.gap = '2px';
        partDiv.style.justifyContent = 'center';
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '<';
        prevBtn.style.padding = '8px';
        prevBtn.style.minWidth = '0';
        prevBtn.style.height = '22px';
        prevBtn.style.fontSize = '1em';
        prevBtn.style.lineHeight = '1';
        prevBtn.onclick = async () => {
            assembler.prevImage(part);
            await updateMainPreview();
        };
        const label = document.createElement('span');
        label.textContent = part;
        label.style.display = 'inline-block';
        label.style.minWidth = '60px';
        label.style.textAlign = 'center';
        label.style.color = '#ffb94a';
        label.style.fontWeight = 'bold';
        const nextBtn = document.createElement('button');
        nextBtn.textContent = '>';
        nextBtn.style.padding = '0 8px';
        nextBtn.style.minWidth = '0';
        nextBtn.style.height = '22px';
        nextBtn.style.fontSize = '1em';
        nextBtn.style.lineHeight = '1';
        nextBtn.onclick = async () => {
            assembler.nextImage(part);
            await updateMainPreview();
        };
        partDiv.appendChild(prevBtn);
        partDiv.appendChild(label);
        partDiv.appendChild(nextBtn);
        guiDiv.appendChild(partDiv);
    }

    // On script load, update preview
    (async () => {
        await updateMainPreview();
    })();
});
