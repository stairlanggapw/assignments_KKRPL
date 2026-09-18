let setBoostActive = null

export function setShootingBoost(active) {
  if (typeof setBoostActive === "function") setBoostActive(active)
}

export function registerShootingBoostSetter(fn) {
  setBoostActive = fn
}

export function clearShootingBoostSetter() {
  setBoostActive = null
}
