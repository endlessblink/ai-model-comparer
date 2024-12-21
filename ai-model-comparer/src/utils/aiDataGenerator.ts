import type { ModelData } from '../types/modelTypes';

export interface ModelData {
  name: string;
  description: string;
  features: string[];
  pricing: {
    free_tier?: string;
    paid_tier?: string;
    enterprise?: string;
  };
  pros: string[];
  cons: string[];
  useCases: string[];
  alternatives: string[];
  sourceDate: string;
  category?: string;
  api_available?: boolean;
}

export async function generateModelData(modelName: string): Promise<ModelData> {
  try {
    console.log('Sending request to backend API for:', modelName);
    const response = await fetch('http://localhost:3001/api/generate-model-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ modelName }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`שגיאה בשרת: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Received data from backend:', data);

    // Validate required fields
    if (!data.name || !data.description) {
      throw new Error('חסרים שדות חובה במידע שהתקבל');
    }

    // Transform the data to match our ModelData interface
    const transformedData: ModelData = {
      name: data.name,
      description: data.description,
      features: data.features || [],
      pricing: {
        free_tier: data.pricing.free_tier || '',
        paid_tier: data.pricing.paid_tier || '',
        enterprise: data.pricing.enterprise || '',
      },
      pros: data.pros || [],
      cons: data.cons || [],
      useCases: data.useCases || [],
      alternatives: data.alternatives || [],
      sourceDate: new Date().toISOString(),
      category: data.category,
      api_available: data.api_available,
    };

    return transformedData;
  } catch (error) {
    console.error('Error generating model data:', error);
    throw error;
  }
}

export function generateMarkdownContent(data: ModelData): string {
  return `# ${data.name}

## Description
${data.description}

## Features
${data.features.map(feature => `- ${feature}`).join('\n')}

## Pricing
**Free Tier:** ${data.pricing.free_tier}
**Paid Tier:** ${data.pricing.paid_tier}
**Enterprise:** ${data.pricing.enterprise}

## Pros
${data.pros.map(pro => `- ${pro}`).join('\n')}

## Cons
${data.cons.map(con => `- ${con}`).join('\n')}

## Use Cases
${data.useCases.map(use => `- ${use}`).join('\n')}

## Alternatives
${data.alternatives.map(alternative => `- ${alternative}`).join('\n')}

## Source Date
${data.sourceDate}

## Category
${data.category}

## API Available
${data.api_available}
`;
}

export async function updateModelData(modelName: string): Promise<void> {
  try {
    const modelData = await generateModelData(modelName);
    const markdownContent = generateMarkdownContent(modelData);
    console.log('Generated markdown content:', markdownContent);
    // Instead of writing to file system, you might want to send this to your backend
    // or handle it in a different way that's browser-compatible
  } catch (error) {
    console.error('Error updating model data:', error);
    throw error;
  }
}
