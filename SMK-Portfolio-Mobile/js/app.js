// SISWA TIDAK PERLU MENGEDIT FILE INI.
// HTML dan CSS mengatur seluruh tampilan; JavaScript hanya menyalakan PWA.
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .catch(error => console.warn('Offline belum aktif. Coba buka ulang saat online.', error));
  });
}
