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
    guiDiv.style.bottom = '10px';      // Move to bottom
    guiDiv.style.left = '10px';        // Move to left
    guiDiv.style.top = '';             // Unset top
    guiDiv.style.right = '';           // Unset right
    guiDiv.style.background = 'rgba(0,0,0,0.7)';
    guiDiv.style.color = 'white';
    guiDiv.style.padding = '10px';
    guiDiv.style.zIndex = 1000;
    guiDiv.style.width = '28vw';        // Responsive width
    guiDiv.style.maxWidth = '340px';    // Never exceed 340px
    guiDiv.style.minWidth = '180px';    // Minimum width for usability
    guiDiv.style.overflow = 'auto';     // Scroll if content overflows
    document.body.appendChild(guiDiv);

    // For each part, add prev/next buttons and a label
    for (const part of Object.keys(PART_IMAGES)) {
        const partDiv = document.createElement('div');
        partDiv.style.marginBottom = '6px';
        const label = document.createElement('span');
        label.textContent = part + ': ';
        const name = document.createElement('span');
        name.textContent = assembler.getCurrentImage(part) || '';
        name.style.margin = '0 8px';
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '<';
        prevBtn.onclick = async () => {
            assembler.prevImage(part);
            name.textContent = assembler.getCurrentImage(part) || '';
            await updateMainPreview();
        };
        const nextBtn = document.createElement('button');
        nextBtn.textContent = '>';
        nextBtn.onclick = async () => {
            assembler.nextImage(part);
            name.textContent = assembler.getCurrentImage(part) || '';
            await updateMainPreview();
        };
        partDiv.appendChild(label);
        partDiv.appendChild(prevBtn);
        partDiv.appendChild(name);
        partDiv.appendChild(nextBtn);
        guiDiv.appendChild(partDiv);
    }

    // On script load, update preview
    (async () => {
        await updateMainPreview();
    })();
});
