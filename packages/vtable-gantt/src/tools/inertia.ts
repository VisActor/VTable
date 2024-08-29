export class Inertia {
  friction: number;
  lastTime: number;
  speedX: number;
  speedY: number;
  runingId: number;
  stopped: boolean;
  scrollHandle: (dx: number, dy: number) => void;
  constructor() {
    //
  }
  setScrollHandle(scrollHandle: (dx: number, dy: number) => void) {
    this.scrollHandle = scrollHandle;
  }

  startInertia(speedX: number, speedY: number, friction: number) {
    this.stopped = false;
    this.lastTime = Date.now();
    this.speedX = speedX;
    this.speedY = speedY;
    this.friction = friction;
    if (!this.runingId) {
      this.runingId = requestAnimationFrame(this.inertia.bind(this));
    }
  }
  inertia() {
    if (this.stopped) {
      return;
    }
    const now = Date.now();
    const dffTime = now - this.lastTime;
    let stopped = true;
    const f = Math.pow(this.friction, dffTime / 16);
    const newSpeedX = f * this.speedX;
    const newSpeedY = f * this.speedY;
    let dx = 0;
    let dy = 0;
    if (Math.abs(newSpeedX) > 0.05) {
      stopped = false;
      dx = ((this.speedX + newSpeedX) / 2) * dffTime;
    }
    if (Math.abs(newSpeedY) > 0.05) {
      stopped = false;
      dy = ((this.speedY + newSpeedY) / 2) * dffTime;
    }
    this.scrollHandle?.(dx, dy);
    if (stopped) {
      this.runingId = null;
      return;
    }
    this.lastTime = now;
    this.speedX = newSpeedX;
    this.speedY = newSpeedY;

    this.runingId = requestAnimationFrame(this.inertia.bind(this));
  }
  endInertia() {
    cancelAnimationFrame(this.runingId);
    this.runingId = null;
    this.stopped = true;
  }
  isInertiaScrolling() {
    return !!this.runingId;
  }
}
