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

### Block-Based Markdown Rendering (ArticleRenderer)

The Qriptopian uses a custom **block-based markdown rendering** approach for article content. This system parses plain text into semantic blocks and renders each with custom Tailwind styling.

#### Component: `ArticleRenderer`
**Location**: `src/components/content/ArticleRenderer.tsx`

#### Features:
1. **Semantic Block Parsing**
   - Parses content into blocks: headings, paragraphs, lists, quotes, code blocks
   - Maintains content structure and hierarchy
   - Handles inline formatting (bold text with `**text**`)

2. **Styled Rendering**
   - **Headings**: Gradient backgrounds (cyan to purple), left border accent, contextual prefixes
     - H1: "Understanding {text}"
     - H2: "Key info on {text}"
     - H3: "About {text}"
   - **Ordered Lists**: Numbered circles with cyan accents
   - **Unordered Lists**: Cyan bullet points with proper spacing
   - **Quotes**: Purple left border, light purple background, italic text
   - **Code Blocks**: Black background, cyan border, monospace font
   - **Paragraphs**: Gray-300 text, relaxed leading for readability

3. **Inline Formatting**
   - **Bold text** (`**text**` or `__text__`): Rendered with cyan background highlight and cyan text
   - Creates visual emphasis for key terms and concepts

4. **Modal Presentation**
   - Full-screen overlay with centered content
   - Scrollable article area with max-height constraint
   - Header showing title, excerpt, and duration
   - Close button with cyan accent styling

#### Usage:
```tsx
<ArticleRenderer
  content={articleText}
  title="Article Title"
  excerpt="Brief summary"
  duration="5 min read"
  onClose={() => closeModal()}
/>
```

#### Design Rationale:
This approach provides:
- **Consistent formatting** across all article content
- **Enhanced readability** with proper spacing and typography
- **Visual hierarchy** that guides the reader through content
- **Brand alignment** with The Qriptopian's quantum/tech aesthetic
- **Key term emphasis** through cyan highlighting of bold terms

#### When to Use:
- Long-form articles in the Latest News section
- Feature stories in hero sections
- Any content requiring structured, readable formatting
- Content with technical terms or concepts requiring emphasis

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
2. **Maintain the block-based structure** when creating new article content
3. **Use cyan/purple gradients** for emphasis and visual interest
4. **Keep backgrounds dark** to maintain the quantum-tech aesthetic
5. **Ensure proper contrast** for accessibility (light text on dark backgrounds)
6. **Apply ArticleRenderer** to any new article-format content for consistency
