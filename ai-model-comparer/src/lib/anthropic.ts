interface GenerateModelContentProps {
  modelName: string;
  modelUrl: string;
  category: string;
}

export async function generateModelContent({ 
  modelName, 
  modelUrl, 
  category 
}: GenerateModelContentProps) {
  try {
    const response = await fetch('http://localhost:3001/api/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modelName,
        modelUrl,
        category
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to generate content');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating model content:', error);
    throw error;
  }
}
