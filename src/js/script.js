// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Prism.js for syntax highlighting if available
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
    }
    
    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.body.classList.toggle('dark-theme', e.matches);
        }
    });

    // Search and filter functionality
    const searchInput = document.getElementById('search-input');
    const filterTagsContainer = document.querySelector('.filter-tags');
    let activeTag = 'all';

    // Get the appropriate container based on the current page
    const articlesContainer = document.getElementById('articles-container');
    const howToContainer = document.getElementById('how-to-container');
    const isHowToPage = window.location.pathname.endsWith('how-to.html');
    
    // Function to collect all unique tags from the page
    function collectUniqueTags() {
        const tags = new Set(['all']); // Always include 'all'
        
        if (isHowToPage) {
            // Collect tags from how-to items
            document.querySelectorAll('.tag').forEach(tag => {
                tags.add(tag.textContent.toLowerCase().trim());
            });
        } else {
            // Collect tags from article previews
            document.querySelectorAll('.blog-post-preview').forEach(article => {
                if (article.dataset.tags) {
                    const articleTags = article.dataset.tags.split(',');
                    articleTags.forEach(tag => tags.add(tag.trim()));
                }
            });
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
        const allButton = document.querySelector('[data-tag="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }
    }

    // Filter items based on search input and active tag
    function filterItems() {
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase();
        let hasVisibleItems = false;

        if (isHowToPage) {
            // Filter how-to items
            document.querySelectorAll('.how-to-item').forEach(category => {
                let categoryHasVisible = false;
                
                category.querySelectorAll('li').forEach(item => {
                    const text = item.querySelector('a').textContent.toLowerCase();
                    const tags = Array.from(item.querySelectorAll('.tag'))
                        .map(tag => tag.textContent.toLowerCase().trim());
                    
                    const matchesSearch = text.includes(searchTerm);
                    const matchesTag = activeTag === 'all' || tags.includes(activeTag.toLowerCase());
                    
                    if (matchesSearch && matchesTag) {
                        item.style.display = 'flex';
                        categoryHasVisible = true;
                        hasVisibleItems = true;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Show/hide the entire category based on whether it has visible items
                category.style.display = categoryHasVisible ? 'block' : 'none';
            });
        } else {
            // Filter article previews
            document.querySelectorAll('.blog-post-preview').forEach(article => {
                const title = article.querySelector('h2 a').textContent.toLowerCase();
                const content = article.textContent.toLowerCase();
                const tags = article.dataset.tags ? article.dataset.tags.split(',').map(tag => tag.trim()) : [];
                
                const matchesSearch = title.includes(searchTerm) || content.includes(searchTerm);
                const matchesTag = activeTag === 'all' || tags.includes(activeTag);
                
                if (matchesSearch && matchesTag) {
                    article.style.display = 'block';
                    hasVisibleItems = true;
                } else {
                    article.style.display = 'none';
                }
            });
        }

        // Show/hide no results message
        const noResults = document.getElementById('no-results') || createNoResultsElement();
        noResults.classList.toggle('hidden', hasVisibleItems);
    }

    // Create no results element if it doesn't exist
    function createNoResultsElement() {
        const noResults = document.createElement('div');
        noResults.id = 'no-results';
        noResults.className = 'hidden';
        noResults.innerHTML = '<p>No items found matching your search criteria.</p>';
        const container = isHowToPage ? howToContainer : articlesContainer;
        if (container) {
            container.appendChild(noResults);
        }
        return noResults;
    }

    // Initialize search and filters
    if (searchInput) {
        searchInput.addEventListener('input', filterItems);
        // Trigger initial filter to set up everything correctly
        filterItems();
    }
    generateTagFilters();
});
