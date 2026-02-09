// ============================================================
// TouchControls — On-screen controls for mobile/tablet devices
// ============================================================

const IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

/**
 * Creates game-play touch controls: virtual joystick + action buttons.
 * Returns an object with { vx, vy, beam, shoot, shield, shieldJustPressed }
 * that can be polled each frame.
 */
export function createGameTouchControls(scene) {
  if (!IS_TOUCH) return null;

  const state = { vx: 0, vy: 0, beam: false, shoot: false, shield: false, shieldJustPressed: false };
  const cam = scene.cameras.main;

  // --- Virtual Joystick (left side) ---
  const joyBase = scene.add.circle(100, 480, 50, 0xffffff, 0.12)
    .setScrollFactor(0).setDepth(1000);
  const joyKnob = scene.add.circle(100, 480, 24, 0x00ff88, 0.35)
    .setScrollFactor(0).setDepth(1001);
  const joyRadius = 45;
  let joyPointerId = null;

  // --- Action Buttons (right side) ---
  const btnSize = 34;
  const btnSpacing = 78;
  const btnBaseX = 700;
  const btnBaseY = 480;

  const beamBtn = createButton(scene, btnBaseX - btnSpacing, btnBaseY, btnSize, 0x00ff88, 'BEAM', 1002);
  const shootBtn = createButton(scene, btnBaseX, btnBaseY, btnSize, 0xff6644, 'FIRE', 1002);
  const shieldBtn = createButton(scene, btnBaseX + btnSpacing, btnBaseY, btnSize, 0x4488ff, 'DEF', 1002);

  let beamPointerId = null;
  let shootPointerId = null;
  let shieldPointerId = null;
  let shieldWasDown = false;

  // --- Pointer handling ---
  scene.input.on('pointerdown', (pointer) => {
    const px = pointer.x;
    const py = pointer.y;

    // Check joystick area (left 40% of screen)
    if (px < cam.width * 0.4 && joyPointerId === null) {
      joyPointerId = pointer.id;
      updateJoystick(pointer);
      return;
    }

    // Check buttons
    if (hitButton(pointer, beamBtn)) { beamPointerId = pointer.id; state.beam = true; beamBtn.bg.setAlpha(0.5); return; }
    if (hitButton(pointer, shootBtn)) { shootPointerId = pointer.id; state.shoot = true; shootBtn.bg.setAlpha(0.5); return; }
    if (hitButton(pointer, shieldBtn)) { shieldPointerId = pointer.id; state.shield = true; shieldBtn.bg.setAlpha(0.5); return; }
  });

  scene.input.on('pointermove', (pointer) => {
    if (pointer.id === joyPointerId) {
      updateJoystick(pointer);
    }
  });

  scene.input.on('pointerup', (pointer) => {
    if (pointer.id === joyPointerId) {
      joyPointerId = null;
      joyKnob.setPosition(joyBase.x, joyBase.y);
      state.vx = 0;
      state.vy = 0;
    }
    if (pointer.id === beamPointerId) { beamPointerId = null; state.beam = false; beamBtn.bg.setAlpha(0.25); }
    if (pointer.id === shootPointerId) { shootPointerId = null; state.shoot = false; shootBtn.bg.setAlpha(0.25); }
    if (pointer.id === shieldPointerId) { shieldPointerId = null; state.shield = false; shieldBtn.bg.setAlpha(0.25); }
  });

  function updateJoystick(pointer) {
    const dx = pointer.x - joyBase.x;
    const dy = pointer.y - joyBase.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clamped = Math.min(dist, joyRadius);
    const angle = Math.atan2(dy, dx);
    joyKnob.setPosition(
      joyBase.x + Math.cos(angle) * clamped,
      joyBase.y + Math.sin(angle) * clamped
    );
    const norm = clamped / joyRadius;
    state.vx = Math.cos(angle) * norm;
    state.vy = Math.sin(angle) * norm;
    // Dead zone
    if (norm < 0.15) { state.vx = 0; state.vy = 0; }
  }

  function hitButton(pointer, btn) {
    const dx = pointer.x - btn.bg.x;
    const dy = pointer.y - btn.bg.y;
    return Math.sqrt(dx * dx + dy * dy) < btn.radius + 15;
  }

  // Track shield just-pressed per frame
  state.updateShieldJustPressed = () => {
    state.shieldJustPressed = state.shield && !shieldWasDown;
    shieldWasDown = state.shield;
  };

  return state;
}

function createButton(scene, x, y, radius, color, label, depth) {
  const bg = scene.add.circle(x, y, radius, color, 0.25)
    .setScrollFactor(0).setDepth(depth)
    .setStrokeStyle(2, color, 0.6);
  scene.add.text(x, y, label, {
    fontFamily: 'monospace', fontSize: '10px', color: '#ffffff', fontStyle: 'bold'
  }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1);
  return { bg, radius };
}

/**
 * Adds simple tap-to-act touch support to a menu scene.
 * items: [{ x, y, width, height, action: () => void }]
 */
export function addMenuTouch(scene, items) {
  if (!IS_TOUCH) return;

  scene.input.on('pointerup', (pointer) => {
    for (const item of items) {
      const hw = item.width / 2;
      const hh = item.height / 2;
      if (pointer.x >= item.x - hw && pointer.x <= item.x + hw &&
          pointer.y >= item.y - hh && pointer.y <= item.y + hh) {
        item.action();
        break;
      }
    }
  });
}

/**
 * Adds a simple touch "tap anywhere" handler.
 */
export function addTapAnywhere(scene, action) {
  if (!IS_TOUCH) return;
  scene.input.once('pointerup', action);
}

/**
 * Adds left/right swipe support + tap to confirm for PlanetSelectScene style navigation.
 */
export function addSwipeNav(scene, { onLeft, onRight, onTap }) {
  if (!IS_TOUCH) return;

  let startX = 0;
  let startY = 0;
  const SWIPE_THRESHOLD = 40;

  scene.input.on('pointerdown', (pointer) => {
    startX = pointer.x;
    startY = pointer.y;
  });

  scene.input.on('pointerup', (pointer) => {
    const dx = pointer.x - startX;
    const dy = pointer.y - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > SWIPE_THRESHOLD) {
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) onLeft();
        else onRight();
      }
    } else {
      if (onTap) onTap(pointer);
    }
  });
}

/**
 * Adds up/down swipe + tap for vertical menu navigation.
 */
export function addVerticalSwipeNav(scene, { onUp, onDown, onTap }) {
  if (!IS_TOUCH) return;

  let startX = 0;
  let startY = 0;
  const SWIPE_THRESHOLD = 40;

  scene.input.on('pointerdown', (pointer) => {
    startX = pointer.x;
    startY = pointer.y;
  });

  scene.input.on('pointerup', (pointer) => {
    const dx = pointer.x - startX;
    const dy = pointer.y - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > SWIPE_THRESHOLD) {
      if (Math.abs(dy) > Math.abs(dx)) {
        if (dy < 0) onUp();
        else onDown();
      }
    } else {
      if (onTap) onTap(pointer);
    }
  });
}

export { IS_TOUCH };
