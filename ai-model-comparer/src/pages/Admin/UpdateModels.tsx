import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateModelData } from '@/utils/aiDataGenerator';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

export default function UpdateModels() {
  const [modelName, setModelName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (!modelName) {
      toast({
        title: 'Error',
        description: 'Please enter a model name',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateModelData(modelName);
      toast({
        title: 'Success',
        description: `Data for ${modelName} has been updated successfully`,
      });
      setModelName('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update model data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const commonModels = [
    'ChatGPT',
    'Claude',
    'DALL-E',
    'Midjourney',
    'Stable Diffusion',
    'GPT-4',
    'Gemini',
    'CodeLlama',
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Update AI Model Data</h1>
        <Link to="/admin/add-model">
          <Button>
            Add New Model
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update AI Model Data</CardTitle>
          <CardDescription>
            Enter the name of an AI model to automatically generate and update its data using GPT-4
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter model name..."
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
              <Button onClick={handleUpdate} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update'}
              </Button>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Common Models</h3>
              <div className="flex flex-wrap gap-2">
                {commonModels.map((model) => (
                  <Button
                    key={model}
                    variant="outline"
                    size="sm"
                    onClick={() => setModelName(model)}
                  >
                    {model}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
