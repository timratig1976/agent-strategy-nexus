
import React from 'react';
import { CustomerPain, PainReliever } from './types';
import RelatedItemList from './components/RelatedItemList';

interface PainRelieversProps {
  relievers: PainReliever[];
  pains: CustomerPain[];
  onAdd: (content: string, relatedPainIds: string[]) => void;
  onUpdate: (id: string, content: string, relatedPainIds: string[]) => void;
  onDelete: (id: string) => void;
  formPosition?: 'top' | 'bottom';
}

const PainRelievers = ({ relievers, pains, onAdd, onUpdate, onDelete, formPosition = 'bottom' }: PainRelieversProps) => {
  return (
    <RelatedItemList
      title="Pain Relievers"
      description="Describe how your products and services alleviate specific customer pains. These are the features that eliminate or reduce negative emotions, costs, and situations that customers experience."
      bgColor="red"
      titleColor="red"
      textColor="red"
      items={relievers.map(reliever => ({
        id: reliever.id,
        content: reliever.content,
        relatedItemIds: reliever.relatedPainIds
      }))}
      customerItems={pains}
      customerItemType="pain"
      customerItemRatingType="severity"
      customerItemRatingLabel="severity"
      itemPlaceholder="How do you relieve customer pains?"
      emptyCustomerItemsMessage="First, add some customer pains in the Customer Profile tab to connect them to your pain relievers."
      onAdd={onAdd}
      onUpdate={onUpdate}
      onDelete={onDelete}
      formPosition={formPosition}
    />
  );
};

export default PainRelievers;
