# Dark Mode Implementation Guide

## Setup

This project uses Tailwind CSS for dark mode implementation with CSS variables for theming. Here's how it's set up:

### 1. Theme Configuration

In `tailwind.config.js`:
```js
module.exports = {
  darkMode: ["selector", ".dark"], // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        // ... other color variables
      }
    }
  }
}
```

### 2. CSS Variables

In your CSS file (e.g., `index.css`):
```css
@layer base {
  :root {
    /* Light mode variables */
    --background: 0 0% 100%;  /* white */
    --foreground: 222.2 84% 4.9%;
    --border: 214.3 31.8% 91.4%;
    /* ... other variables ... */
  }

  .dark {
    /* Dark mode variables */
    --background: 250 33% 6%;  /* dark blue */
    --foreground: 210 40% 98%;
    --border: 217 19% 27%;
    /* ... other variables ... */
  }
}
```

### 3. Body Styles

IMPORTANT: Always use theme variables for base styles, not hardcoded colors:

```css
@layer base {
  body {
    @apply bg-background text-foreground;  /* ✅ Correct */
    /* @apply bg-[#ffffff];  ❌ Wrong - will break dark mode */
  }
}
```

## Usage Examples

### Components
```tsx
// ✅ Correct - Using theme variables
<div className="bg-background text-foreground border-border">
  <h1 className="text-foreground">Title</h1>
  <p className="text-muted-foreground">Content</p>
</div>

// ❌ Wrong - Using hardcoded colors
<div className="bg-white dark:bg-[#0d0e1a]">
  <h1 className="text-black dark:text-white">Title</h1>
</div>
```

## Common Pitfalls

1. **Hardcoded Colors**: Never use hardcoded colors like `bg-[#ffffff]` or `dark:bg-[#0d0e1a]`. Instead, use theme variables:
   ```tsx
   ✅ bg-background
   ✅ text-foreground
   ✅ border-border
   ```

2. **Direct Dark Mode Classes**: Avoid using direct dark mode classes when theme variables are available:
   ```tsx
   ❌ dark:bg-gray-900
   ✅ bg-background
   ```

3. **Inconsistent Variable Usage**: Use semantic color variables consistently:
   ```tsx
   ❌ bg-white dark:bg-gray-900
   ✅ bg-background
   ```

## Debugging Dark Mode

If dark mode isn't working as expected:

1. Check for hardcoded colors in your CSS/components
2. Verify that the `dark` class is being applied to the HTML element
3. Confirm that all colors are using theme variables
4. Check for any styles that might be overriding the theme variables

## Benefits of This Approach

1. **Consistency**: Theme variables ensure consistent colors across the application
2. **Maintainability**: Changing colors only requires updating the CSS variables
3. **Type Safety**: Theme variables work with Tailwind's type system
4. **Performance**: No CSS-in-JS overhead, all handled by Tailwind

## Additional Resources

- [Tailwind Dark Mode Documentation](https://tailwindcss.com/docs/dark-mode)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
