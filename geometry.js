function calcOffset(outer, inner) {
	return (outer - inner) / 2;
}

function sqr(x) {
	return x * x;
}

function sqrt(x) {
	return x ** 0.5;
}

function getDistance(x1, y1, x2, y2) {
	return sqrt(sqr(x2 - x1) + sqr(y2 - y1));
}

module.exports = {
	calcOffset,
	getDistance,
}