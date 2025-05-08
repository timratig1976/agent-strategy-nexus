
import React from 'react';
import { CustomerJob, ProductService } from './types';
import RelatedItemList from './components/RelatedItemList';

interface ProductServicesProps {
  services: ProductService[];
  jobs: CustomerJob[];
  onAdd: (content: string, relatedJobIds: string[]) => void;
  onUpdate: (id: string, content: string, relatedJobIds: string[]) => void;
  onDelete: (id: string) => void;
  formPosition?: 'top' | 'bottom';
}

const ProductServices = ({ services, jobs, onAdd, onUpdate, onDelete, formPosition = 'bottom' }: ProductServicesProps) => {
  return (
    <RelatedItemList
      title="Products & Services"
      description="Define what your company offers that helps customers complete their jobs. These are your products, services, or specific features that create value for the customer."
      bgColor="indigo"
      titleColor="indigo"
      textColor="indigo"
      items={services.map(service => ({
        id: service.id,
        content: service.content,
        relatedItemIds: service.relatedJobIds
      }))}
      customerItems={jobs}
      customerItemType="job"
      customerItemRatingType="priority"
      customerItemRatingLabel="priority"
      itemPlaceholder="What product or service do you offer?"
      emptyCustomerItemsMessage="First, add some customer jobs in the Customer Profile tab to connect them to your products and services."
      onAdd={onAdd}
      onUpdate={onUpdate}
      onDelete={onDelete}
      formPosition={formPosition}
    />
  );
};

export default ProductServices;
