# Mobile Design Documentation - RAINTREE.WIKI

## Overview
This document lists all pages in the RAINTREE.WIKI application and describes the mobile-specific design optimizations implemented for each page. **Desktop designs remain unchanged** - all modifications are mobile-only (screens ≤768px width).

---

## Complete Page List

### 1. **Logo Window (RAINTREE.WIKI Landing)**
**Component:** `LogoWindow` in `App.jsx`

**Mobile Optimizations:**
- Reduced logo size: 80px × 80px (from 100px)
- Title font size: 18px (from 28px)
- Full-width button with max-width: 250px
- Reduced binary rain opacity for better readability
- Optimized padding and spacing for small screens
- Touch-friendly button sizing (12px padding)

---

### 2. **IP Lookup Terminal**
**Component:** `IPTerminal` in `App.jsx`

**Mobile Optimizations:**
- Smaller font sizes: 12px for Kali prompt, 13px for input
- Increased padding for touch targets
- Word-break enabled for long IP addresses
- Enhanced border width (2px) for better visibility
- Optimized terminal scroll area
- Better placeholder text sizing
- Touch-friendly input form with 15px spacing

---

### 3. **Network Scanner (Hacking Terminal #1)**
**Component:** `HackingTerminal` (windowId: 1)

**Mobile Optimizations:**
- Terminal line font: 12px with 1.4 line-height
- Word-break enabled for long terminal output
- Enhanced text shadows for readability
- Optimized scrolling with padding
- Touch-friendly window controls (28px buttons)

---

### 4. **Exploit Framework (Hacking Terminal #2)**
**Component:** `HackingTerminal` (windowId: 2)

**Mobile Optimizations:**
- Same terminal optimizations as Network Scanner
- Color-coded output with enhanced shadows
- Responsive text wrapping
- Optimized for vertical scrolling

---

### 5. **Network Monitor (Hacking Terminal #3)**
**Component:** `HackingTerminal` (windowId: 3)

**Mobile Optimizations:**
- Same terminal optimizations as other hacking terminals
- Enhanced readability for network statistics
- Proper text wrapping for long lines

---

### 6. **System Monitor (Hacking Terminal #4)**
**Component:** `HackingTerminal` (windowId: 4)

**Mobile Optimizations:**
- Same terminal optimizations as other hacking terminals
- Optimized display of system statistics
- Better spacing for process lists

---

### 7. **Auth Window (Login/Authentication)**
**Component:** `AuthWindow.jsx`

**Mobile Optimizations:**
- Reduced padding: 15px
- Larger touch targets for buttons (14px padding, full width)
- Stacked button layout (column direction)
- Enhanced input fields: 12px padding, 14px font
- Bold labels (13px) for better readability
- Error messages with 2px borders
- Full-width form fields
- Optimized spacing between elements (15px gaps)

---

### 8. **Dashboard (Main User Dashboard)**
**Component:** `Dashboard.jsx`

**Mobile Optimizations:**
- **Stats Grid:** 2-column layout (instead of 4)
- **Stat Cards:** Reduced padding (12px), smaller fonts (11px labels, 20px values)
- **Action Buttons:** Full-width, stacked vertically
- **Plan Cards:** 
  - Stacked header layout (name and type)
  - Word-break for long plan names
  - Vertical progress bar layout
  - Enhanced borders (2px)
  - Reduced hover transform (3px instead of 5px)
- **Overall:** 15px padding, optimized gaps throughout

---

### 9. **Plan Creator (Create New Plans)**
**Component:** `PlanCreator.jsx`

**Mobile Optimizations:**
- Single-column form layout
- Bold labels (13px) for clarity
- Large input fields: 12px padding, 14px font
- Textarea minimum height: 100px
- Full-width buttons stacked vertically
- Enhanced borders (2px) for all form elements
- Optimized spacing: 15px gaps
- Error messages with better visibility

---

### 10. **Plan Tracker (Track Plan Progress)**
**Component:** `PlanTracker.jsx`

**Mobile Optimizations:**
- **Plan Info:** Vertical layout for info rows, bold labels
- **Progress Overview:** Enhanced borders, optimized spacing
- **Chart Section:** 
  - Responsive chart sizing
  - Smaller font (11px) for chart labels
  - Better padding (12px)
- **Progress Input:** 
  - Large textarea (80px min-height)
  - 14px font size
  - Enhanced borders (2px)
- **Progress History:** 
  - Reduced max-height (250px)
  - Better entry spacing
  - Optimized date/description layout
- **Action Buttons:** Full-width, stacked vertically

---

### 11. **Notification Manager**
**Component:** `NotificationManager.jsx`

**Mobile Optimizations:**
- **Settings:**
  - Larger checkboxes (24px × 24px)
  - Wrapped layout for long labels
  - Enhanced borders (2px)
- **Notifications:**
  - Vertical layout (content stacked above dismiss button)
  - Full-width dismiss button (40px height)
  - Enhanced border-left (4px) for notification types
  - Better text sizing (13px content, 12px details)
  - Reduced hover transform (3px)
- **Info Section:** Improved line-height (1.7) for readability

---

### 12. **File Manager (Upload & Manage Files)**
**Component:** `FileManager.jsx`

**Mobile Optimizations:**
- **Upload Section:**
  - Vertical layout
  - Full-width upload button
  - Centered file size limit text
- **File Items:**
  - Vertical info layout
  - Bold file names (14px)
  - Full-width action buttons
  - Stacked button layout
  - Enhanced borders (2px, 3px when selected)
- **File Actions:** Equal-width buttons in horizontal row
- **Meta Editing:** Vertical layout with full-width input
- **Error Messages:** Vertical layout with better spacing

---

## Global Mobile Optimizations

### Window System
- **Custom Cursor:** Hidden on mobile (better UX)
- **Window Borders:** Enhanced to 2px for visibility
- **Title Bar:** Larger touch targets (10px padding)
- **Window Controls:** Bigger buttons (28px × 28px)
- **Content Padding:** Increased to 15px

### Typography
- **Headers:** 13-14px (reduced from 15-16px)
- **Body Text:** 13-14px (reduced from 15-16px)
- **Labels:** 11-13px with bold weight
- **Terminal Text:** 12px (reduced from 15px)

### Touch Interactions
- **Tap Highlight:** Custom colors for better feedback
- **Touch Action:** Manipulation for all interactive elements
- **Button Sizing:** Minimum 40px height for touch targets
- **Spacing:** Increased gaps between interactive elements

### Visual Enhancements
- **Text Shadows:** Enhanced (3px blur) for better readability
- **Borders:** Increased to 2px for better visibility
- **Animations:** Reduced for better performance
- **Scanline Effect:** Optimized for mobile screens

### Layout
- **Vertical Stacking:** Most multi-column layouts become single-column
- **Full-Width Elements:** Buttons and inputs use full available width
- **Reduced Transforms:** Hover effects reduced from 5px to 3px
- **Optimized Gaps:** Consistent 10-15px spacing throughout

---

## Technical Implementation

### Media Query
```css
@media (max-width: 768px) {
    /* All mobile styles */
}
```

### Key Features
1. **Desktop Preservation:** All desktop styles remain unchanged
2. **Mobile-First Touch:** Optimized for touch interactions
3. **Performance:** Reduced animations and effects
4. **Readability:** Enhanced text shadows and sizing
5. **Accessibility:** Larger touch targets and better contrast

---

## Testing Recommendations

### Devices to Test
- iPhone SE (375px width)
- iPhone 12/13/14 (390px width)
- iPhone 12/13/14 Pro Max (428px width)
- Samsung Galaxy S21 (360px width)
- iPad Mini (768px width - breakpoint)

### Features to Verify
1. ✅ All text is readable without zooming
2. ✅ All buttons are easily tappable (min 40px)
3. ✅ Forms are easy to fill on mobile keyboards
4. ✅ Scrolling is smooth in all sections
5. ✅ No horizontal scrolling required
6. ✅ Terminal output wraps properly
7. ✅ Charts are responsive and readable
8. ✅ File upload works on mobile browsers
9. ✅ Window dragging works with touch
10. ✅ All animations perform well

---

## Browser Compatibility

### Tested Browsers
- ✅ Safari iOS 14+
- ✅ Chrome Mobile 90+
- ✅ Firefox Mobile 90+
- ✅ Samsung Internet 14+

### Known Issues
- None currently identified

---

## Future Enhancements

### Potential Improvements
1. **Swipe Gestures:** Add swipe to dismiss for notifications
2. **Pull to Refresh:** Implement for dashboard and file list
3. **Haptic Feedback:** Add vibration for important actions
4. **Offline Mode:** Cache data for offline access
5. **Dark Mode Toggle:** Add explicit dark/light mode switch
6. **Font Size Control:** Allow users to adjust text size

---

## Maintenance Notes

### When Adding New Pages
1. Add mobile styles in the `@media (max-width: 768px)` section
2. Follow existing patterns for consistency
3. Test on multiple device sizes
4. Ensure touch targets are at least 40px
5. Update this documentation

### When Modifying Existing Pages
1. Test both desktop and mobile layouts
2. Ensure desktop styles remain unchanged
3. Verify mobile optimizations still work
4. Update documentation if needed

---

**Last Updated:** 2025-01-16  
**Version:** 1.0.0  
**Maintained By:** Development Team
