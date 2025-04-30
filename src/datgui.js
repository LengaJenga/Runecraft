// Basic dat.GUI framework for UI controls
import * as dat from 'dat.gui';

// Example settings object
export const guiSettings = {
    rotationSpeed: 1,
    rotationEnabled: false,
};

// Initialize dat.GUI and add controls
export function initGUI(resetView) {
    const gui = new dat.GUI();
    gui.close(); // Close the GUI by default
    gui.add(guiSettings, 'rotationSpeed',0,2,0.01).name('Rotation Speed');
    gui.add(guiSettings, 'rotationEnabled').name('Enable Rotation');
    if (resetView) {
        gui.add({
            reset: () => {
                guiSettings.rotationEnabled = false;
                guiSettings.rotationSpeed = 1;
                resetView();
            }
        }, 'reset').name('Reset View');
    }
    return gui;
}
