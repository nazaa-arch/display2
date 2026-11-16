// Mematikan klik kanan, inspect, view-source, save dan drag gambar (penghalang ringan).
(function () {
  var stop = function (e) { e.preventDefault(); e.stopPropagation(); return false; };
  document.addEventListener('contextmenu', stop, true);
  document.addEventListener('dragstart', function (e) { if (e.target && e.target.tagName === 'IMG') stop(e); }, true);
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    var mod = e.ctrlKey || e.metaKey;
    if (k === 'f12' ||
        (mod && e.shiftKey && (k === 'i' || k === 'j' || k === 'c' || k === 'k')) ||
        (e.metaKey && e.altKey && (k === 'i' || k === 'j' || k === 'c' || k === 'u')) ||
        (mod && (k === 'u' || k === 's'))) {
      return stop(e);
    }
  }, true);
})();
