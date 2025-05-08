
import React from 'react';
import SectionHeader from '../SectionHeader';

interface CustomerItemHeaderProps {
  title: string;
  tooltipTitle: string;
  tooltipContent: string;
}

const CustomerItemHeader = ({
  title,
  tooltipTitle,
  tooltipContent
}: CustomerItemHeaderProps) => {
  return (
    <SectionHeader 
      title={title}
      tooltipTitle={tooltipTitle}
      tooltipContent={tooltipContent}
    />
  );
};

export default CustomerItemHeader;
