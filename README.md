# File Converter with Format Selection Component

A responsive file converter web application featuring a modern format selection component that matches the visual style of exifremover.com.

## Features

### Format Selection Component
- **4 Large Format Buttons**: JPG, PNG, PDF, and WebP formats
- **Responsive Layout**: 
  - Desktop: 4x1 horizontal row
  - Tablet: 2x2 grid layout
  - Mobile: 1x4 vertical stack
- **Button Dimensions**: 
  - Desktop: ~2cm height (80px)
  - Mobile: ~1cm height (40px)
- **Visual Feedback**: Active state highlighting with gradient background
- **Icons & Labels**: Each format has an icon and descriptive text

### File Upload Area
- **Drag & Drop**: Support for drag and drop file uploads
- **File Validation**: Accepts image files (JPEG, PNG, GIF, WebP) and PDFs
- **Visual Feedback**: Hover and drag-over states
- **File Display**: Shows selected files with names and sizes

### Interactive Features
- **Real-time Updates**: Convert button enables/disables based on file selection
- **Notifications**: Success/error messages with auto-dismiss
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + Enter`: Convert files
  - `Escape`: Clear selection
- **Loading States**: Visual feedback during conversion process

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # Responsive CSS styles
├── script.js           # JavaScript functionality
└── README.md           # Documentation
```

## Implementation Details

### HTML Structure
The format selection component is positioned above the file upload area as specified:
```html
<div class="format-selection">
    <h2>Select Output Format</h2>
    <div class="format-buttons">
        <!-- 4 format buttons with icons and labels -->
    </div>
</div>
```

### CSS Responsive Design
- **Desktop (≥768px)**: 4-column grid layout
- **Tablet (480px-767px)**: 2x2 grid layout  
- **Mobile (<480px)**: Single column vertical stack

### JavaScript Functionality
- Format selection with visual state management
- File upload handling with drag & drop
- File validation and processing
- Conversion simulation with results display
- Notification system for user feedback

## Browser Compatibility
- Modern browsers with ES6+ support
- Responsive design works on all screen sizes
- Touch-friendly interface for mobile devices

## Usage

1. **Select Format**: Click on one of the four format buttons (JPG, PNG, PDF, WebP)
2. **Upload Files**: Drag and drop files or click to browse
3. **Convert**: Click the "Convert Files" button
4. **Download**: Access converted files from the results area

## Design Specifications Met

✅ **Component Width**: Equal to upload area width  
✅ **4 Format Buttons**: Large, interactive buttons with icons  
✅ **Desktop Layout**: 4x1 horizontal row  
✅ **Mobile Layout**: Responsive 2x2 grid or 1x4 vertical stack  
✅ **Button Heights**: ~2cm desktop, ~1cm mobile  
✅ **Visual Style**: Matches exifremover.com aesthetic  
✅ **Responsive Design**: Works on all screen sizes  

## Customization

The component can be easily customized by:
- Modifying the format options in the HTML
- Adjusting colors and gradients in CSS
- Adding new format types in JavaScript
- Changing button dimensions in the CSS media queries

## Future Enhancements

- Real file conversion functionality
- Additional format support
- Batch processing options
- Progress indicators
- File preview capabilities 