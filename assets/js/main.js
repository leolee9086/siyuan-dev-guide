document.addEventListener('DOMContentLoaded', function() {
    const loadHTML = (selector, url) => {
        const element = document.querySelector(selector);
        if (element) {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    element.innerHTML = data;
                    // Special handling for footer script if loaded this way
                    if (selector === '#main-footer-placeholder') {
                        const scriptTag = element.querySelector('script');
                        if (scriptTag) {
                            const newScript = document.createElement('script');
                            newScript.textContent = scriptTag.textContent;
                            document.body.appendChild(newScript); // Append to body to execute
                            // scriptTag.remove(); // Optional: remove the original script tag from placeholder
                        }
                    }
                })
                .catch(error => {
                    console.error(`Could not load HTML from ${url}:`, error);
                    element.innerHTML = `<p>Error loading content from ${url}.</p>`;
                });
        }
    };

    // Determine the base path for includes based on current page depth
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    // Adjust depth calculation based on how the files are served (e.g., file:// vs http://)
    // Assuming a simple structure where files are 1 level deep (like /development/plugin.html)
    // or at the root (like /index.html)
    let basePath = '';
    // This logic might need refinement based on actual structure and server setup
    // A simple check: if the path includes '/development/' or '/customization/' etc.
    if (window.location.pathname.includes('/development/') || window.location.pathname.includes('/customization/')) {
        basePath = '../';
    }

    loadHTML('#main-nav-placeholder', `${basePath}_includes/nav.html`);
    loadHTML('#main-footer-placeholder', `${basePath}_includes/footer.html`);
}); 