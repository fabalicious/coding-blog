---
layout: post.njk
title: Implementing Dark Mode with CSS and JavaScript
date: 2024-12-16
description: A comprehensive guide on implementing a dark mode toggle in your web application, complete with system preference detection and persistent settings.
excerpt: Learn how to implement a dark mode toggle that respects system preferences, persists user choices, and smoothly transitions between themes.
tags: 
  - JavaScript
  - CSS
  - Tutorial
  - Web Development
guides:
  - title: How to implement dark mode with CSS variables
    tags: [CSS, JavaScript, Web Development]
  - title: How to persist theme preferences in localStorage
    tags: [JavaScript, Web Development]
  - title: How to detect and respect system color scheme preferences
    tags: [JavaScript, Web Development]
---

Dark mode has become a standard feature in modern web applications. In this article, I'll show you how to implement a robust dark mode toggle that not only switches themes but also respects system preferences and remembers user choices. We'll build this using vanilla JavaScript and CSS, no frameworks required!

## The HTML Structure

First, let's create a theme toggle button with icons for both light and dark modes. We'll use SVG icons, but you could also use icon fonts or images:

```html
<button id="theme-toggle" aria-label="Toggle dark mode">
    <svg class="moon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
    <svg class="sun" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
</button>
```

## The CSS Magic

The key to a maintainable dark mode implementation is using CSS custom properties (variables). This allows us to define our color scheme in one place and use it throughout the application:

```css
/* Default (light) theme variables */
:root {
    --bg-color: #ffffff;
    --text-color: #2d3748;
    --primary-color: #3182ce;
    --border-color: #e2e8f0;
}

/* Dark theme variables */
.dark-theme {
    --bg-color: #1a202c;
    --text-color: #e2e8f0;
    --primary-color: #63b3ed;
    --border-color: #4a5568;
}

/* Theme toggle button styling */
#theme-toggle {
    background: none;
    border: none;
    padding: 0.5rem;
    color: var(--text-color);
    cursor: pointer;
}

/* Icon visibility */
#theme-toggle .sun {
    display: none;
}

.dark-theme #theme-toggle .sun {
    display: block;
}

.dark-theme #theme-toggle .moon {
    display: none;
}
```

## The JavaScript Logic

The JavaScript handles three main aspects:
1. Initial theme detection
2. Theme toggling
3. Persistence of user preference

Here's the complete implementation:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Get our elements
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const html = document.documentElement;
    
    // Set initial theme based on localStorage or system preference
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && prefersDarkScheme.matches)) {
        html.classList.add('dark-theme');
    }
    
    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark-theme');
            localStorage.setItem('theme', 
                html.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            html.classList.toggle('dark-theme', e.matches);
        }
    });
});
```

## How It All Works

Let's break down the key components:

### 1. Theme Detection
The script first checks if there's a saved preference in `localStorage`. If not, it falls back to the system preference using the `prefers-color-scheme` media query:

```javascript
if (localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && prefersDarkScheme.matches)) {
    html.classList.add('dark-theme');
}
```

### 2. Theme Toggling
When the toggle button is clicked, we:
1. Toggle the `dark-theme` class on the HTML element
2. Save the new preference to `localStorage`

```javascript
themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark-theme');
    localStorage.setItem('theme', 
        html.classList.contains('dark-theme') ? 'dark' : 'light');
});
```

### 3. System Theme Changes
We also listen for changes in the system's color scheme preference:

```javascript
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        html.classList.toggle('dark-theme', e.matches);
    }
});
```

### 4. Icon Switching
The icons switch automatically through CSS. Both icons are always in the DOM, but we show/hide them based on the current theme:

```css
#theme-toggle .sun { display: none; }
.dark-theme #theme-toggle .sun { display: block; }
.dark-theme #theme-toggle .moon { display: none; }
```

## Benefits of This Approach

1. **Maintainability**: Using CSS variables makes it easy to modify the theme colors in one place.
2. **Performance**: The theme switch is instant as it only requires toggling a class.
3. **Persistence**: User preferences are saved and restored between visits.
4. **System Awareness**: Respects the user's system preferences by default.
5. **Accessibility**: The toggle button includes proper ARIA labels.

## Browser Support

This implementation works in all modern browsers. The key features we use:
- CSS Custom Properties (variables): [98.7% browser support](https://caniuse.com/css-variables)
- `prefers-color-scheme`: [94.9% browser support](https://caniuse.com/prefers-color-scheme)
- `localStorage`: [98.9% browser support](https://caniuse.com/namevalue-storage)

## Related Resources

Here are some helpful resources for learning more about dark mode implementation:

{% linkPreview "https://web.dev/prefers-color-scheme/" %}
{% linkPreview "https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/" %}
{% linkPreview "https://github.com/GoogleChrome/dark-mode-toggle" %}

## Conclusion

Implementing dark mode doesn't have to be complicated. With a combination of modern CSS features and a bit of JavaScript, we can create a robust theme switching system that respects user preferences and provides a smooth experience.

Try clicking the theme toggle in the navigation bar of this blog to see it in action!
