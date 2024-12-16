const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function getMetadata(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        return {
            title: $('meta[property="og:title"]').attr('content') || $('title').text(),
            description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content'),
            image: $('meta[property="og:image"]').attr('content'),
            icon: $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href')
        };
    } catch (error) {
        console.error(`Error fetching metadata for ${url}:`, error);
        return null;
    }
}

function getType(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('github.com')) return 'github';
    if (url.includes('codepen.io')) return 'codepen';
    return 'default';
}

module.exports = async function(url) {
    const type = getType(url);
    const metadata = await getMetadata(url);
    
    if (!metadata) {
        return `<a href="${url}" class="link-preview link-preview--error">${url}</a>`;
    }

    return `<a href="${url}" class="link-preview link-preview--${type}" target="_blank" rel="noopener noreferrer">
        ${metadata.image ? `
        <div class="link-preview__image">
            <img src="${metadata.image}" alt="${metadata.title}" loading="lazy">
        </div>` : ''}
        <div class="link-preview__content">
            ${metadata.icon ? `
            <div class="link-preview__icon">
                <img src="${metadata.icon}" alt="${type} icon" width="16" height="16">
            </div>` : ''}
            <h3 class="link-preview__title">${metadata.title}</h3>
            ${metadata.description ? `
            <p class="link-preview__description">${metadata.description}</p>` : ''}
            <div class="link-preview__url">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>${url.replace('https://', '').replace('http://', '')}</span>
            </div>
        </div>
    </a>`;
}
