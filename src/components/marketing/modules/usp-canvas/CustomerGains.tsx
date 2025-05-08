
import React, { useState, useRef, useEffect } from 'react';
import { CustomerGain } from './types';
import EmptyState from './components/EmptyState';
import ItemCard from './components/ItemCard';
import AddItemForm from './components/AddItemForm';
import ItemListControls from './components/ItemListControls';
import SelectedItemsNotification from './components/SelectedItemsNotification';
import SectionHeader from './components/SectionHeader';

interface CustomerGainsProps {
  gains: CustomerGain[];
  onAdd: (content: string, importance: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  onUpdate: (id: string, content: string, importance: 'low' | 'medium' | 'high') => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedGains: CustomerGain[]) => void;
  formPosition?: 'top' | 'bottom';
}

const CustomerGains = ({ gains, onAdd, onUpdate, onDelete, onReorder, formPosition = 'bottom' }: CustomerGainsProps) => {
  const [newGainContent, setNewGainContent] = useState('');
  const [newGainImportance, setNewGainImportance] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedGains, setSelectedGains] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<null | string>(null);
  const [aiOnlyFilter, setAiOnlyFilter] = useState<boolean>(false);
  const newGainInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Maintain focus on the input field
    if (formPosition === 'top' && newGainInputRef.current) {
      newGainInputRef.current.focus();
    }
  }, [formPosition]);

  const handleAddGain = () => {
    if (newGainContent.trim()) {
      onAdd(newGainContent.trim(), newGainImportance, false);
      setNewGainContent('');
      // Maintain focus on the input
      setTimeout(() => {
        if (newGainInputRef.current) {
          newGainInputRef.current.focus();
        }
      }, 0);
    }
  };

  const toggleSelectGain = (gainId: string) => {
    if (selectedGains.includes(gainId)) {
      setSelectedGains(selectedGains.filter(id => id !== gainId));
    } else {
      setSelectedGains([...selectedGains, gainId]);
    }
  };

  const handleDeleteSelected = () => {
    selectedGains.forEach(id => onDelete(id));
    setSelectedGains([]);
    setIsSelectMode(false);
  };

  const handleDeleteAIGenerated = () => {
    const aiGeneratedGains = gains.filter(gain => gain.isAIGenerated).map(gain => gain.id);
    aiGeneratedGains.forEach(id => onDelete(id));
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedGains([]);
  };

  const handleDragStart = (e: React.DragEvent, gainId: string) => {
    setDraggedItem(gainId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (draggedItem !== null && draggedItem !== targetId && onReorder) {
      const currentGains = [...filteredGains];
      const draggedIndex = currentGains.findIndex(gain => gain.id === draggedItem);
      const targetIndex = currentGains.findIndex(gain => gain.id === targetId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [removed] = currentGains.splice(draggedIndex, 1);
        currentGains.splice(targetIndex, 0, removed);
        onReorder(currentGains);
      }
    }
    
    setDraggedItem(null);
  };

  // Filter AI-generated gains if needed
  const filteredGains = aiOnlyFilter ? gains.filter(gain => gain.isAIGenerated) : gains;
  const aiGeneratedCount = gains.filter(gain => gain.isAIGenerated).length;

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Customer Gains"
        tooltipTitle="What are Customer Gains?"
        tooltipContent="Customer gains describe the outcomes and benefits your customers want. Some are required, expected, or desired, and some would surprise them. These include functional utility, social gains, positive emotions, and cost savings."
      />

      {formPosition === 'top' && (
        <AddItemForm 
          value={newGainContent}
          onChange={setNewGainContent}
          onAdd={handleAddGain}
          rating={newGainImportance}
          onRatingChange={setNewGainImportance}
          inputRef={newGainInputRef}
          placeholder="Add a new customer gain..."
          ratingLabel="gain"
        />
      )}

      <ItemListControls 
        aiOnlyFilter={aiOnlyFilter}
        setAiOnlyFilter={setAiOnlyFilter}
        aiGeneratedCount={aiGeneratedCount}
        handleDeleteAIGenerated={handleDeleteAIGenerated}
        isSelectMode={isSelectMode}
        toggleSelectMode={toggleSelectMode}
        hasItems={gains.length > 0}
      />

      <SelectedItemsNotification 
        selectedCount={selectedGains.length}
        handleDeleteSelected={handleDeleteSelected}
        itemLabel="gains"
      />

      {filteredGains.length === 0 ? (
        <EmptyState aiOnlyFilter={aiOnlyFilter} itemType="gains" />
      ) : (
        <div className="space-y-2">
          {filteredGains.map((gain) => (
            <ItemCard 
              key={gain.id}
              id={gain.id}
              content={gain.content}
              rating={gain.importance}
              ratingLabel="importance"
              isAIGenerated={gain.isAIGenerated}
              isSelected={selectedGains.includes(gain.id)}
              isSelectMode={isSelectMode}
              isDragged={draggedItem === gain.id}
              isDraggable={onReorder !== undefined}
              onContentChange={(value) => onUpdate(gain.id, value, gain.importance)}
              onToggleSelect={() => toggleSelectGain(gain.id)}
              onDelete={() => onDelete(gain.id)}
              onDragStart={(e) => handleDragStart(e, gain.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, gain.id)}
              placeholderText="What benefits does your customer desire?"
            />
          ))}
        </div>
      )}

      {formPosition === 'bottom' && (
        <AddItemForm 
          value={newGainContent}
          onChange={setNewGainContent}
          onAdd={handleAddGain}
          rating={newGainImportance}
          onRatingChange={setNewGainImportance}
          inputRef={newGainInputRef}
          placeholder="Add a new customer gain..."
          ratingLabel="gain"
        />
      )}
    </div>
  );
};

export default CustomerGains;
