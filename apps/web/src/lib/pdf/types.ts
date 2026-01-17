/**
 * Story 9.3: Reading Export to PDF
 * Type definitions for PDF export functionality
 */

/**
 * Card data structure for PDF export
 */
export interface PDFCardData {
  position: number;
  positionLabel: string | null;
  positionLabelTh: string | null;
  isReversed: boolean;
  card: {
    name: string;
    nameTh: string;
    imageUrl: string;
    meaningUpright: string;
    meaningReversed: string;
    keywordsUpright: string[];
    keywordsReversed: string[];
    advice: string;
  };
}

/**
 * Reading data structure for PDF export
 */
export interface PDFReadingData {
  id: string;
  readingType: string;
  readingTypeTh: string;
  question: string | null;
  createdAt: string;
  cards: PDFCardData[];
  spreadType?: string;
  notes?: string | null;
}

/**
 * PDF generation options
 */
export interface PDFGenerationOptions {
  includeInterpretations?: boolean;
  includeKeywords?: boolean;
  includeAdvice?: boolean;
  includeNotes?: boolean;
  includeBranding?: boolean;
}

/**
 * PDF generation result
 */
export interface PDFGenerationResult {
  success: boolean;
  blob?: Blob;
  filename?: string;
  error?: string;
}
