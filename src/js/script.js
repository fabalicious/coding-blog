// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Prism.js for syntax highlighting if available
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const html = document.documentElement;
    
    // Set initial theme
    const setTheme = (isDark) => {
        html.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    // Initialize theme
    const storedTheme = localStorage.getItem('theme');
    const initialDark = storedTheme === 'dark' || (!storedTheme && prefersDarkScheme.matches);
    setTheme(initialDark);
    
    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = html.getAttribute('data-theme') !== 'dark';
            setTheme(isDark);
        });
    }
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });

    // Page transition functionality
    document.addEventListener('click', async function(e) {
        // Only handle clicks on navigation links
        const link = e.target.closest('a');
        if (!link || link.closest('header') === null) return;

        // Don't handle external links or hash links
        if (
            link.hostname !== window.location.hostname ||
            link.getAttribute('href').startsWith('#') ||
            link.getAttribute('target') === '_blank'
        ) return;

        e.preventDefault();
        const targetUrl = link.href;

        try {
            // Fetch the new page content
            const response = await fetch(targetUrl);
            const text = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(text, 'text/html');
            
            // Get the new main content
            const newMain = newDoc.querySelector('main');
            const currentMain = document.querySelector('main');
            
            // Add fade-out class to current content
            currentMain.classList.add('fade-out');
            
            // After fade out, update content and URL
            setTimeout(() => {
                currentMain.innerHTML = newMain.innerHTML;
                currentMain.classList.remove('fade-out');
                history.pushState({}, '', targetUrl);
                
                // Reinitialize any necessary scripts
                if (typeof Prism !== 'undefined') {
                    Prism.highlightAll();
                }
                
                // Reinitialize search and filters if they exist
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.addEventListener('input', filterItems);
                }
                collectUniqueTags();
                generateTagFilters();
            }, 200);
            
        } catch (error) {
            console.error('Error during page transition:', error);
            window.location.href = targetUrl; // Fallback to normal navigation
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(e) {
        window.location.reload();
    });

    // Search and filter functionality
    const searchInput = document.getElementById('search-input');
    const filterTagsContainer = document.querySelector('.filter-tags');
    let activeTag = 'all';

    // Get the appropriate container based on the current page
    const articlesContainer = document.getElementById('articles-container');
    const howToContainer = document.getElementById('how-to-container');
    const isHowToPage = window.location.pathname.includes('how-to');
    
    // Function to collect all unique tags from the page
    function collectUniqueTags() {
        const tags = new Set(['all']); // Always include 'all'
        const container = isHowToPage ? howToContainer : articlesContainer;
        
        if (container) {
            if (isHowToPage) {
                // Collect tags from how-to items
                container.querySelectorAll('.tag').forEach(tag => {
                    tags.add(tag.textContent.toLowerCase().trim());
                });
            } else {
                // Collect tags from article previews
                container.querySelectorAll('.blog-post-preview').forEach(article => {
                    if (article.dataset.tags) {
                        const articleTags = article.dataset.tags.split(',');
                        articleTags.forEach(tag => tags.add(tag.trim()));
                    }
                });
            }
        }
        
        return Array.from(tags).sort();
    }

    // Function to generate tag filter buttons
    function generateTagFilters() {
        if (!filterTagsContainer) return;

        // Clear existing filter buttons except the label
        const filterLabel = filterTagsContainer.querySelector('.filter-label');
        filterTagsContainer.innerHTML = '';
        if (filterLabel) {
            filterTagsContainer.appendChild(filterLabel);
        }

        // Generate new filter buttons
        const tags = collectUniqueTags();
        tags.forEach(tag => {
            const button = document.createElement('button');
            button.className = 'tag-filter';
            button.dataset.tag = tag;
            button.textContent = tag.charAt(0).toUpperCase() + tag.slice(1); // Capitalize first letter
            
            // Add click handler
            button.addEventListener('click', () => {
                activeTag = tag;
                document.querySelectorAll('.tag-filter').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                filterItems();
            });

            filterTagsContainer.appendChild(button);
        });

        // Set initial active state for 'All' filter
        const allButton = filterTagsContainer.querySelector('[data-tag="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }
    }

    // Function to filter items based on search input and active tag
    function filterItems() {
        const container = isHowToPage ? howToContainer : articlesContainer;
        if (!container) return;

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const items = isHowToPage ? 
            container.querySelectorAll('.how-to-item') : 
            container.querySelectorAll('.blog-post-preview');

        let hasVisibleItems = false;

        items.forEach(item => {
            const tags = item.dataset.tags ? item.dataset.tags.split(',') : [];
            const title = item.querySelector('h2').textContent.toLowerCase();
            const excerpt = item.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
            
            const matchesTag = activeTag === 'all' || tags.includes(activeTag);
            const matchesSearch = searchTerm === '' || 
                title.includes(searchTerm) || 
                excerpt.includes(searchTerm);

            const isVisible = matchesTag && matchesSearch;
            item.style.display = isVisible ? 'block' : 'none';
            if (isVisible) hasVisibleItems = true;
        });

        // Show/hide no results message
        const noResults = container.querySelector('.no-results');
        if (!hasVisibleItems) {
            if (!noResults) {
                const message = document.createElement('p');
                message.className = 'no-results';
                message.textContent = 'No matching items found.';
                container.appendChild(message);
            }
        } else if (noResults) {
            noResults.remove();
        }
    }

    // Initialize search and filters
    if (searchInput) {
        searchInput.addEventListener('input', filterItems);
    }
    
    // Initialize filters if container exists
    if (filterTagsContainer) {
        generateTagFilters();
        filterItems(); // Initial filter
    }
});
