
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CustomerJob, ProductService } from './types';
import { Trash2, Plus } from "lucide-react";

interface ProductServicesProps {
  services: ProductService[];
  jobs: CustomerJob[];
  onAdd: (content: string, relatedJobIds: string[]) => void;
  onUpdate: (id: string, content: string, relatedJobIds: string[]) => void;
  onDelete: (id: string) => void;
  formPosition?: 'top' | 'bottom';
}

const ProductServices = ({ services, jobs, onAdd, onUpdate, onDelete, formPosition = 'bottom' }: ProductServicesProps) => {
  const [newServiceContent, setNewServiceContent] = useState('');
  const [newServiceJobIds, setNewServiceJobIds] = useState<string[]>([]);

  const handleAddService = () => {
    if (newServiceContent.trim()) {
      onAdd(newServiceContent.trim(), newServiceJobIds);
      setNewServiceContent('');
      setNewServiceJobIds([]);
    }
  };

  const toggleJobSelection = (jobId: string, serviceId?: string) => {
    if (serviceId) {
      // Update existing service
      const service = services.find(s => s.id === serviceId);
      if (service) {
        const updatedJobIds = service.relatedJobIds.includes(jobId)
          ? service.relatedJobIds.filter(id => id !== jobId)
          : [...service.relatedJobIds, jobId];
        
        onUpdate(serviceId, service.content, updatedJobIds);
      }
    } else {
      // Update new service form
      setNewServiceJobIds(prev => 
        prev.includes(jobId)
          ? prev.filter(id => id !== jobId)
          : [...prev, jobId]
      );
    }
  };

  // Form to add new services
  const AddServiceForm = () => (
    <div className="p-4 border rounded-md space-y-4 mb-4">
      <div className="flex-1">
        <Input 
          value={newServiceContent}
          onChange={(e) => setNewServiceContent(e.target.value)}
          placeholder="Add a new product or service..."
        />
      </div>
      
      <div>
        <Label className="text-sm font-medium mb-2 block">Related Customer Jobs:</Label>
        <div className="space-y-2 ml-2">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`new-service-job-${job.id}`} 
                checked={newServiceJobIds.includes(job.id)}
                onCheckedChange={() => toggleJobSelection(job.id)}
              />
              <Label 
                htmlFor={`new-service-job-${job.id}`}
                className="text-sm"
              >
                {job.content}
                {job.priority === 'high' && (
                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                    High Priority
                  </span>
                )}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-right">
        <Button 
          onClick={handleAddService}
          disabled={!newServiceContent.trim()}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Product/Service
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-4 rounded-lg">
        <h3 className="text-base font-medium text-indigo-800 mb-2">What are Products & Services?</h3>
        <p className="text-sm text-indigo-700">
          Define what your company offers that helps customers complete their jobs. 
          These are your products, services, or specific features that create value for the customer.
        </p>
      </div>

      {formPosition === 'top' && <AddServiceForm />}

      {jobs.length === 0 ? (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-muted-foreground">
            First, add some customer jobs in the Customer Profile tab to connect them to your products and services.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="p-4 bg-white border rounded-md">
              <div className="flex items-start space-x-3 mb-3">
                <div className="flex-1">
                  <Input 
                    value={service.content}
                    onChange={(e) => onUpdate(service.id, e.target.value, service.relatedJobIds)}
                    placeholder="What product or service do you offer?"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(service.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-3">
                <Label className="text-sm font-medium mb-2 block">Related Customer Jobs:</Label>
                <div className="space-y-2 ml-2">
                  {jobs.map((job) => (
                    <div key={job.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`service-${service.id}-job-${job.id}`} 
                        checked={service.relatedJobIds.includes(job.id)}
                        onCheckedChange={() => toggleJobSelection(job.id, service.id)}
                      />
                      <Label 
                        htmlFor={`service-${service.id}-job-${job.id}`}
                        className="text-sm"
                      >
                        {job.content}
                        {job.priority === 'high' && (
                          <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                            High Priority
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formPosition === 'bottom' && jobs.length > 0 && <AddServiceForm />}
    </div>
  );
};

export default ProductServices;
