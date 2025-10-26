# PDF Generation - Certification Reports

## Overview
The system automatically generates professional PDF reports for completed certification missions. The PDF includes all certification data, scores, market values, and comments.

## Features

### PDF Content
The generated PDF includes:
- **Header**: Title and generation date
- **Client Information**: Name, email, phone, service tier, mission dates
- **Watch Identification**: Brand, model, reference, serial number, year
- **Evaluation Scores**: Table showing scores for case, dial, movement, strap, and technical aspects
- **Final Score**: Prominently displayed overall score (out of 10)
- **Market Value**: Estimated value, market value, and liquidity score
- **Comments**: General condition, comments, and conclusions
- **Footer**: Page numbers on all pages

### How to Use

#### 1. Complete a Certification Report
Before generating a PDF, make sure to:
- Create a walk-in client mission
- Start the mission (change status to "in_progress")
- Fill out the certification report form
- Save the report data

#### 2. Generate PDF
When you're ready to finalize a mission:
1. Click the "Terminer" button on a mission in "in_progress" status
2. In the confirmation dialog, you'll see two options:
   - **Télécharger PDF**: Generate and download the certification report PDF
   - **Confirmer**: Finalize the mission (marks as completed)

#### 3. Download Flow
- Click "Télécharger PDF" button
- System fetches the certification report from the database
- PDF is generated client-side using jsPDF
- PDF automatically downloads to your device
- Filename format: `certification-ClientName.pdf`

## Technical Implementation

### Libraries Used
- **jsPDF** (v3.0.3): Core PDF generation library
- **jspdf-autotable** (v5.0.2): Table generation for scores

### File Structure
```
src/
├── lib/
│   └── generate-certification-pdf.ts   # Main PDF generation utility
├── components/partner/
│   ├── complete-mission-dialog.tsx     # Dialog with PDF download
│   └── walk-in-missions-list.tsx       # Mission list UI
└── app/actions/
    └── certification-report.ts         # Data fetching actions
```

### Key Functions

#### `generateCertificationPDF(mission, report)`
Main function that generates the PDF.

**Parameters:**
- `mission`: MissionSummary object with client and mission details
  - `clientName`: string
  - `clientEmail`: string
  - `clientPhone`: string
  - `serviceTier`: string (custodia/imperium)
  - `createdAt`: Date
  - `completedAt`: Date (optional)
- `report`: CertificationReport object or null

**Process:**
1. Dynamic import of jsPDF (to avoid SSR issues)
2. Initialize PDF document
3. Add header with title and date
4. Add client information section
5. If report exists:
   - Add watch identification
   - Add scores table
   - Add final score (highlighted)
   - Add market value
   - Add comments (with page break if needed)
6. Add footer with page numbers
7. Save/download PDF

### Helper Functions

#### `addClientSection(doc, mission, yPos)`
Adds client information to the PDF.

#### `addWatchSection(doc, report, yPos)`
Adds watch identification details (brand, model, reference, serial, year).

#### `addScoresSection(doc, report, yPos)`
Creates a formatted table with evaluation scores.

#### `addFinalScoreSection(doc, report, yPos, pageWidth)`
Displays the final score prominently (centered, blue color).

#### `addMarketValueSection(doc, report, yPos)`
Shows market value, estimated value, and liquidity score.

#### `addCommentsSection(doc, report, yPos, pageWidth)`
Adds all comments sections with automatic text wrapping.

#### `addFooter(doc, pageWidth)`
Adds page numbers to all pages.

## Layout Constants

```typescript
const MARGIN_LEFT = 20;
const MARGIN_TOP = 20;
const FONT_SIZE_TITLE = 20;
const FONT_SIZE_SECTION = 14;
const FONT_SIZE_BODY = 10;
const FONT_SIZE_SUBTITLE = 12;
const FONT_SIZE_FOOTER = 8;
const FONT_SIZE_SCORE = 16;
const LINE_HEIGHT_SMALL = 6;
const LINE_HEIGHT_MEDIUM = 7;
const LINE_HEIGHT_XL = 15;
const SECTION_SPACING = 10;
const PAGE_BREAK_THRESHOLD = 250;
```

## Styling

### Colors
- **Header/Title**: Black
- **Final Score**: Blue (#2980B9)
- **Table Headers**: Blue gradient
- **Error Message**: Red
- **Footer**: Gray

### Fonts
- **Title**: Helvetica Bold, 20pt
- **Section Headers**: Helvetica Bold, 14pt
- **Body Text**: Helvetica Normal, 10pt
- **Footer**: Helvetica Normal, 8pt

## Error Handling

### Missing Report Data
If no certification report exists for a mission:
- PDF still generates with client information
- Shows message: "Aucun rapport de certification disponible"
- Red text color for visibility

### Empty Sections
If a section has no data (e.g., no scores), it's automatically skipped.

### Toast Notifications
- **Success**: "PDF généré avec succès"
- **Error**: "Erreur lors de la génération du PDF"

## Future Enhancements

### Potential Improvements
1. **Server-side storage**: Save PDFs to cloud storage
2. **Email delivery**: Automatically email PDF to client
3. **Branding**: Add company logo and custom colors
4. **Multi-language**: Support for English/French templates
5. **Photos**: Include certification photos in PDF
6. **Digital signature**: Add authenticated signature field
7. **QR code**: Add verification QR code
8. **Print optimization**: Add print-specific CSS
9. **Templates**: Multiple PDF template styles
10. **Compression**: Optimize PDF file size

## Troubleshooting

### PDF not downloading
- Check browser console for errors
- Verify certification report was saved
- Ensure jsPDF libraries are installed (`bun add jspdf jspdf-autotable`)

### Missing data in PDF
- Verify form fields have `name` and `id` attributes
- Check that data was saved to database
- Ensure field names match database schema

### Formatting issues
- Check constant values in generate-certification-pdf.ts
- Verify page break threshold (250)
- Test with different text lengths

## Package Manager Note
This project uses **Bun** (not npm) for package management:
```bash
# Install dependencies
bun install

# Add new packages
bun add package-name
```

## Dependencies
```json
{
  "jspdf": "^3.0.3",
  "jspdf-autotable": "^5.0.2"
}
```

## Code Quality
- All code follows Ultracite/Biome linting rules
- Functions kept under 15 complexity threshold
- Magic numbers extracted to constants
- No console.log statements in production code
- Proper TypeScript typing throughout
