document.querySelectorAll('.img-wrapper img').forEach(img => {
    img.addEventListener('load', () => {
        img.classList.add('loaded');
        img.parentElement.classList.add('loaded-wrapper'); // new class to hide pulse
    });
});
