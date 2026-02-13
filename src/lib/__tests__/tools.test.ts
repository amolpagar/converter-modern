import { describe, it, expect } from 'vitest';
import {
  tools,
  getToolsByCategory,
  getAllToolIds,
  getToolById,
  type ToolConfig,
} from '@/lib/tools';

describe('Tool Registry', () => {
  const allIds = getAllToolIds();

  it('has at least 20 tools registered', () => {
    expect(allIds.length).toBeGreaterThanOrEqual(20);
  });

  it('every tool id matches its key in the tools record', () => {
    for (const [key, tool] of Object.entries(tools)) {
      expect(tool.id).toBe(key);
    }
  });

  it('every tool has required fields', () => {
    const requiredFields: (keyof ToolConfig)[] = [
      'id',
      'title',
      'shortTitle',
      'description',
      'seoDescription',
      'category',
      'layout',
      'inputLanguage',
      'outputLanguage',
      'inputPlaceholder',
      'outputPlaceholder',
      'icon',
      'gradient',
      'keywords',
      'relatedTools',
      'faqs',
    ];

    for (const tool of Object.values(tools)) {
      for (const field of requiredFields) {
        expect(tool[field], `${tool.id} missing field: ${field}`).toBeDefined();
      }
    }
  });

  it('every tool has at least one keyword', () => {
    for (const tool of Object.values(tools)) {
      expect(tool.keywords.length, `${tool.id} has no keywords`).toBeGreaterThan(0);
    }
  });

  it('every tool has at least one related tool', () => {
    for (const tool of Object.values(tools)) {
      expect(tool.relatedTools.length, `${tool.id} has no relatedTools`).toBeGreaterThan(0);
    }
  });

  it('all related tools reference existing tool ids', () => {
    for (const tool of Object.values(tools)) {
      for (const related of tool.relatedTools) {
        expect(allIds, `${tool.id} references non-existent related tool: ${related}`).toContain(
          related
        );
      }
    }
  });

  it('every tool has at least one FAQ', () => {
    for (const tool of Object.values(tools)) {
      expect(tool.faqs.length, `${tool.id} has no FAQs`).toBeGreaterThan(0);
    }
  });

  it('every FAQ has a question and answer', () => {
    for (const tool of Object.values(tools)) {
      for (const faq of tool.faqs) {
        expect(faq.question.length, `${tool.id} FAQ has empty question`).toBeGreaterThan(0);
        expect(faq.answer.length, `${tool.id} FAQ has empty answer`).toBeGreaterThan(0);
      }
    }
  });
});

describe('getToolsByCategory', () => {
  it('returns converters', () => {
    const converters = getToolsByCategory('converter');
    expect(converters.length).toBeGreaterThan(0);
    expect(converters.every((t) => t.category === 'converter')).toBe(true);
  });

  it('returns formatters', () => {
    const formatters = getToolsByCategory('formatter');
    expect(formatters.length).toBeGreaterThan(0);
    expect(formatters.every((t) => t.category === 'formatter')).toBe(true);
  });

  it('returns decoders', () => {
    const decoders = getToolsByCategory('decoder');
    expect(decoders.length).toBeGreaterThan(0);
    expect(decoders.every((t) => t.category === 'decoder')).toBe(true);
  });

  it('returns utilities', () => {
    const utils = getToolsByCategory('utility');
    expect(utils.length).toBeGreaterThan(0);
    expect(utils.every((t) => t.category === 'utility')).toBe(true);
  });
});

describe('getToolById', () => {
  it('returns the correct tool for known ids', () => {
    expect(getToolById('format-json')?.title).toContain('JSON');
    expect(getToolById('xml-to-json')?.title).toContain('XML');
    expect(getToolById('json-to-csv')?.title).toContain('CSV');
    expect(getToolById('json-to-typescript')?.title).toContain('TypeScript');
    expect(getToolById('json-to-go')?.title).toContain('Go');
    expect(getToolById('markdown-to-html')?.title).toContain('Markdown');
    expect(getToolById('format-sql')?.title).toContain('SQL');
    expect(getToolById('hash-generator')?.title).toContain('Hash');
    expect(getToolById('number-base-converter')?.title).toContain('Number');
  });

  it('returns undefined for unknown ids', () => {
    expect(getToolById('non-existent-tool')).toBeUndefined();
  });
});

describe('New tools are properly registered', () => {
  const newToolIds = [
    'json-to-csv',
    'csv-to-json',
    'json-to-typescript',
    'json-to-go',
    'markdown-to-html',
    'html-to-markdown',
    'format-sql',
    'url-encode-decode',
    'html-entity-encode-decode',
    'hash-generator',
    'number-base-converter',
  ];

  it.each(newToolIds)('%s exists in the registry', (id) => {
    expect(getToolById(id)).toBeDefined();
  });

  it.each(newToolIds)('%s has a valid layout', (id) => {
    const tool = getToolById(id)!;
    expect(['converter', 'formatter', 'encoder', 'compare']).toContain(tool.layout);
  });

  it('encoder tools have encoder layout', () => {
    expect(getToolById('url-encode-decode')?.layout).toBe('encoder');
    expect(getToolById('html-entity-encode-decode')?.layout).toBe('encoder');
  });

  it('formatter tools have formatter layout', () => {
    expect(getToolById('format-sql')?.layout).toBe('formatter');
  });

  it('utility tools have converter layout', () => {
    expect(getToolById('hash-generator')?.layout).toBe('converter');
    expect(getToolById('number-base-converter')?.layout).toBe('converter');
  });
});
