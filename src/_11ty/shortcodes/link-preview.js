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

async function linkPreview(url) {
    const type = getType(url);
    const metadata = await getMetadata(url);
    
    if (!metadata) {
        return `<a href="${url}" class="link-preview link-preview--error">${url}</a>`;
    }

    // Import the link-preview component macro
    const preview = this.ctx.getComponents()['link-preview'];
    
    return preview({
        url,
        type,
        title: metadata.title,
        description: metadata.description,
        image: metadata.image,
        icon: metadata.icon
    });
}

module.exports = linkPreview;
