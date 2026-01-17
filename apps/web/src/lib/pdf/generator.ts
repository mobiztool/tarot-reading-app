/**
 * Story 9.3: Reading Export to PDF
 * PDF generation service using jsPDF with Thai font support
 * 
 * CRITICAL: Thai font rendering is essential - uses Sarabun font (OFL license)
 */

import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import type { PDFReadingData, PDFGenerationOptions, PDFGenerationResult } from './types';

// Thai-safe font configuration
// Using standard PDF font with extended character support
const FONT_CONFIG = {
  title: { size: 24, style: 'bold' as const },
  subtitle: { size: 14, style: 'normal' as const },
  heading: { size: 16, style: 'bold' as const },
  body: { size: 11, style: 'normal' as const },
  small: { size: 9, style: 'normal' as const },
};

// Brand colors (approximated for PDF - RGB values)
const COLORS = {
  primary: [139, 92, 246] as [number, number, number], // Purple
  secondary: [236, 72, 153] as [number, number, number], // Pink
  accent: [251, 191, 36] as [number, number, number], // Amber
  text: [30, 41, 59] as [number, number, number], // Slate 800
  textLight: [100, 116, 139] as [number, number, number], // Slate 500
  background: [248, 250, 252] as [number, number, number], // Slate 50
  white: [255, 255, 255] as [number, number, number],
  border: [226, 232, 240] as [number, number, number], // Slate 200
};

// Position labels Thai translation
const POSITION_LABELS_TH: Record<string, string> = {
  past: 'อดีต',
  present: 'ปัจจุบัน',
  future: 'อนาคต',
  situation: 'สถานการณ์',
  challenge: 'ความท้าทาย',
  advice: 'คำแนะนำ',
  outcome: 'ผลลัพธ์',
  you: 'ตัวคุณ',
  partner: 'คู่ของคุณ',
  relationship: 'ความสัมพันธ์',
  yes: 'ใช่',
  no: 'ไม่ใช่',
  maybe: 'อาจจะ',
};

// Reading type translations
const READING_TYPES_TH: Record<string, string> = {
  daily: 'ดูดวงประจำวัน',
  three_card: 'ไพ่ 3 ใบ',
  love_relationships: 'ความรัก',
  career_money: 'การงาน/การเงิน',
  yes_no: 'ใช่/ไม่ใช่',
  celtic_cross: 'เซลติก ครอส',
  decision_making: 'ตัดสินใจ',
  self_discovery: 'ค้นหาตัวเอง',
  relationship_deep_dive: 'ความสัมพันธ์เชิงลึก',
  shadow_work: 'Shadow Work',
  chakra_alignment: 'จักระ',
  friendship: 'มิตรภาพ',
  career_path: 'เส้นทางอาชีพ',
  financial_abundance: 'การเงิน',
  monthly_forecast: 'รายเดือน',
  year_ahead: 'ปีหน้า',
  elemental_balance: 'ธาตุ',
  zodiac_wheel: 'จักรราศี',
};

/**
 * Convert image URL to base64 data URL
 */
async function imageToBase64(url: string): Promise<string | null> {
  try {
    // Handle relative URLs
    const absoluteUrl = url.startsWith('http') 
      ? url 
      : `${typeof window !== 'undefined' ? window.location.origin : ''}${url}`;
    
    const response = await fetch(absoluteUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to load image:', url, error);
    return null;
  }
}

/**
 * Load and register Thai font (Sarabun)
 * Uses Google Fonts CDN with fallback
 */
async function loadThaiFont(doc: jsPDF): Promise<boolean> {
  try {
    // Try to load Sarabun font from Google Fonts
    const fontUrl = 'https://fonts.gstatic.com/s/sarabun/v15/DtVjJx26TKEr37c9YHZJmnYI5gnOpg.ttf';
    
    const response = await fetch(fontUrl);
    if (!response.ok) {
      throw new Error('Font fetch failed');
    }
    
    const fontBuffer = await response.arrayBuffer();
    const fontBase64 = btoa(
      new Uint8Array(fontBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    // Add font to jsPDF
    doc.addFileToVFS('Sarabun-Regular.ttf', fontBase64);
    doc.addFont('Sarabun-Regular.ttf', 'Sarabun', 'normal');
    
    return true;
  } catch (error) {
    console.warn('Failed to load Thai font, using fallback:', error);
    return false;
  }
}

/**
 * Draw header section with branding
 */
function drawHeader(
  doc: jsPDF,
  reading: PDFReadingData,
  pageWidth: number,
  margin: number,
  useThaiFont: boolean
): number {
  let yPos = margin;
  const contentWidth = pageWidth - (margin * 2);
  
  // Background gradient effect (simplified as solid color band)
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Title
  if (useThaiFont) {
    doc.setFont('Sarabun', 'normal');
  }
  doc.setFontSize(FONT_CONFIG.title.size);
  doc.setTextColor(...COLORS.white);
  
  const titleText = 'Mystic Tarot - ไพ่ทาโร่ต์';
  doc.text(titleText, pageWidth / 2, yPos + 15, { align: 'center' });
  
  // Subtitle - Reading type
  doc.setFontSize(FONT_CONFIG.subtitle.size);
  const readingTypeTh = reading.readingTypeTh || READING_TYPES_TH[reading.readingType] || reading.readingType;
  doc.text(readingTypeTh, pageWidth / 2, yPos + 28, { align: 'center' });
  
  yPos = 55;
  
  // Date
  doc.setTextColor(...COLORS.textLight);
  doc.setFontSize(FONT_CONFIG.small.size);
  let formattedDate = '';
  try {
    formattedDate = format(new Date(reading.createdAt), 'd MMMM yyyy HH:mm', { locale: th });
  } catch {
    formattedDate = reading.createdAt;
  }
  doc.text(`วันที่: ${formattedDate}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  // Question (if provided)
  if (reading.question) {
    doc.setFillColor(...COLORS.background);
    doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, 'F');
    
    doc.setTextColor(...COLORS.text);
    doc.setFontSize(FONT_CONFIG.body.size);
    doc.text('คำถาม:', margin + 5, yPos + 8);
    
    doc.setFontSize(FONT_CONFIG.body.size);
    const questionLines = doc.splitTextToSize(reading.question, contentWidth - 20);
    doc.text(questionLines, margin + 5, yPos + 17);
    
    yPos += 30 + (questionLines.length - 1) * 5;
  }
  
  return yPos;
}

/**
 * Draw a single card section
 */
async function drawCard(
  doc: jsPDF,
  card: PDFReadingData['cards'][0],
  xPos: number,
  yPos: number,
  cardWidth: number,
  options: PDFGenerationOptions,
  useThaiFont: boolean
): Promise<number> {
  const startY = yPos;
  const padding = 5;
  
  // Card container
  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.5);
  
  // Position label
  if (card.positionLabel || card.positionLabelTh) {
    const posLabelTh = card.positionLabelTh || POSITION_LABELS_TH[card.positionLabel || ''] || card.positionLabel;
    doc.setFillColor(...COLORS.primary);
    doc.roundedRect(xPos, yPos, cardWidth, 12, 2, 2, 'F');
    
    if (useThaiFont) {
      doc.setFont('Sarabun', 'normal');
    }
    doc.setFontSize(FONT_CONFIG.small.size);
    doc.setTextColor(...COLORS.white);
    doc.text(posLabelTh || '', xPos + cardWidth / 2, yPos + 8, { align: 'center' });
    yPos += 15;
  }
  
  // Card image
  const imageBase64 = await imageToBase64(card.card.imageUrl);
  if (imageBase64) {
    const imgWidth = cardWidth - 20;
    const imgHeight = imgWidth * 1.5; // Tarot card aspect ratio
    doc.addImage(imageBase64, 'JPEG', xPos + 10, yPos, imgWidth, imgHeight);
    
    // Reversed indicator
    if (card.isReversed) {
      doc.setFillColor(...COLORS.secondary);
      doc.roundedRect(xPos + 10, yPos + imgHeight - 10, imgWidth, 10, 0, 0, 'F');
      doc.setTextColor(...COLORS.white);
      doc.setFontSize(7);
      doc.text('กลับหัว (Reversed)', xPos + 10 + imgWidth / 2, yPos + imgHeight - 3, { align: 'center' });
    }
    
    yPos += imgHeight + 5;
  }
  
  // Card name
  if (useThaiFont) {
    doc.setFont('Sarabun', 'normal');
  }
  doc.setFontSize(FONT_CONFIG.heading.size - 2);
  doc.setTextColor(...COLORS.primary);
  doc.text(card.card.nameTh, xPos + cardWidth / 2, yPos + 5, { align: 'center' });
  
  doc.setFontSize(FONT_CONFIG.small.size);
  doc.setTextColor(...COLORS.textLight);
  doc.text(card.card.name, xPos + cardWidth / 2, yPos + 12, { align: 'center' });
  
  yPos += 18;
  
  return yPos - startY;
}

/**
 * Draw card interpretations section
 */
function drawInterpretations(
  doc: jsPDF,
  cards: PDFReadingData['cards'],
  yPos: number,
  pageWidth: number,
  margin: number,
  options: PDFGenerationOptions,
  useThaiFont: boolean
): number {
  const contentWidth = pageWidth - (margin * 2);
  
  // Section title
  doc.setFillColor(...COLORS.primary);
  doc.rect(margin, yPos, contentWidth, 10, 'F');
  
  if (useThaiFont) {
    doc.setFont('Sarabun', 'normal');
  }
  doc.setFontSize(FONT_CONFIG.heading.size - 2);
  doc.setTextColor(...COLORS.white);
  doc.text('คำทำนาย', margin + 5, yPos + 7);
  
  yPos += 15;
  
  for (const card of cards) {
    // Check if we need a new page
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }
    
    // Card name header
    doc.setFillColor(...COLORS.background);
    doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F');
    
    doc.setFontSize(FONT_CONFIG.body.size);
    doc.setTextColor(...COLORS.primary);
    const headerText = `${card.card.nameTh} (${card.card.name})${card.isReversed ? ' - กลับหัว' : ''}`;
    doc.text(headerText, margin + 5, yPos + 8);
    yPos += 16;
    
    // Keywords
    if (options.includeKeywords !== false) {
      const keywords = card.isReversed ? card.card.keywordsReversed : card.card.keywordsUpright;
      if (keywords && keywords.length > 0) {
        doc.setFontSize(FONT_CONFIG.small.size);
        doc.setTextColor(...COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
        doc.text(`คำสำคัญ: ${keywords.join(', ')}`, margin + 5, yPos + 4);
        yPos += 10;
      }
    }
    
    // Meaning
    if (options.includeInterpretations !== false) {
      const meaning = card.isReversed ? card.card.meaningReversed : card.card.meaningUpright;
      if (meaning) {
        doc.setFontSize(FONT_CONFIG.body.size);
        doc.setTextColor(...COLORS.text);
        const meaningLines = doc.splitTextToSize(meaning, contentWidth - 10);
        doc.text(meaningLines, margin + 5, yPos + 5);
        yPos += meaningLines.length * 5 + 8;
      }
    }
    
    // Advice
    if (options.includeAdvice !== false && card.card.advice) {
      doc.setFontSize(FONT_CONFIG.small.size);
      doc.setTextColor(...COLORS.textLight);
      const adviceLines = doc.splitTextToSize(`คำแนะนำ: ${card.card.advice}`, contentWidth - 10);
      doc.text(adviceLines, margin + 5, yPos + 4);
      yPos += adviceLines.length * 4 + 10;
    }
    
    yPos += 5;
  }
  
  return yPos;
}

/**
 * Draw footer with branding
 */
function drawFooter(
  doc: jsPDF,
  pageWidth: number,
  pageHeight: number,
  useThaiFont: boolean
): void {
  const footerY = pageHeight - 15;
  
  doc.setFillColor(...COLORS.background);
  doc.rect(0, footerY - 5, pageWidth, 20, 'F');
  
  doc.setFontSize(FONT_CONFIG.small.size);
  doc.setTextColor(...COLORS.textLight);
  
  if (useThaiFont) {
    doc.setFont('Sarabun', 'normal');
  }
  
  doc.text('Mystic Tarot - ไพ่ทาโร่ต์ออนไลน์', pageWidth / 2, footerY, { align: 'center' });
  doc.text('mystictarot.app', pageWidth / 2, footerY + 5, { align: 'center' });
}

/**
 * Generate PDF from reading data
 * Main entry point for PDF generation
 */
export async function generateReadingPDF(
  reading: PDFReadingData,
  options: PDFGenerationOptions = {}
): Promise<PDFGenerationResult> {
  try {
    // Initialize PDF document (A4 size)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    
    // Try to load Thai font
    const useThaiFont = await loadThaiFont(doc);
    
    // Draw header
    let yPos = drawHeader(doc, reading, pageWidth, margin, useThaiFont);
    
    // Calculate card layout based on number of cards
    const cardCount = reading.cards.length;
    const contentWidth = pageWidth - (margin * 2);
    
    let cardsPerRow: number;
    let cardWidth: number;
    
    if (cardCount === 1) {
      cardsPerRow = 1;
      cardWidth = 80;
    } else if (cardCount <= 3) {
      cardsPerRow = cardCount;
      cardWidth = (contentWidth - (cardsPerRow - 1) * 5) / cardsPerRow;
    } else if (cardCount <= 6) {
      cardsPerRow = 3;
      cardWidth = (contentWidth - 10) / 3;
    } else {
      cardsPerRow = 4;
      cardWidth = (contentWidth - 15) / 4;
    }
    
    // Draw cards
    let maxCardHeight = 0;
    let cardIndex = 0;
    
    for (let row = 0; row < Math.ceil(cardCount / cardsPerRow); row++) {
      // Check if we need a new page
      if (yPos > 180) {
        doc.addPage();
        yPos = 20;
      }
      
      const rowCards = reading.cards.slice(cardIndex, cardIndex + cardsPerRow);
      const rowStartX = margin + (contentWidth - (rowCards.length * cardWidth + (rowCards.length - 1) * 5)) / 2;
      
      const cardPromises = rowCards.map((card, i) => {
        const xPos = rowStartX + i * (cardWidth + 5);
        return drawCard(doc, card, xPos, yPos, cardWidth, options, useThaiFont);
      });
      
      const cardHeights = await Promise.all(cardPromises);
      maxCardHeight = Math.max(...cardHeights);
      
      yPos += maxCardHeight + 10;
      cardIndex += cardsPerRow;
    }
    
    // Draw interpretations
    if (options.includeInterpretations !== false) {
      yPos = drawInterpretations(doc, reading.cards, yPos, pageWidth, margin, options, useThaiFont);
    }
    
    // Draw notes if included
    if (options.includeNotes && reading.notes) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFillColor(...COLORS.background);
      doc.roundedRect(margin, yPos, contentWidth, 30, 3, 3, 'F');
      
      if (useThaiFont) {
        doc.setFont('Sarabun', 'normal');
      }
      doc.setFontSize(FONT_CONFIG.body.size);
      doc.setTextColor(...COLORS.text);
      doc.text('บันทึกส่วนตัว:', margin + 5, yPos + 8);
      
      const notesLines = doc.splitTextToSize(reading.notes, contentWidth - 10);
      doc.text(notesLines, margin + 5, yPos + 16);
    }
    
    // Draw footer on all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      drawFooter(doc, pageWidth, pageHeight, useThaiFont);
      
      // Page number
      doc.setFontSize(FONT_CONFIG.small.size);
      doc.setTextColor(...COLORS.textLight);
      doc.text(`${i} / ${totalPages}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
    }
    
    // Generate filename
    let dateStr = '';
    try {
      dateStr = format(new Date(reading.createdAt), 'yyyy-MM-dd');
    } catch {
      dateStr = new Date().toISOString().split('T')[0];
    }
    const filename = `Tarot-Reading-${dateStr}.pdf`;
    
    // Get PDF blob
    const blob = doc.output('blob');
    
    return {
      success: true,
      blob,
      filename,
    };
  } catch (error) {
    console.error('PDF generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้าง PDF',
    };
  }
}

/**
 * Download PDF directly in browser
 */
export async function downloadReadingPDF(
  reading: PDFReadingData,
  options: PDFGenerationOptions = {}
): Promise<PDFGenerationResult> {
  const result = await generateReadingPDF(reading, options);
  
  if (result.success && result.blob && result.filename) {
    // Create download link
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  return result;
}
