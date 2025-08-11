document.addEventListener('DOMContentLoaded', () => {
    // Handle image loading (unchanged)
    document.querySelectorAll('.img-wrapper img').forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
            img.parentElement.classList.add('loaded-wrapper'); // Hide pulse
            img.parentElement.classList.remove('skeleton'); // Remove skeleton
        });
    });

    // Intersection Observer for lazy revealing of skeletons
    const options = {
        root: null, // Viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Calculate random delay between 500ms and 1000ms
                const delay = Math.random() * (3500 - 1500) + 500;
                setTimeout(() => {
                    entry.target.classList.remove('skeleton');
                    observer.unobserve(entry.target); // Stop observing
                }, delay);
            }
        });
    }, options);

    // Observe all skeleton elements
    document.querySelectorAll('.skeleton').forEach(el => {
        observer.observe(el);
    });
});