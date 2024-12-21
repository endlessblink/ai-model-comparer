import type { ModelData } from '../types/modelTypes';

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
      capabilities: data.capabilities || [],
      limitations: data.limitations || [],
      useCases: data.useCases || [],
      pricing: data.pricing || '',
      apiDocumentation: data.apiDocumentation || '',
      created_at: new Date().toISOString(),
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

## Capabilities
${data.capabilities.map(cap => `- ${cap}`).join('\n')}

## Limitations
${data.limitations.map(lim => `- ${lim}`).join('\n')}

## Use Cases
${data.useCases.map(use => `- ${use}`).join('\n')}

## Pricing
${data.pricing}

## API Documentation
${data.apiDocumentation}
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
