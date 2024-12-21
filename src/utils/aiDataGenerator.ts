interface GeneratedModelData {
  description: string;
  modelType: string;
  advantages: string[];
  limitations: string[];
  pricing: {
    free: boolean;
    plans: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
  };
}

export async function generateModelData(modelName: string): Promise<GeneratedModelData> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ modelName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validate the response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from API');
    }

    // Ensure required fields exist
    const requiredFields = ['description', 'modelType', 'advantages', 'limitations', 'pricing'];
    const missingFields = requiredFields.filter(field => !(field in data));
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return data;
  } catch (error) {
    console.error('Error generating model data:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate model data');
  }
} 