
import React from 'react';
import { CustomerGain, GainCreator } from './types';
import RelatedItemList from './components/RelatedItemList';
import SectionHeader from './components/SectionHeader';

interface GainCreatorsProps {
  creators: GainCreator[];
  gains: CustomerGain[];
  onAdd: (content: string, relatedGainIds: string[]) => void;
  onUpdate: (id: string, content: string, relatedGainIds: string[]) => void;
  onDelete: (id: string) => void;
  formPosition?: 'top' | 'bottom';
}

const GainCreators = ({ creators, gains, onAdd, onUpdate, onDelete, formPosition = 'bottom' }: GainCreatorsProps) => {
  return (
    <>
      <SectionHeader
        title="Gain Creators"
        tooltipTitle="What are Gain Creators?"
        tooltipContent="Describe how your products and services create customer gains. These are the features that produce outcomes and benefits that your customer expects, desires, or would be surprised by."
      />
      
      <RelatedItemList
        description=""
        bgColor="green"
        titleColor="green"
        textColor="green"
        items={creators.map(creator => ({
          id: creator.id,
          content: creator.content,
          relatedItemIds: creator.relatedGainIds
        }))}
        customerItems={gains}
        customerItemType="gain"
        customerItemRatingType="importance"
        customerItemRatingLabel="importance"
        itemPlaceholder="How do you create customer gains?"
        emptyCustomerItemsMessage="First, add some customer gains in the Customer Profile tab to connect them to your gain creators."
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
        formPosition={formPosition}
      />
    </>
  );
};

export default GainCreators;
