---
layout: post.njk
title: Basic CSS Animations
date: 2024-12-16
tags: ['CSS', 'Best Practices']
excerpt: Learn about CSS animations and how to create them effectively.
guides:
  - id: draw-circle
    title: Draw a circle in CSS
    tags: ['CSS', 'Best Practices']
  - id: css-variables
    title: Define and use CSS variables
    tags: ['CSS', 'Best Practices']
  - id: keyframes
    title: CSS animation using keyframes
    tags: ['CSS', 'Best Practices']
  - id: background-position
    title: Using background position for CSS animations
    tags: ['CSS', 'Best Practices']
  - id: radial-gradient
    title: CSS radial gradient
    tags: ['CSS', 'Best Practices']
---

In this post, we'll explore how to create effective CSS animations. We'll cover everything from basic keyframes to complex transitions.

## Drawing a Circle in CSS

First, let's create a simple circle using CSS:

```css
.circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary-color);
}
```

## CSS Variables

CSS variables (custom properties) are a powerful way to maintain consistent styling:

```css
:root {
    --primary-color: #3269FF;
    --bg-color: #F6F5F1;
}

.element {
    background: var(--bg-color);
    color: var(--primary-color);
}
```

## Animation with Keyframes

Here's how to create a rotation animation:

```css
@keyframes rotate {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
}

.rotating-element {
    animation: rotate 2s linear infinite;
}
```

## Background Position Animation

You can create interesting effects by animating background position:

```css
.moving-background {
    background: linear-gradient(45deg, #3269FF, #F6F5F1);
    animation: moveBackground 10s linear infinite;
}

@keyframes moveBackground {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
}
```

## Radial Gradients

Create beautiful circular gradients:

```css
.radial-gradient {
    background: radial-gradient(circle at center,
        var(--primary-color) 0%,
        var(--bg-color) 100%
    );
}
