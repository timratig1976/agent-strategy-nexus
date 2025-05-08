
import React from 'react';
import { CustomerPain, PainReliever } from './types';
import RelatedItemList from './components/RelatedItemList';
import SectionHeader from './components/SectionHeader';

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
    <>
      <SectionHeader
        title="Pain Relievers"
        tooltipTitle="What are Pain Relievers?"
        tooltipContent="Describe how your products and services alleviate specific customer pains. These are the features that eliminate or reduce negative emotions, costs, and situations that customers experience."
      />
      
      <RelatedItemList
        description=""
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
        itemPlaceholder="Add new pain reliever..."
        emptyCustomerItemsMessage="First, add some customer pains in the Customer Profile tab to connect them to your pain relievers."
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
        formPosition={formPosition}
      />
    </>
  );
};

export default PainRelievers;
