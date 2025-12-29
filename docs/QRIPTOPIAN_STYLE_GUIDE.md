# The Qriptopian Style Guide

## Brand Overview
The Qriptopian is a publication focused on stories from the Quantum-Ready Internet, featuring content about quantum computing, cryptography, and emerging technologies.

## Design System

### Color Palette
- **Primary Cyan**: `#00d9ff` (qripto-cyan) - Used for accents, links, and interactive elements
- **Primary Purple**: `#9b59b6` (qripto-purple) - Used for secondary accents and gradients
- **Background**: Dark navy/black tones (`#020b18`, `#071327`)
- **Text**: Light cyan-tinted whites (`#d0f6ff`) for headings, gray-300 for body text

### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)
- **Hierarchy**:
  - H1: Large, bold, gradient background with left border
  - H2: Medium, bold, gradient background with left border
  - H3: Small, bold, gradient background with left border
  - Body: Regular weight, line-height 1.7 for readability

## Content Formatting

### Markdown + HTML Rendering (ArticleRenderer)

The Qriptopian uses a **Markdown renderer with HTML support** for article content. This system uses `react-markdown` with security-focused plugins for XSS sanitization.

#### Component: `ArticleRenderer`
**Location**: `src/components/content/ArticleRenderer.tsx`

#### Markdown Library: `Markdown`
**Location**: `src/lib/markdown.tsx`

#### Supported Formats:

1. **Standard Markdown**
   - Headings: `# H1`, `## H2`, `### H3`, etc.
   - Bold: `**text**` or `__text__` (renders with cyan highlight)
   - Italic: `*text*` or `_text_`
   - Lists: `- bullet` or `1. numbered`
   - Quotes: `> blockquote`
   - Code: `` `inline` `` and ``` ```code blocks``` ```
   - Links: `[text](url)`

2. **Raw HTML (New!)**
   - **Tables**: `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`
   - **Links**: `<a href="..." target="_blank">` (external links auto-get `rel="noopener noreferrer nofollow"`)
   - **Semantic elements**: `<div>`, `<span>`, `<section>`, `<article>`, etc.
   - **Images**: `<img src="..." alt="...">`

3. **GitHub Flavored Markdown (GFM)**
   - Tables: `| Column | Column |`
   - Strikethrough: `~~text~~`
   - Autolinks

#### Security (XSS Protection):

The renderer uses `rehype-sanitize` with a configurable allowlist. **Blocked elements**:
- `<script>`, `<style>`, `<iframe>`, `<form>`, `<input>`, `<button>`
- Event handlers (`onclick`, `onerror`, etc.)
- JavaScript URLs (`javascript:`)

**Allowlist Configuration**: `src/lib/markdown.tsx` - `ALLOWED_SCHEMA` export

#### Example Content with Tables:

```markdown
## Key Comparisons

<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Traditional</th>
      <th>Quantum-Ready</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Encryption</td>
      <td>RSA-2048</td>
      <td><b>Post-Quantum Lattice</b></td>
    </tr>
    <tr>
      <td>Speed</td>
      <td>100ms</td>
      <td><b>10ms</b></td>
    </tr>
  </tbody>
</table>

Sources: <a href="https://example.com" target="_blank">Example</a>
```

#### Styled Rendering:
- **Headings**: Gradient backgrounds (cyan to purple), left border accent
- **Tables**: 
  - Header: Cyan background tint, cyan text
  - Rows: Alternating purple tint, hover highlight
  - Borders: Subtle cyan
- **Ordered Lists**: Numbered circles with cyan accents
- **Unordered Lists**: Cyan bullet points with proper spacing
- **Quotes**: Purple left border, light purple background, italic text
- **Code Blocks**: Black background, cyan border, monospace font
- **Links**: Cyan color, underline, opens external in new tab
- **Bold text**: Rendered with cyan background highlight (key term emphasis)
- **Paragraphs**: Gray-300 text, relaxed leading for readability

#### Modal Presentation:
- Full-screen overlay with centered content
- Scrollable article area with max-height constraint
- Header showing title, excerpt, and duration
- Close button with cyan accent styling

#### Usage:
```tsx
import { ArticleRenderer } from '@/components/content/ArticleRenderer';

<ArticleRenderer
  content={articleText}
  title="Article Title"
  excerpt="Brief summary"
  duration="5 min read"
  onClose={() => closeModal()}
/>
```

Or use the Markdown component directly:
```tsx
import { Markdown } from '@/lib/markdown';

<Markdown>{contentWithHtml}</Markdown>
```

#### When to Use:
- Long-form articles in the Latest News section
- Feature stories in hero sections
- Any content requiring structured, readable formatting
- Content with technical terms or concepts requiring emphasis
- Articles with comparison tables or data

## Admin Editor

The Content Editor at `/admin/content/edit` includes:
- **Preview Button**: Click "Preview Article" to see rendered output
- **Markdown + HTML Support**: Textarea hints show supported formats
- **Auto-calculated read duration**: Based on word count

## Content Sections

### Latest News
- Carousel-based layout with horizontal scrolling
- Card-based article preview with thumbnail
- Multi-modality support (read, watch, listen, link)
- Uses ArticleRenderer for read modality

### Hero Sections
- Full-width background images
- Overlaid text with gradient effects
- Multi-modality content consumption
- ArticleRenderer integration for article view

## Interactive Elements

### Modality Buttons
- **Read**: BookOpen icon - triggers ArticleRenderer
- **Watch**: Play icon - displays video player
- **Listen**: Headphones icon - displays audio player
- **Link**: ExternalLink icon - opens external content viewer

### Navigation
- Cyan-accent buttons with hover states
- Disabled states with reduced opacity
- Smooth transitions (transition-all)

## Best Practices

1. **Always use semantic tokens** from index.css and tailwind.config.ts
2. **Use Markdown for structure** - headings, lists, emphasis
3. **Use HTML tables for data** - complex comparison tables render better as HTML
4. **Add target="_blank" to external links** - security attrs are auto-applied
5. **Keep backgrounds dark** to maintain the quantum-tech aesthetic
6. **Ensure proper contrast** for accessibility (light text on dark backgrounds)
7. **Preview before publishing** - use the Preview Article button in the editor
8. **Test XSS safety** - scripts are automatically stripped

## Extending the Allowlist

To add new HTML tags or attributes, edit `src/lib/markdown.tsx`:

```typescript
export const ALLOWED_SCHEMA = {
  tagNames: [
    // Add new tags here
    'details', 'summary',
  ],
  attributes: {
    // Add new attributes here
    details: ['open'],
  },
};
```
