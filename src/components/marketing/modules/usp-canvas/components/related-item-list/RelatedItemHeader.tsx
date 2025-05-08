
import React from 'react';

interface RelatedItemHeaderProps {
  title: string;
  description: string;
  bgColor: string;
  titleColor: string;
  textColor: string;
}

const RelatedItemHeader = ({
  title,
  description,
  bgColor,
  titleColor,
  textColor
}: RelatedItemHeaderProps) => {
  return (
    <div className={`bg-${bgColor}-50 p-4 rounded-lg`}>
      <h3 className={`text-base font-medium text-${titleColor}-800 mb-2`}>What are {title}?</h3>
      <p className={`text-sm text-${textColor}-700`}>
        {description}
      </p>
    </div>
  );
};

export default RelatedItemHeader;
