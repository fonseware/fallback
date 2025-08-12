document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for skeleton elements (unchanged from previous)
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = Math.random() * (3500 - 1500) + 500;
                setTimeout(() => {
                    entry.target.classList.remove('skeleton');
                    observer.unobserve(entry.target);
                }, delay);
            }
        });
    }, options);

    document.querySelectorAll('.skeleton').forEach(el => {
        observer.observe(el);
    });

    // Handle image loading
    document.querySelectorAll('.img-wrapper img').forEach(img => {
        // Check if image is already loaded (e.g., from cache)
        if (img.complete && img.naturalWidth !== 0) {
            img.classList.add('loaded');
            img.parentElement.classList.add('loaded-wrapper');
            img.parentElement.classList.remove('skeleton');
        } else {
            // Attach load event for non-cached images
            img.addEventListener('load', () => {
                img.classList.add('loaded');
                img.parentElement.classList.add('loaded-wrapper');
                img.parentElement.classList.remove('skeleton');
            });
            // Fallback: force reveal after 5 seconds if load event fails
            setTimeout(() => {
                if (!img.classList.contains('loaded')) {
                    img.classList.add('loaded');
                    img.parentElement.classList.add('loaded-wrapper');
                    img.parentElement.classList.remove('skeleton');
                }
            }, 10000);
        }
    });
});