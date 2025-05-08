
import React from 'react';
import { CustomerJob, ProductService } from './types';
import RelatedItemList from './components/RelatedItemList';
import SectionHeader from './components/SectionHeader';

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
    <>
      <SectionHeader
        title="Products & Services"
        tooltipTitle="What are Products & Services?"
        tooltipContent="Define what your company offers that helps customers complete their jobs. These are your products, services, or specific features that create value for the customer."
      />
      
      <RelatedItemList
        description=""
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
        itemPlaceholder="Add new product or service..."
        emptyCustomerItemsMessage="First, add some customer jobs in the Customer Profile tab to connect them to your products and services."
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
        formPosition={formPosition}
      />
    </>
  );
};

export default ProductServices;
