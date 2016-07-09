/**
 * @param {number} x
 * @returns {number}
 */
export function toRadians(x) {
    return x * Math.PI / 180;
}

/**
 * @param {{lat: number, lon: number}} p1
 * @param {{lat: number, lon: number}} p2
 * @returns {number} of metres
 */
export function getDistance(p1, p2) {
    const from = {
        lat: toRadians(p1.lat),
        lon: toRadians(p1.lon)
    };
    const to = {
        lat: toRadians(p2.lat),
        lon: toRadians(p2.lon)
    };
    const R = 6378137;
    const dLat = to.lat - from.lat;
    const dLong = to.lon - from.lon;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(from.lat) * Math.cos(to.lat) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
