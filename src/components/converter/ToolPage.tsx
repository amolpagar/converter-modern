'use client';

import { getToolById } from '@/lib/tools';
import { ConverterLayout } from './ConverterLayout';
import { CompareLayout } from './CompareLayout';
import { EncoderLayout } from './EncoderLayout';

interface ToolPageProps {
  toolId: string;
}

export function ToolPage({ toolId }: ToolPageProps) {
  const tool = getToolById(toolId);

  if (!tool) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Tool not found.</p>
      </div>
    );
  }

  switch (tool.layout) {
    case 'compare':
      return <CompareLayout tool={tool} />;
    case 'encoder':
      return <EncoderLayout tool={tool} />;
    case 'converter':
    case 'formatter':
    default:
      return <ConverterLayout tool={tool} />;
  }
}
