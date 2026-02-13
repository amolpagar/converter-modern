export type ToolCategory = 'converter' | 'formatter' | 'decoder' | 'utility';
export type ToolLayout = 'converter' | 'formatter' | 'compare' | 'encoder';

export interface ToolConfig {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  seoDescription: string;
  category: ToolCategory;
  layout: ToolLayout;
  inputLanguage: string;
  outputLanguage: string;
  inputPlaceholder: string;
  outputPlaceholder: string;
  icon: string; // Lucide icon name
  gradient: string; // Tailwind gradient classes
  keywords: string[];
  /** If true, conversion happens on the server via API route */
  serverSide?: boolean;
  /** API endpoint for server-side conversion */
  apiEndpoint?: string;
  /** Whether the tool supports bidirectional conversion */
  bidirectional?: boolean;
  /** Show minify button */
  showMinify?: boolean;
  /** Show indent selector */
  showIndent?: boolean;
  /** Related tool IDs */
  relatedTools: string[];
  /** SEO FAQ for structured data */
  faqs: Array<{ question: string; answer: string }>;
}

export const tools: Record<string, ToolConfig> = {
  // ─── Converters ─────────────────────────────────────────────

  'xml-to-json': {
    id: 'xml-to-json',
    title: 'XML to JSON Converter Online — Free',
    shortTitle: 'XML → JSON',
    description: 'Convert XML data to JSON format instantly. Supports attributes, nested elements, and preserves data types.',
    seoDescription: 'Free online XML to JSON converter. Convert XML to JSON instantly with proper attribute handling, nested element support, and data type preservation. No sign-up, runs in your browser. Transform XML documents to JSON format for APIs, JavaScript, and data processing.',
    category: 'converter',
    layout: 'converter',
    inputLanguage: 'xml',
    outputLanguage: 'json',
    inputPlaceholder: `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title lang="en">The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price>10.99</price>
  </book>
</bookstore>`,
    outputPlaceholder: 'Converted JSON will appear here...',
    icon: 'FileJson',
    gradient: 'from-orange-500 to-red-500',
    keywords: ['xml to json', 'xml to json converter', 'convert xml to json', 'xml to json online', 'xml to json converter online free', 'xml parser', 'xml to json transformer', 'xml json converter'],
    showIndent: true,
    relatedTools: ['json-to-xml', 'yaml-to-json', 'format-json', 'json-to-csv'],
    faqs: [
      { question: 'How do I convert XML to JSON online?', answer: 'Simply paste your XML into the input box and the converter instantly transforms it to JSON format. No installation or sign-up required — everything runs in your browser.' },
      { question: 'Are XML attributes preserved in the JSON output?', answer: 'Yes, XML attributes are preserved with an @_ prefix in the JSON output to distinguish them from child elements, ensuring no data is lost during conversion.' },
      { question: 'Is it safe to convert XML to JSON online?', answer: 'Absolutely. Our XML to JSON converter runs 100% in your browser. Your data never leaves your device — no server processing, no data storage, complete privacy.' },
      { question: 'Can I convert large XML files to JSON?', answer: 'Yes, our converter handles large XML documents efficiently using client-side processing. There are no file size limits imposed by our tool.' },
    ],
  },

  'json-to-xml': {
    id: 'json-to-xml',
    title: 'JSON to XML Converter Online — Free',
    shortTitle: 'JSON → XML',
    description: 'Convert JSON data to XML format with proper formatting and structure.',
    seoDescription: 'Free online JSON to XML converter. Transform JSON objects to well-formed XML documents instantly. Convert JSON to XML with proper formatting, encoding, and structure. No sign-up required.',
    category: 'converter',
    layout: 'converter',
    inputLanguage: 'json',
    outputLanguage: 'xml',
    inputPlaceholder: `{
  "bookstore": {
    "book": {
      "@_category": "fiction",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "year": 1925,
      "price": 10.99
    }
  }
}`,
    outputPlaceholder: 'Converted XML will appear here...',
    icon: 'FileCode',
    gradient: 'from-blue-500 to-cyan-500',
    keywords: ['json to xml', 'json to xml converter', 'convert json to xml', 'json to xml online', 'json to xml converter online free', 'json xml converter', 'json to xml transformer'],
    showIndent: true,
    relatedTools: ['xml-to-json', 'json-to-yaml', 'format-xml', 'json-to-csv'],
    faqs: [
      { question: 'How do I convert JSON to XML online?', answer: 'Paste your JSON data into the input box and our converter instantly generates well-formed XML output. No download or account needed.' },
      { question: 'How are JSON arrays converted to XML?', answer: 'JSON arrays are converted to repeated XML elements with the same tag name, preserving the order of items.' },
      { question: 'Does the output include an XML declaration?', answer: 'Yes, the converted XML includes a standard XML declaration header with UTF-8 encoding for maximum compatibility.' },
    ],
  },

  'yaml-to-json': {
    id: 'yaml-to-json',
    title: 'YAML to JSON Converter Online — Free',
    shortTitle: 'YAML → JSON',
    description: 'Convert YAML documents to JSON format with proper type inference.',
    seoDescription: 'Free online YAML to JSON converter. Transform YAML configuration files to JSON format instantly. Supports anchors, aliases, and all YAML 1.2 features. Perfect for Kubernetes, Docker, and CI/CD workflows.',
    category: 'converter',
    layout: 'converter',
    inputLanguage: 'yaml',
    outputLanguage: 'json',
    inputPlaceholder: `# Application Configuration
server:
  host: localhost
  port: 8080
  debug: true

database:
  driver: postgresql
  host: db.example.com
  port: 5432
  name: myapp
  credentials:
    username: admin
    password: secret123

features:
  - authentication
  - logging
  - caching`,
    outputPlaceholder: 'Converted JSON will appear here...',
    icon: 'FileText',
    gradient: 'from-green-500 to-emerald-500',
    keywords: ['yaml to json', 'yaml to json converter', 'convert yaml to json', 'yaml to json online', 'yaml to json converter online', 'yaml parser', 'yml to json', 'yaml json'],
    showIndent: true,
    relatedTools: ['json-to-yaml', 'xml-to-json', 'format-json', 'csv-to-json'],
    faqs: [
      { question: 'How do I convert YAML to JSON?', answer: 'Paste your YAML content into the input box. Our converter parses the YAML and outputs valid JSON instantly in your browser. Supports YAML 1.2 spec.' },
      { question: 'Does this handle YAML anchors and aliases?', answer: 'Yes, YAML anchors (&) and aliases (*) are fully resolved during conversion to produce valid JSON output.' },
      { question: 'Can I convert Kubernetes YAML to JSON?', answer: 'Absolutely. Our converter handles complex Kubernetes, Docker Compose, and CI/CD configuration YAML files with proper type inference.' },
      { question: 'Are YAML comments preserved?', answer: 'JSON does not support comments, so YAML comments are stripped during conversion. The data structure is fully preserved.' },
    ],
  },

  'json-to-yaml': {
    id: 'json-to-yaml',
    title: 'JSON to YAML Converter Online — Free',
    shortTitle: 'JSON → YAML',
    description: 'Convert JSON data to clean, human-readable YAML format.',
    seoDescription: 'Free online JSON to YAML converter. Transform JSON data into clean, human-readable YAML configuration format. Perfect for Kubernetes, Docker Compose, and CI/CD config files. No sign-up required.',
    category: 'converter',
    layout: 'converter',
    inputLanguage: 'json',
    outputLanguage: 'yaml',
    inputPlaceholder: `{
  "server": {
    "host": "localhost",
    "port": 8080,
    "debug": true
  },
  "database": {
    "driver": "postgresql",
    "host": "db.example.com",
    "port": 5432
  },
  "features": ["authentication", "logging", "caching"]
}`,
    outputPlaceholder: 'Converted YAML will appear here...',
    icon: 'FileText',
    gradient: 'from-emerald-500 to-teal-500',
    keywords: ['json to yaml', 'json to yaml converter', 'convert json to yaml', 'json to yaml online', 'json to yml', 'json yaml converter', 'json to yaml converter online'],
    relatedTools: ['yaml-to-json', 'json-to-xml', 'format-json', 'json-to-csv'],
    faqs: [
      { question: 'Is the YAML output valid for Kubernetes configs?', answer: 'Yes, the YAML output follows the YAML 1.2 spec and is compatible with Kubernetes, Docker Compose, Ansible, and other DevOps tools.' },
      { question: 'How are JSON arrays converted to YAML?', answer: 'JSON arrays are converted to YAML sequences using the dash (-) notation, maintaining the order of elements.' },
      { question: 'Can I convert JSON API responses to YAML?', answer: 'Yes, paste any valid JSON — including API responses — and get clean YAML output instantly. Great for creating configuration files from API data.' },
    ],
  },

  'html-to-pug': {
    id: 'html-to-pug',
    title: 'HTML to Pug (Jade) Converter Online',
    shortTitle: 'HTML → Pug',
    description: 'Convert HTML markup to clean Pug (Jade) template syntax.',
    seoDescription: 'Free online HTML to Pug (Jade) converter. Transform HTML documents into concise Pug template syntax. Perfect for Express.js and Node.js projects. Also known as HTML to Jade converter.',
    category: 'converter',
    layout: 'converter',
    inputLanguage: 'html',
    outputLanguage: 'text',
    inputPlaceholder: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hello World</title>
</head>
<body>
  <div class="container">
    <h1 id="title">Hello World</h1>
    <p class="description">
      This is a sample HTML document.
    </p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
</body>
</html>`,
    outputPlaceholder: 'Converted Pug template will appear here...',
    icon: 'Code',
    gradient: 'from-amber-500 to-orange-500',
    keywords: ['html to pug', 'html to jade', 'html to pug converter', 'html to jade converter', 'convert html to pug', 'pug template', 'jade template converter'],
    serverSide: true,
    apiEndpoint: '/api/convert/html-to-pug',
    relatedTools: ['pug-to-html', 'format-html', 'html-to-markdown'],
    faqs: [
      { question: 'What is Pug (Jade)?', answer: 'Pug (formerly Jade) is a high-performance template engine for Node.js and browsers. It uses indentation-based syntax instead of closing tags, resulting in cleaner, more concise templates.' },
      { question: 'Why convert HTML to Pug?', answer: 'Pug provides cleaner, more concise template syntax that is easier to read and maintain in Node.js/Express projects. It reduces boilerplate and improves developer productivity.' },
      { question: 'Is Pug the same as Jade?', answer: 'Yes, Pug was renamed from Jade due to a trademark issue. The syntax and functionality remain the same. Our converter supports both naming conventions.' },
    ],
  },

  'pug-to-html': {
    id: 'pug-to-html',
    title: 'Pug (Jade) to HTML Converter Online',
    shortTitle: 'Pug → HTML',
    description: 'Compile Pug (Jade) templates to standard HTML markup.',
    seoDescription: 'Free online Pug (Jade) to HTML converter. Compile Pug templates into standard HTML markup instantly. Preview your Pug templates as HTML. Also works as Jade to HTML converter.',
    category: 'converter',
    layout: 'converter',
    inputLanguage: 'text',
    outputLanguage: 'html',
    inputPlaceholder: `doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    title Hello World
  body
    .container
      h1#title Hello World
      p.description.
        This is a sample Pug template.
      ul
        li Item 1
        li Item 2
        li Item 3`,
    outputPlaceholder: 'Compiled HTML will appear here...',
    icon: 'FileCode2',
    gradient: 'from-rose-500 to-pink-500',
    keywords: ['pug to html', 'jade to html', 'pug to html converter', 'jade to html converter', 'compile pug', 'pug compiler online', 'pug preview'],
    serverSide: true,
    apiEndpoint: '/api/convert/pug-to-html',
    relatedTools: ['html-to-pug', 'format-html', 'markdown-to-html'],
    faqs: [
      { question: 'Does this support Pug mixins and includes?', answer: 'Yes, basic Pug features including mixins, conditionals, and iteration are supported during compilation.' },
      { question: 'Can I use Pug variables?', answer: 'Static Pug templates are compiled directly. Dynamic variables would need default values or be rendered as template expressions in the output.' },
    ],
  },

  'json-to-schema': {
    id: 'json-to-schema',
    title: 'JSON Schema Generator Online — Free',
    shortTitle: 'JSON → Schema',
    description: 'Generate a JSON Schema definition from a sample JSON document.',
    seoDescription: 'Free online JSON Schema generator. Automatically generate JSON Schema from sample JSON data. Supports Draft-07 with type inference for strings, numbers, booleans, arrays, and objects. Validate your APIs instantly.',
    category: 'converter',
    layout: 'converter',
    inputLanguage: 'json',
    outputLanguage: 'json',
    inputPlaceholder: `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  },
  "tags": ["developer", "designer"]
}`,
    outputPlaceholder: 'Generated JSON Schema will appear here...',
    icon: 'Braces',
    gradient: 'from-violet-500 to-purple-500',
    keywords: ['json schema generator', 'generate json schema', 'json to json schema', 'json schema from json', 'json schema generator online', 'json schema creator', 'json schema draft 07', 'create json schema'],
    showIndent: true,
    relatedTools: ['format-json', 'json-to-typescript', 'json-to-yaml', 'json-to-csv'],
    faqs: [
      { question: 'Which JSON Schema draft is generated?', answer: 'Our generator creates schemas compatible with JSON Schema Draft-07, the most widely adopted version for API validation.' },
      { question: 'How are types inferred from JSON?', answer: 'Types are automatically detected from sample values: strings, numbers (integer vs float), booleans, arrays (with item type detection), and nested objects.' },
      { question: 'Can I use the generated schema for API validation?', answer: 'Yes, the generated schema is valid JSON Schema Draft-07 and works with validators like Ajv, json-schema-validator, and OpenAPI/Swagger.' },
    ],
  },

  'json-to-ion': {
    id: 'json-to-ion',
    title: 'JSON to Amazon ION Converter',
    shortTitle: 'JSON → ION',
    description: 'Convert JSON data to Amazon ION text format.',
    seoDescription: 'Free online JSON to Amazon ION converter. Transform JSON to ION text format used by AWS services like DynamoDB and QLDB. Convert JSON data to Amazon Ion format instantly.',
    category: 'converter',
    layout: 'converter',
    inputLanguage: 'json',
    outputLanguage: 'text',
    inputPlaceholder: `{
  "name": "John Doe",
  "age": 30,
  "isEmployee": true,
  "salary": 75000.50,
  "department": null,
  "skills": ["JavaScript", "Python", "AWS"],
  "address": {
    "city": "Seattle",
    "state": "WA"
  }
}`,
    outputPlaceholder: 'Converted ION text will appear here...',
    icon: 'Atom',
    gradient: 'from-cyan-500 to-blue-500',
    keywords: ['json to ion', 'amazon ion', 'json to amazon ion', 'ion format', 'aws ion converter', 'dynamodb ion', 'qldb ion', 'ion text format'],
    relatedTools: ['json-to-xml', 'json-to-yaml', 'json-to-schema'],
    faqs: [
      { question: 'What is Amazon ION?', answer: 'Amazon ION is a richly-typed, self-describing data serialization format developed by Amazon, used in AWS services like DynamoDB and QLDB.' },
      { question: 'What is the difference between ION text and binary?', answer: 'This tool outputs ION text format which is human-readable. ION also has a compact binary format optimized for storage and network transmission.' },
    ],
  },

  'text-to-json': {
    id: 'text-to-json',
    title: 'Text to JSON Converter Online — Free',
    shortTitle: 'Text → JSON',
    description: 'Convert key-value text mappings to JSON. Supports tab, equals, colon, and arrow separators.',
    seoDescription: 'Free online text to JSON converter. Convert key-value pairs, configuration files, and .env files to JSON format with automatic type detection. Supports tab, equals, colon, and arrow separators.',
    category: 'converter',
    layout: 'converter',
    inputLanguage: 'text',
    outputLanguage: 'json',
    inputPlaceholder: `name = John Doe
age = 30
isActive = true
email = john@example.com
score = 95.5
city = New York
registered = 2024-01-15
role = admin`,
    outputPlaceholder: 'Converted JSON will appear here...',
    icon: 'TextCursorInput',
    gradient: 'from-fuchsia-500 to-pink-500',
    keywords: ['text to json', 'text to json converter', 'convert text to json', 'string to json', 'text to json online', 'key value to json', 'env to json', 'properties to json'],
    showIndent: true,
    relatedTools: ['yaml-to-json', 'csv-to-json', 'xml-to-json', 'format-json'],
    faqs: [
      { question: 'What text separators are supported?', answer: 'Tab, equals (=), colon (:), and arrow (=>) separators are all supported. The converter auto-detects the separator from your input.' },
      { question: 'Are data types automatically detected?', answer: 'Yes, numbers, booleans (true/false), null values, and dates are automatically detected and converted to appropriate JSON types.' },
      { question: 'Can I convert .env files to JSON?', answer: 'Yes, .env files use key=value format which is automatically parsed. Great for converting environment configurations to JSON.' },
    ],
  },

  'json-to-csv': {
    id: 'json-to-csv',
    title: 'JSON to CSV Converter Online — Free',
    shortTitle: 'JSON → CSV',
    description: 'Convert JSON arrays or objects to CSV format for spreadsheets and data analysis.',
    seoDescription: 'Free online JSON to CSV converter. Transform JSON data to comma-separated values (CSV) for Excel, Google Sheets, and data analysis. Convert JSON arrays to CSV instantly with automatic column detection.',
    category: 'converter',
    layout: 'converter',
    inputLanguage: 'json',
    outputLanguage: 'text',
    inputPlaceholder: `[
  { "name": "Alice", "age": 30, "city": "New York" },
  { "name": "Bob", "age": 25, "city": "London" },
  { "name": "Charlie", "age": 35, "city": "Paris" }
]`,
    outputPlaceholder: 'CSV output will appear here...',
    icon: 'FileSpreadsheet',
    gradient: 'from-green-500 to-teal-500',
    keywords: ['json to csv', 'json to csv converter', 'convert json to csv', 'json to csv online', 'json to csv converter online free', 'json to excel', 'json to spreadsheet', 'json csv'],
    relatedTools: ['csv-to-json', 'format-json', 'json-to-xml', 'json-to-yaml'],
    faqs: [
      { question: 'How do I convert JSON to CSV online?', answer: 'Paste your JSON array into the input box. Our converter automatically detects columns from object keys and generates CSV output with headers.' },
      { question: 'Does this handle nested JSON objects?', answer: 'Yes, nested objects are automatically flattened using dot notation (e.g., address.city) so they fit into CSV columns.' },
      { question: 'Can I open the CSV in Excel or Google Sheets?', answer: 'Absolutely. Copy the output and paste it into a .csv file, or directly into Excel or Google Sheets. The format is fully compatible.' },
      { question: 'What about JSON with mixed keys?', answer: 'The converter handles arrays where objects have different keys by creating a superset of all columns, leaving cells empty where data is missing.' },
    ],
  },

  'csv-to-json': {
    id: 'csv-to-json',
    title: 'CSV to JSON Converter Online — Free',
    shortTitle: 'CSV → JSON',
    description: 'Convert CSV data to a JSON array of objects. Auto-detects data types.',
    seoDescription: 'Free online CSV to JSON converter. Transform comma-separated values (CSV) into structured JSON arrays. Automatic type detection for numbers, booleans, and dates. Convert Excel/spreadsheet data to JSON instantly.',
    category: 'converter',
    layout: 'converter',
    inputLanguage: 'text',
    outputLanguage: 'json',
    inputPlaceholder: `name,age,city,active
Alice,30,New York,true
Bob,25,London,false
Charlie,35,Paris,true`,
    outputPlaceholder: 'Converted JSON will appear here...',
    icon: 'FileSpreadsheet',
    gradient: 'from-teal-500 to-green-500',
    keywords: ['csv to json', 'csv to json converter', 'convert csv to json', 'csv to json online', 'csv to json converter online', 'excel to json', 'spreadsheet to json', 'csv json'],
    showIndent: true,
    relatedTools: ['json-to-csv', 'text-to-json', 'format-json', 'yaml-to-json'],
    faqs: [
      { question: 'How do I convert CSV to JSON online?', answer: 'Paste your CSV data (with headers in the first row) into the input box. Our converter instantly generates a JSON array of objects using headers as keys.' },
      { question: 'Are data types automatically detected?', answer: 'Yes, numbers, booleans, null values, and ISO dates in CSV cells are automatically converted to their proper JSON types instead of strings.' },
      { question: 'Can I convert Excel data to JSON?', answer: 'Yes. Copy cells from Excel or Google Sheets and paste them in. The tab/comma-separated format is automatically detected and converted to JSON.' },
    ],
  },

  'json-to-typescript': {
    id: 'json-to-typescript',
    title: 'JSON to TypeScript Interface Generator',
    shortTitle: 'JSON → TypeScript',
    description: 'Generate TypeScript interfaces from JSON data. Supports nested objects and arrays.',
    seoDescription: 'Free online JSON to TypeScript converter. Automatically generate TypeScript interfaces and types from sample JSON data. Convert JSON to TypeScript interfaces instantly. Save hours of manual type definition.',
    category: 'converter',
    layout: 'converter',
    inputLanguage: 'json',
    outputLanguage: 'javascript',
    inputPlaceholder: `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "scores": [95, 87, 92],
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "zipCode": "12345"
  },
  "tags": ["developer", "designer"]
}`,
    outputPlaceholder: 'Generated TypeScript interfaces will appear here...',
    icon: 'FileType',
    gradient: 'from-blue-600 to-blue-400',
    keywords: ['json to typescript', 'json to typescript interface', 'json to ts', 'json to type', 'json to typescript converter', 'generate typescript from json', 'json to typescript online', 'typescript interface generator', 'json2ts'],
    relatedTools: ['json-to-go', 'json-to-schema', 'format-json', 'json-to-csv'],
    faqs: [
      { question: 'How do I generate TypeScript interfaces from JSON?', answer: 'Paste your JSON data into the input box. Our tool automatically infers types and generates clean TypeScript interfaces, including nested objects and arrays.' },
      { question: 'How are nested objects handled?', answer: 'Nested objects are extracted into separate named interfaces. Interface names are derived from property names in PascalCase (e.g., address becomes Address).' },
      { question: 'Does this support arrays and optional fields?', answer: 'Yes, arrays are typed based on element types (e.g., number[] or string[]). Empty arrays are typed as unknown[]. All fields from the sample are generated as required.' },
      { question: 'Can I use this for API response types?', answer: 'Absolutely. Paste an API response JSON and get ready-to-use TypeScript interfaces for your frontend application.' },
    ],
  },

  'json-to-go': {
    id: 'json-to-go',
    title: 'JSON to Go Struct Converter Online',
    shortTitle: 'JSON → Go',
    description: 'Generate Go structs with JSON tags from sample JSON data.',
    seoDescription: 'Free online JSON to Go struct converter. Generate Go structs with proper json tags from sample JSON data. Convert JSON to Golang struct instantly. Supports nested objects, arrays, and all Go types.',
    category: 'converter',
    layout: 'converter',
    inputLanguage: 'json',
    outputLanguage: 'text',
    inputPlaceholder: `{
  "user_id": 42,
  "username": "gopher",
  "email": "gopher@golang.org",
  "is_admin": false,
  "score": 98.5,
  "tags": ["go", "backend"],
  "profile": {
    "bio": "I love Go",
    "avatar_url": "https://example.com/avatar.png"
  }
}`,
    outputPlaceholder: 'Generated Go structs will appear here...',
    icon: 'Code',
    gradient: 'from-cyan-500 to-sky-500',
    keywords: ['json to go', 'json to go struct', 'json to golang', 'json-to-go', 'json to go converter', 'json to go struct generator', 'go struct generator', 'golang struct from json', 'json2go'],
    relatedTools: ['json-to-typescript', 'json-to-schema', 'format-json', 'json-to-csv'],
    faqs: [
      { question: 'How do I convert JSON to Go structs?', answer: 'Paste your JSON data into the input. Our converter generates Go struct definitions with proper json:"..." tags, PascalCase field names, and correct Go types.' },
      { question: 'Are json struct tags included?', answer: 'Yes, every field includes a json:"field_name" struct tag matching the original JSON key name for seamless marshaling/unmarshaling.' },
      { question: 'How are Go types inferred?', answer: 'Strings map to string, integers to int, decimals to float64, booleans to bool, null to interface{}, and nested objects generate separate struct types.' },
    ],
  },

  'markdown-to-html': {
    id: 'markdown-to-html',
    title: 'Markdown to HTML Converter Online — Free',
    shortTitle: 'MD → HTML',
    description: 'Convert Markdown documents to clean, semantic HTML markup.',
    seoDescription: 'Free online Markdown to HTML converter. Transform Markdown syntax into clean, semantic HTML markup. Supports GitHub Flavored Markdown (GFM) with tables, task lists, code blocks, and more. Convert MD to HTML instantly.',
    category: 'converter',
    layout: 'converter',
    inputLanguage: 'text',
    outputLanguage: 'html',
    inputPlaceholder: `# Hello World

This is a **bold** statement and this is *italic*.

## Features

- Fast conversion
- Privacy first
- No sign-up required

### Code Example

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

> This is a blockquote.

Visit [CodeMash](https://codemash.pro) for more tools.`,
    outputPlaceholder: 'Converted HTML will appear here...',
    icon: 'Heading',
    gradient: 'from-purple-500 to-violet-500',
    keywords: ['markdown to html', 'markdown to html converter', 'convert markdown to html', 'md to html', 'markdown to html online', 'markdown converter', 'markdown renderer', 'markdown preview', 'github markdown to html'],
    relatedTools: ['html-to-markdown', 'format-html', 'html-to-pug'],
    faqs: [
      { question: 'How do I convert Markdown to HTML online?', answer: 'Paste your Markdown text into the input box. Our converter instantly renders it as clean, semantic HTML. Supports headings, lists, links, images, code blocks, and more.' },
      { question: 'Does this support GitHub Flavored Markdown?', answer: 'Yes, common GFM features like tables, task lists, strikethrough, and fenced code blocks with syntax highlighting classes are fully supported.' },
      { question: 'Is the HTML output clean and semantic?', answer: 'Yes, our converter produces clean HTML with proper semantic tags (h1-h6, p, ul/ol, blockquote, pre/code, etc.) suitable for websites and documentation.' },
    ],
  },

  'html-to-markdown': {
    id: 'html-to-markdown',
    title: 'HTML to Markdown Converter Online — Free',
    shortTitle: 'HTML → MD',
    description: 'Convert HTML markup to clean, readable Markdown syntax.',
    seoDescription: 'Free online HTML to Markdown converter. Transform HTML documents into clean Markdown syntax. Perfect for README files, documentation, blog posts, and wiki pages. Convert HTML to MD instantly.',
    category: 'converter',
    layout: 'converter',
    inputLanguage: 'html',
    outputLanguage: 'text',
    inputPlaceholder: `<h1>Hello World</h1>
<p>This is a <strong>bold</strong> statement and this is <em>italic</em>.</p>

<h2>Features</h2>
<ul>
  <li>Fast conversion</li>
  <li>Privacy first</li>
  <li>No sign-up required</li>
</ul>

<blockquote>
  <p>This is a blockquote.</p>
</blockquote>

<p>Visit <a href="https://codemash.pro">CodeMash</a> for more tools.</p>`,
    outputPlaceholder: 'Converted Markdown will appear here...',
    icon: 'Heading',
    gradient: 'from-violet-500 to-purple-500',
    keywords: ['html to markdown', 'html to markdown converter', 'convert html to markdown', 'html to md', 'html to markdown online', 'html to md converter', 'html markdown converter'],
    relatedTools: ['markdown-to-html', 'format-html', 'html-to-pug'],
    faqs: [
      { question: 'How do I convert HTML to Markdown?', answer: 'Paste your HTML code into the input box. Our converter strips tags and produces clean Markdown with proper headings, lists, links, and formatting.' },
      { question: 'Are HTML tables converted to Markdown tables?', answer: 'Yes, basic HTML tables are converted to Markdown table syntax with proper column alignment using pipe (|) notation.' },
      { question: 'What heading style is used?', answer: 'ATX-style headings (# H1, ## H2, etc.) are used by default, which is the most widely supported Markdown heading format.' },
    ],
  },

  // ─── Formatters ─────────────────────────────────────────────

  'format-json': {
    id: 'format-json',
    title: 'JSON Formatter & Validator Online — Free',
    shortTitle: 'JSON Format',
    description: 'Format, beautify, and validate JSON data with customizable indentation.',
    seoDescription: 'Free online JSON formatter, beautifier, and validator. Format minified JSON with customizable indentation (2 or 4 spaces). Validate JSON syntax, pretty-print JSON, and minify JSON. The best JSON formatter tool — fast, private, no sign-up.',
    category: 'formatter',
    layout: 'formatter',
    inputLanguage: 'json',
    outputLanguage: 'json',
    inputPlaceholder: `{"name":"John Doe","age":30,"isActive":true,"address":{"street":"123 Main St","city":"Anytown","state":"CA"},"tags":["developer","designer"]}`,
    outputPlaceholder: 'Formatted JSON will appear here...',
    icon: 'Braces',
    gradient: 'from-yellow-500 to-amber-500',
    keywords: ['json formatter', 'json formatter online', 'json beautifier', 'json validator', 'json validator online', 'format json', 'json pretty print', 'json viewer', 'json formatter online free', 'beautify json', 'json lint', 'minify json', 'json format'],
    showMinify: true,
    showIndent: true,
    relatedTools: ['xml-to-json', 'yaml-to-json', 'json-to-schema', 'json-to-csv', 'json-to-typescript'],
    faqs: [
      { question: 'How do I format JSON online?', answer: 'Paste your minified or messy JSON into the input box. Our formatter instantly beautifies it with proper indentation. Choose 2 or 4 spaces for indent size.' },
      { question: 'Does this validate JSON?', answer: 'Yes, our JSON formatter also validates your JSON syntax and provides clear error messages with line numbers if the JSON is invalid.' },
      { question: 'Can I minify JSON?', answer: 'Yes, use the Minify button to remove all whitespace and produce compact, single-line JSON output — perfect for reducing payload size.' },
      { question: 'What is the difference between JSON formatter and JSON validator?', answer: 'A JSON formatter beautifies the appearance of valid JSON with indentation. A JSON validator checks whether the JSON syntax is correct. Our tool does both simultaneously.' },
      { question: 'Is this JSON formatter free?', answer: 'Yes, completely free with no usage limits, no sign-up required, and no ads that block your workflow. Your data stays in your browser.' },
    ],
  },

  'format-xml': {
    id: 'format-xml',
    title: 'XML Formatter & Beautifier Online — Free',
    shortTitle: 'XML Format',
    description: 'Format and beautify XML documents with proper indentation.',
    seoDescription: 'Free online XML formatter and beautifier. Pretty-print minified XML with customizable indentation. Validate XML structure and format XML documents online. Fast and private.',
    category: 'formatter',
    layout: 'formatter',
    inputLanguage: 'xml',
    outputLanguage: 'xml',
    inputPlaceholder: `<?xml version="1.0"?><catalog><book id="1"><author>John</author><title>XML Guide</title><price>29.99</price></book><book id="2"><author>Jane</author><title>JSON Guide</title><price>19.99</price></book></catalog>`,
    outputPlaceholder: 'Formatted XML will appear here...',
    icon: 'FileCode',
    gradient: 'from-sky-500 to-blue-500',
    keywords: ['xml formatter', 'xml formatter online', 'xml beautifier', 'format xml', 'xml pretty print', 'xml viewer', 'xml formatter online free', 'beautify xml', 'xml indent'],
    showMinify: true,
    showIndent: true,
    relatedTools: ['xml-to-json', 'json-to-xml', 'format-html', 'format-json'],
    faqs: [
      { question: 'How do I format XML online?', answer: 'Paste your minified or unformatted XML into the input box. Our formatter instantly adds proper indentation and line breaks for readability.' },
      { question: 'Does this handle XML namespaces?', answer: 'Yes, XML namespaces are fully preserved during formatting. The formatter only changes whitespace and indentation.' },
      { question: 'Can I minify XML?', answer: 'Yes, the Minify button removes all unnecessary whitespace to produce compact, single-line XML output.' },
    ],
  },

  'format-html': {
    id: 'format-html',
    title: 'HTML Formatter & Beautifier Online — Free',
    shortTitle: 'HTML Format',
    description: 'Format and beautify HTML documents with proper indentation and structure.',
    seoDescription: 'Free online HTML formatter and beautifier. Pretty-print minified HTML with proper indentation. Clean up messy HTML code and beautify HTML online. Format HTML documents instantly.',
    category: 'formatter',
    layout: 'formatter',
    inputLanguage: 'html',
    outputLanguage: 'html',
    inputPlaceholder: `<!DOCTYPE html><html><head><title>Test</title><style>body{margin:0;padding:0}</style></head><body><div class="container"><h1>Hello</h1><p>World</p><ul><li>One</li><li>Two</li></ul></div></body></html>`,
    outputPlaceholder: 'Formatted HTML will appear here...',
    icon: 'Globe',
    gradient: 'from-orange-500 to-red-500',
    keywords: ['html formatter', 'html formatter online', 'html beautifier', 'format html', 'html pretty print', 'beautify html', 'html formatter online free', 'html indent', 'html code formatter'],
    showMinify: true,
    showIndent: true,
    relatedTools: ['html-to-pug', 'pug-to-html', 'format-css', 'format-json', 'html-to-markdown'],
    faqs: [
      { question: 'How do I format HTML online?', answer: 'Paste your minified or messy HTML into the input box. Our formatter adds proper indentation and structure instantly.' },
      { question: 'Does this fix broken HTML?', answer: 'The formatter beautifies properly structured HTML. For fixing broken HTML, use a dedicated HTML validator alongside this tool.' },
      { question: 'Are inline styles formatted?', answer: 'Yes, inline styles within <style> tags are formatted along with the HTML structure for complete code readability.' },
    ],
  },

  'format-css': {
    id: 'format-css',
    title: 'CSS Formatter & Beautifier Online — Free',
    shortTitle: 'CSS Format',
    description: 'Format and beautify CSS stylesheets with proper indentation.',
    seoDescription: 'Free online CSS formatter and beautifier. Pretty-print minified CSS with customizable indentation. Format CSS, SCSS, and LESS stylesheets online. Minify CSS for production.',
    category: 'formatter',
    layout: 'formatter',
    inputLanguage: 'css',
    outputLanguage: 'css',
    inputPlaceholder: `body{margin:0;padding:0;font-family:Arial,sans-serif}.container{max-width:1200px;margin:0 auto;padding:20px}.header{background:#333;color:#fff;padding:10px 20px}.header h1{margin:0;font-size:24px}.content{display:flex;gap:20px}.sidebar{width:250px;background:#f5f5f5;padding:15px}.main{flex:1;padding:15px}`,
    outputPlaceholder: 'Formatted CSS will appear here...',
    icon: 'Paintbrush',
    gradient: 'from-blue-500 to-indigo-500',
    keywords: ['css formatter', 'css formatter online', 'css beautifier', 'format css', 'css pretty print', 'beautify css', 'css minifier', 'css formatter online free', 'minify css'],
    showMinify: true,
    showIndent: true,
    relatedTools: ['format-html', 'format-javascript', 'format-json'],
    faqs: [
      { question: 'How do I format CSS online?', answer: 'Paste your minified or messy CSS into the input. Our formatter adds proper indentation, line breaks, and spacing for each rule and declaration.' },
      { question: 'Can I minify CSS for production?', answer: 'Yes, the Minify button removes all comments, whitespace, and line breaks to produce compact CSS optimized for production deployment.' },
      { question: 'Does this support SCSS/LESS?', answer: 'The formatter works best with standard CSS. Basic SCSS/LESS syntax may work but advanced features are not fully supported.' },
    ],
  },

  'format-javascript': {
    id: 'format-javascript',
    title: 'JavaScript Formatter & Beautifier Online',
    shortTitle: 'JS Format',
    description: 'Format and beautify JavaScript code with proper indentation and structure.',
    seoDescription: 'Free online JavaScript formatter and beautifier. Pretty-print minified JavaScript with customizable indentation. Format JS code, beautify JavaScript online. Supports ES6+ syntax including arrow functions and async/await.',
    category: 'formatter',
    layout: 'formatter',
    inputLanguage: 'javascript',
    outputLanguage: 'javascript',
    inputPlaceholder: `function fibonacci(n){if(n<=1)return n;return fibonacci(n-1)+fibonacci(n-2)}const result=fibonacci(10);console.log("Fibonacci:",result);const users=[{name:"John",age:30},{name:"Jane",age:25}];users.forEach(function(user){console.log(user.name+" is "+user.age+" years old")});`,
    outputPlaceholder: 'Formatted JavaScript will appear here...',
    icon: 'Terminal',
    gradient: 'from-yellow-400 to-yellow-600',
    keywords: ['javascript formatter', 'javascript beautifier', 'js formatter', 'js beautifier', 'format javascript', 'javascript formatter online', 'js formatter online', 'beautify javascript', 'javascript pretty print', 'js beautifier online'],
    showMinify: true,
    showIndent: true,
    relatedTools: ['format-json', 'format-html', 'format-css', 'format-sql'],
    faqs: [
      { question: 'How do I format JavaScript online?', answer: 'Paste your minified or messy JavaScript code into the input box. Our formatter instantly adds proper indentation, line breaks, and spacing.' },
      { question: 'Does this support ES6+ syntax?', answer: 'Yes, modern JavaScript features like arrow functions, template literals, destructuring, optional chaining, and async/await are fully supported.' },
      { question: 'Can I minify JavaScript?', answer: 'Yes, the Minify button produces compact JavaScript by removing whitespace and line breaks. For production minification, consider tools like Terser.' },
    ],
  },

  'format-sql': {
    id: 'format-sql',
    title: 'SQL Formatter & Beautifier Online — Free',
    shortTitle: 'SQL Format',
    description: 'Format, beautify, and indent SQL queries with uppercase keywords.',
    seoDescription: 'Free online SQL formatter and beautifier. Format SQL queries with proper indentation and uppercase keywords. Supports MySQL, PostgreSQL, SQL Server, Oracle, and SQLite. Pretty-print complex SQL queries instantly.',
    category: 'formatter',
    layout: 'formatter',
    inputLanguage: 'text',
    outputLanguage: 'text',
    inputPlaceholder: `select u.id, u.name, u.email, o.total from users u inner join orders o on u.id = o.user_id where u.active = true and o.created_at > '2024-01-01' group by u.id, u.name, u.email, o.total having o.total > 100 order by o.total desc limit 50;`,
    outputPlaceholder: 'Formatted SQL will appear here...',
    icon: 'Database',
    gradient: 'from-orange-500 to-amber-500',
    keywords: ['sql formatter', 'sql formatter online', 'sql beautifier', 'format sql', 'sql pretty print', 'sql formatter online free', 'sql query formatter', 'mysql formatter', 'postgresql formatter', 'sql indent'],
    showMinify: true,
    showIndent: true,
    relatedTools: ['format-json', 'format-javascript', 'csv-to-json', 'json-to-csv'],
    faqs: [
      { question: 'How do I format SQL queries online?', answer: 'Paste your SQL query into the input box. Our formatter adds proper indentation, line breaks, and uppercases keywords (SELECT, FROM, WHERE, etc.) for readability.' },
      { question: 'Which SQL dialects are supported?', answer: 'Standard SQL, MySQL, PostgreSQL, SQL Server, Oracle, MariaDB, and SQLite are all supported. The formatter handles common syntax for all major databases.' },
      { question: 'Does this uppercase SQL keywords?', answer: 'Yes, SQL keywords (SELECT, FROM, WHERE, JOIN, GROUP BY, etc.) are automatically uppercased for readability and consistency.' },
      { question: 'Can I minify SQL queries?', answer: 'Yes, the Minify button removes comments and collapses whitespace to produce compact SQL suitable for programmatic use.' },
    ],
  },

  // ─── Decoders / Encoders ────────────────────────────────────

  'base64': {
    id: 'base64',
    title: 'Base64 Encode & Decode Online — Free',
    shortTitle: 'Base64',
    description: 'Encode text to Base64 or decode Base64 strings back to text.',
    seoDescription: 'Free online Base64 encoder and decoder. Encode text to Base64 or decode Base64 strings back to readable text instantly. Supports UTF-8 and Unicode characters. Base64 encode and decode online tool.',
    category: 'decoder',
    layout: 'encoder',
    inputLanguage: 'text',
    outputLanguage: 'text',
    inputPlaceholder: 'Enter text to encode to Base64, or paste Base64 to decode...',
    outputPlaceholder: 'Result will appear here...',
    icon: 'Lock',
    gradient: 'from-teal-500 to-green-500',
    keywords: ['base64 decode', 'base64 encode', 'base64 decoder', 'base64 encoder', 'base64 decode online', 'base64 encode online', 'base64 converter', 'base64 online', 'decode base64', 'encode base64'],
    bidirectional: true,
    relatedTools: ['jwt-decoder', 'url-encode-decode', 'hash-generator', 'text-to-json'],
    faqs: [
      { question: 'How do I decode Base64 online?', answer: 'Paste your Base64 encoded string into the input box and click Decode. The tool instantly converts it to readable text. No sign-up or installation needed.' },
      { question: 'What is Base64 encoding?', answer: 'Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format using 64 characters (A-Z, a-z, 0-9, +, /). It\'s commonly used for data URLs, email attachments, and API authentication.' },
      { question: 'Does this support Unicode and UTF-8?', answer: 'Yes, full UTF-8 and Unicode characters are properly supported for both encoding and decoding, including emojis and international characters.' },
      { question: 'Is Base64 encryption?', answer: 'No, Base64 is an encoding scheme, not encryption. It\'s easily reversible and should not be used for securing sensitive data. Use proper encryption for security.' },
    ],
  },

  'jwt-decoder': {
    id: 'jwt-decoder',
    title: 'JWT Decoder Online — Decode JSON Web Tokens',
    shortTitle: 'JWT Decode',
    description: 'Decode and inspect JWT (JSON Web Token) headers, payloads, and claims.',
    seoDescription: 'Free online JWT decoder. Decode and inspect JWT token headers, payloads, and claims instantly. View expiration times, issued-at dates, and other token metadata. A free alternative to jwt.io that runs in your browser.',
    category: 'decoder',
    layout: 'converter',
    inputLanguage: 'text',
    outputLanguage: 'json',
    inputPlaceholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    outputPlaceholder: 'Decoded JWT will appear here...',
    icon: 'KeyRound',
    gradient: 'from-indigo-500 to-violet-500',
    keywords: ['jwt decoder', 'jwt decode', 'jwt decoder online', 'jwt token decoder', 'decode jwt', 'jwt.io', 'json web token decoder', 'jwt parser', 'jwt viewer', 'jwt decode online'],
    relatedTools: ['base64', 'format-json', 'hash-generator'],
    faqs: [
      { question: 'How do I decode a JWT token online?', answer: 'Paste your JWT token into the input box. Our decoder instantly splits and decodes the header (algorithm info) and payload (claims data) into readable JSON.' },
      { question: 'Is my JWT token safe when decoded here?', answer: 'Yes! All decoding happens entirely in your browser using JavaScript. No data is sent to any server. Your tokens remain completely private and secure.' },
      { question: 'Can this verify JWT signatures?', answer: 'This tool decodes and displays JWT contents (header and payload). Signature verification requires the secret key or public key and is not performed client-side for security reasons.' },
      { question: 'What JWT claims can I see?', answer: 'All standard claims are displayed: sub (subject), iss (issuer), exp (expiration), iat (issued at), aud (audience), and any custom claims in the payload.' },
    ],
  },

  'url-encode-decode': {
    id: 'url-encode-decode',
    title: 'URL Encoder & Decoder Online — Free',
    shortTitle: 'URL Encode',
    description: 'Encode text for URLs or decode percent-encoded strings back to readable text.',
    seoDescription: 'Free online URL encoder and decoder. Percent-encode strings for safe URL usage or decode URL-encoded text. URL encode online tool with full UTF-8 support. Encode and decode URL query parameters instantly.',
    category: 'decoder',
    layout: 'encoder',
    inputLanguage: 'text',
    outputLanguage: 'text',
    inputPlaceholder: 'Enter text to URL-encode, or paste URL-encoded text to decode...',
    outputPlaceholder: 'Result will appear here...',
    icon: 'Link',
    gradient: 'from-sky-500 to-cyan-500',
    keywords: ['url encoder', 'url decoder', 'url encode', 'url decode', 'url encode online', 'url decode online', 'url encoder decoder', 'percent encoding', 'urlencode', 'urldecode', 'encode url'],
    bidirectional: true,
    relatedTools: ['base64', 'html-entity-encode-decode', 'hash-generator'],
    faqs: [
      { question: 'How do I URL encode a string online?', answer: 'Paste your text into the input box and click Encode. Special characters like spaces, &, =, and non-ASCII characters are converted to percent-encoded format (%20, %26, etc.).' },
      { question: 'What is URL encoding (percent encoding)?', answer: 'URL encoding replaces unsafe characters with a % followed by two hex digits (e.g., space becomes %20). This ensures strings are safe for use in URLs and query parameters.' },
      { question: 'When should I URL encode?', answer: 'URL encode when including user input in URLs, building query parameters, or passing special characters in API requests. Characters like &, =, ?, #, and spaces must be encoded.' },
    ],
  },

  'html-entity-encode-decode': {
    id: 'html-entity-encode-decode',
    title: 'HTML Entity Encoder & Decoder Online',
    shortTitle: 'HTML Entities',
    description: 'Encode special characters as HTML entities or decode HTML entities back to text.',
    seoDescription: 'Free online HTML entity encoder and decoder. Convert special characters to HTML entities (&amp;, &lt;, &gt;, &quot;) or decode HTML entities back to readable text. Escape and unescape HTML online.',
    category: 'decoder',
    layout: 'encoder',
    inputLanguage: 'text',
    outputLanguage: 'text',
    inputPlaceholder: 'Enter text with special characters, or paste HTML entities to decode...',
    outputPlaceholder: 'Result will appear here...',
    icon: 'Code',
    gradient: 'from-rose-500 to-orange-500',
    keywords: ['html entity encoder', 'html entity decoder', 'html encode', 'html decode', 'html escape', 'html unescape', 'html entity encode online', 'html entity decode online', 'html special characters', 'html entities'],
    bidirectional: true,
    relatedTools: ['url-encode-decode', 'base64', 'format-html'],
    faqs: [
      { question: 'What are HTML entities?', answer: 'HTML entities are special codes used to represent characters that have meaning in HTML (like <, >, &, ") or characters not on a standard keyboard (like ©, €, ™).' },
      { question: 'Which characters are encoded?', answer: 'The five required HTML entities are encoded: & → &amp;, < → &lt;, > → &gt;, " → &quot;, and \' → &#39;. This prevents XSS attacks and rendering issues.' },
      { question: 'Does decoding support named and numeric entities?', answer: 'Yes, both named entities (like &amp;, &copy;, &euro;) and numeric entities (like &#169;, &#x00A9;) are fully decoded.' },
    ],
  },

  // ─── Utilities ──────────────────────────────────────────────

  'hash-generator': {
    id: 'hash-generator',
    title: 'SHA-256 Hash Generator Online — Free',
    shortTitle: 'Hash Gen',
    description: 'Generate SHA-256, SHA-1, and SHA-512 hashes from any text input.',
    seoDescription: 'Free online SHA-256 hash generator. Generate SHA-256, SHA-1, and SHA-512 cryptographic hashes from any text instantly. Uses Web Crypto API — your data never leaves your browser. Online hash generator tool.',
    category: 'utility',
    layout: 'converter',
    inputLanguage: 'text',
    outputLanguage: 'text',
    inputPlaceholder: 'Enter text to hash...\n\nExample: Hello, World!',
    outputPlaceholder: 'SHA-256, SHA-1, and SHA-512 hashes will appear here...',
    icon: 'Fingerprint',
    gradient: 'from-red-500 to-rose-500',
    keywords: ['sha256 hash generator', 'sha256 online', 'hash generator', 'hash generator online', 'sha256', 'sha1 hash', 'sha512 hash', 'sha256 hash online', 'checksum generator', 'generate hash', 'crypto hash'],
    showIndent: false,
    relatedTools: ['base64', 'url-encode-decode', 'compare', 'jwt-decoder'],
    faqs: [
      { question: 'How do I generate a SHA-256 hash online?', answer: 'Paste or type your text into the input box. Our tool instantly computes SHA-256, SHA-1, and SHA-512 hashes simultaneously using your browser\'s Web Crypto API.' },
      { question: 'Which hash algorithms are supported?', answer: 'SHA-256 (most widely used), SHA-1 (legacy compatibility), and SHA-512 (strongest) are computed simultaneously from your input.' },
      { question: 'Is my data secure when generating hashes?', answer: 'Absolutely. Hashing is performed entirely in your browser using the native Web Crypto API. Your text is never sent to any server or stored anywhere.' },
      { question: 'What is SHA-256 used for?', answer: 'SHA-256 is used for data integrity verification, password hashing, digital signatures, blockchain, SSL certificates, and checksums to verify file downloads.' },
    ],
  },

  'number-base-converter': {
    id: 'number-base-converter',
    title: 'Hex to Decimal Converter — Number Base Converter',
    shortTitle: 'Base Convert',
    description: 'Convert numbers between decimal, hexadecimal, binary, and octal formats.',
    seoDescription: 'Free online hex to decimal converter and number base converter. Convert between decimal, hexadecimal (hex), binary, and octal number systems instantly. Also converts binary to decimal, decimal to hex, and more.',
    category: 'utility',
    layout: 'converter',
    inputLanguage: 'text',
    outputLanguage: 'text',
    inputPlaceholder: `Enter a number in any base:

  255        (decimal)
  0xFF       (hexadecimal)
  0b11111111 (binary)
  0o377      (octal)`,
    outputPlaceholder: 'All base representations will appear here...',
    icon: 'Binary',
    gradient: 'from-indigo-500 to-blue-500',
    keywords: ['hex to decimal', 'binary to decimal', 'decimal to hex', 'hex converter', 'number base converter', 'binary converter', 'hex to decimal converter', 'decimal to binary', 'octal converter', 'hex to binary', 'number converter online'],
    showIndent: false,
    relatedTools: ['hash-generator', 'base64', 'compare'],
    faqs: [
      { question: 'How do I convert hex to decimal online?', answer: 'Enter a hexadecimal number with the 0x prefix (e.g., 0xFF) into the input. The converter instantly shows decimal, binary, and octal equivalents.' },
      { question: 'How do I specify the input base?', answer: 'Use standard prefixes: 0x for hex (0xFF), 0b for binary (0b1010), 0o for octal (0o17). Plain numbers without prefix are treated as decimal.' },
      { question: 'Are large numbers supported?', answer: 'Yes, the converter uses BigInt internally and can handle arbitrarily large numbers without precision loss, unlike calculators limited to 64-bit floats.' },
      { question: 'Can I convert binary to decimal?', answer: 'Yes. Enter a binary number with the 0b prefix (e.g., 0b11111111) and get instant decimal (255), hex (0xFF), and octal (0o377) conversions.' },
    ],
  },

  'compare': {
    id: 'compare',
    title: 'Diff Checker Online — Compare Text & Code',
    shortTitle: 'Compare',
    description: 'Compare two text files or code snippets side by side with highlighted differences.',
    seoDescription: 'Free online diff checker. Compare two text files or code snippets side by side with highlighted additions, deletions, and changes. Diff tool for code review, text comparison, and file merging.',
    category: 'utility',
    layout: 'compare',
    inputLanguage: 'text',
    outputLanguage: 'text',
    inputPlaceholder: `function greet(name) {
  console.log("Hello, " + name);
  return true;
}

const result = greet("World");`,
    outputPlaceholder: `function greet(name, greeting) {
  console.log(greeting + ", " + name + "!");
  return { success: true };
}

const result = greet("World", "Hi");`,
    icon: 'GitCompare',
    gradient: 'from-slate-500 to-zinc-500',
    keywords: ['diff checker', 'diff checker online', 'text compare', 'code diff', 'compare text online', 'diff tool', 'text diff', 'code compare', 'file compare', 'online diff', 'compare files'],
    relatedTools: ['format-json', 'format-javascript', 'hash-generator'],
    faqs: [
      { question: 'How do I compare two text files online?', answer: 'Paste the original text on the left and the modified text on the right. Our diff tool highlights additions (green), deletions (red), and changes between the two texts.' },
      { question: 'What diff algorithm is used?', answer: 'We use the Myers diff algorithm which provides optimal edit distance calculations for accurate, line-by-line difference detection.' },
      { question: 'Can I compare code files?', answer: 'Yes, paste any code (JavaScript, Python, JSON, SQL, etc.) into both panels to see exactly what changed. Perfect for code reviews and debugging.' },
      { question: 'Is there a file size limit?', answer: 'There is no hard limit. The tool handles large text files efficiently since all processing happens in your browser.' },
    ],
  },
};

export function getToolsByCategory(category: ToolCategory): ToolConfig[] {
  return Object.values(tools).filter((t) => t.category === category);
}

export function getAllToolIds(): string[] {
  return Object.keys(tools);
}

export function getToolById(id: string): ToolConfig | undefined {
  return tools[id];
}
