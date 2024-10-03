// The current version of PHPWord supports
// Microsoft Office Open XML (OOXML or OpenXML),
// OASIS Open Document Format for Office Applications (OpenDocument or ODF),
// Rich Text Format (RTF),
// HTML,
// and PDF.

export default [
  // Microsoft Office Open XML (OOXML or OpenXML)
  // document
  {
    extension: '.docx',
    'mime-type':
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  {
    extension: '.doc',
    'mime-type': 'application/msword'
  },
  {
    extension: '.docm',
    'mime-type': 'application/vnd.ms-word.document.macroEnabled.12'
  },
  {
    extension: '.dotx',
    'mime-type':
      'application/vnd.openxmlformats-officedocument.wordprocessingml.template'
  },
  {
    extension: '.dotm',
    'mime-type': 'application/vnd.ms-word.template.macroEnabled.12'
  },
  {
    extension: '.dotm',
    'mime-type': 'application/vnd.ms-word.template.macroEnabled.12'
  },
  // spreadsheet
  {
    extension: '.xlsx',
    'mime-type':
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },
  {
    extension: '.csv',
    'mime-type':
      'text/csv'
  },
  {
    extension: '.xlsm',
    'mime-type': 'application/vnd.ms-excel.sheet.macroEnabled.12'
  },
  {
    extension: '.xltx',
    'mime-type':
      'application/vnd.openxmlformats-officedocument.spreadsheetml.template'
  },
  {
    extension: '.xltm',
    'mime-type': 'application/vnd.ms-excel.template.macroEnabled.12'
  },
  {
    extension: '.xlsb',
    'mime-type': 'application/vnd.ms-excel.sheet.binary.macroEnabled.12'
  },
  {
    extension: '.xlam',
    'mime-type': 'application/vnd.ms-excel.addin.macroEnabled.12'
  },
  // power point
  {
    extension: '.pptx',
    'mime-type':
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  },
  {
    extension: '.pptm',
    'mime-type': 'application/vnd.ms-powerpoint.presentation.macroEnabled.12'
  },
  {
    extension: '.ppsx',
    'mime-type':
      'application/vnd.openxmlformats-officedocument.presentationml.slideshow'
  },
  {
    extension: '.ppsm',
    'mime-type': 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12'
  },
  {
    extension: '.potx',
    'mime-type':
      'application/vnd.openxmlformats-officedocument.presentationml.template'
  },
  {
    extension: '.potm',
    'mime-type': 'application/vnd.ms-powerpoint.template.macroEnabled.12'
  },
  {
    extension: '.ppam',
    'mime-type': 'application/vnd.ms-powerpoint.addin.macroEnabled.12'
  },
  {
    extension: '.sldx',
    'mime-type':
      'application/vnd.openxmlformats-officedocument.presentationml.slide'
  },
  {
    extension: '.sldm',
    'mime-type': 'application/vnd.ms-powerpoint.slide.macroEnabled.12'
  },
  // OneNote
  {
    extension: '.onetoc',
    'mime-type': 'application/onenote'
  },
  {
    extension: '.onetoc2',
    'mime-type': 'application/onenote'
  },
  {
    extension: '.onetmp',
    'mime-type': 'application/onenote'
  },
  {
    extension: '.onepkg',
    'mime-type': 'application/onenote'
  },

  // OASIS Open Document Format for Office Applications (OpenDocument or ODF)
  {
    extension: '.odt',
    'mime-type': 'application/vnd.oasis.opendocument.text'
  },
  {
    extension: '.ott',
    'mime-type': 'application/vnd.oasis.opendocument.text-template'
  },
  {
    extension: '.odg',
    'mime-type': 'application/vnd.oasis.opendocument.graphics'
  },
  {
    extension: '.otg',
    'mime-type': 'application/vnd.oasis.opendocument.graphics-template'
  },
  {
    extension: '.odp',
    'mime-type': 'application/vnd.oasis.opendocument.presentation'
  },
  {
    extension: '.otp',
    'mime-type': 'application/vnd.oasis.opendocument.presentation-template'
  },
  {
    extension: '.ods',
    'mime-type': 'application/vnd.oasis.opendocument.spreadsheet'
  },
  {
    extension: '.ots',
    'mime-type': 'application/vnd.oasis.opendocument.spreadsheet-template'
  },
  {
    extension: '.odc',
    'mime-type': 'application/vnd.oasis.opendocument.chart'
  },
  {
    extension: '.otc',
    'mime-type': 'application/vnd.oasis.opendocument.chart-template'
  },
  {
    extension: '.odi',
    'mime-type': 'application/vnd.oasis.opendocument.image'
  },
  {
    extension: '.oti',
    'mime-type': 'application/vnd.oasis.opendocument.image-template'
  },
  {
    extension: '.odf',
    'mime-type': 'application/vnd.oasis.opendocument.formula'
  },
  {
    extension: '.otf',
    'mime-type': 'application/vnd.oasis.opendocument.formula-template'
  },
  {
    extension: '.odm',
    'mime-type': 'application/vnd.oasis.opendocument.text-master'
  },
  {
    extension: '.oth',
    'mime-type': 'application/vnd.oasis.opendocument.text-web'
  },
  // Rich Text Format (RTF)
  {
    extension: '.rtf',
    'mime-type': 'application/rtf'
  },
  // HTML
  {
    extension: '.html',
    'mime-type': 'text/html'
  },
  // PDF
  {
    extension: '.pdf',
    'mime-type': 'application/pdf'
  },
  // tex
  {
    extension: '.tex',
    'mime-type': 'application/octet-stream'
  }
];

export const pdfMediaTypes = ['application/pdf'];

export const docMediaTypes = [
  'text/html',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const docMediaTypesPreview = [];

export const docMediaTypesContent = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword'
];
export const docMediaWithoutPreview = ['odt', 'tex', 'epub', 'doc'];
