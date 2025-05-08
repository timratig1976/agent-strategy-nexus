
import React, { useState, useRef, useEffect } from 'react';
import { CustomerPain } from './types';
import EmptyState from './components/EmptyState';
import ItemCard from './components/ItemCard';
import AddItemForm from './components/AddItemForm';
import ItemListControls from './components/ItemListControls';
import SelectedItemsNotification from './components/SelectedItemsNotification';
import SectionHeader from './components/SectionHeader';

interface CustomerPainsProps {
  pains: CustomerPain[];
  onAdd: (content: string, severity: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  onUpdate: (id: string, content: string, severity: 'low' | 'medium' | 'high') => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedPains: CustomerPain[]) => void;
  formPosition?: 'top' | 'bottom';
}

const CustomerPains = ({ pains, onAdd, onUpdate, onDelete, onReorder, formPosition = 'bottom' }: CustomerPainsProps) => {
  const [newPainContent, setNewPainContent] = useState('');
  const [newPainSeverity, setNewPainSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedPains, setSelectedPains] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<null | string>(null);
  const [aiOnlyFilter, setAiOnlyFilter] = useState<boolean>(false);
  const newPainInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Maintain focus on the input field
    if (formPosition === 'top' && newPainInputRef.current) {
      newPainInputRef.current.focus();
    }
  }, [formPosition]);

  const handleAddPain = () => {
    if (newPainContent.trim()) {
      onAdd(newPainContent.trim(), newPainSeverity, false);
      setNewPainContent('');
      // Maintain focus on the input
      setTimeout(() => {
        if (newPainInputRef.current) {
          newPainInputRef.current.focus();
        }
      }, 0);
    }
  };

  const toggleSelectPain = (painId: string) => {
    if (selectedPains.includes(painId)) {
      setSelectedPains(selectedPains.filter(id => id !== painId));
    } else {
      setSelectedPains([...selectedPains, painId]);
    }
  };

  const handleDeleteSelected = () => {
    selectedPains.forEach(id => onDelete(id));
    setSelectedPains([]);
    setIsSelectMode(false);
  };

  const handleDeleteAIGenerated = () => {
    const aiGeneratedPains = pains.filter(pain => pain.isAIGenerated).map(pain => pain.id);
    aiGeneratedPains.forEach(id => onDelete(id));
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedPains([]);
  };

  const handleDragStart = (e: React.DragEvent, painId: string) => {
    setDraggedItem(painId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (draggedItem !== null && draggedItem !== targetId && onReorder) {
      const currentPains = [...filteredPains];
      const draggedIndex = currentPains.findIndex(pain => pain.id === draggedItem);
      const targetIndex = currentPains.findIndex(pain => pain.id === targetId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [removed] = currentPains.splice(draggedIndex, 1);
        currentPains.splice(targetIndex, 0, removed);
        onReorder(currentPains);
      }
    }
    
    setDraggedItem(null);
  };

  // Filter AI-generated pains if needed
  const filteredPains = aiOnlyFilter ? pains.filter(pain => pain.isAIGenerated) : pains;
  const aiGeneratedCount = pains.filter(pain => pain.isAIGenerated).length;

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Customer Pains"
        tooltipTitle="What are Customer Pains?"
        tooltipContent="Customer pains describe anything that annoys your customers before, during, and after trying to get a job done. This includes undesired outcomes, problems, and obstacles that prevent customers from getting a job done."
      />

      {formPosition === 'top' && (
        <AddItemForm 
          value={newPainContent}
          onChange={setNewPainContent}
          onAdd={handleAddPain}
          rating={newPainSeverity}
          onRatingChange={setNewPainSeverity}
          inputRef={newPainInputRef}
          placeholder="Add a new customer pain..."
          ratingLabel="pain"
        />
      )}

      <ItemListControls 
        aiOnlyFilter={aiOnlyFilter}
        setAiOnlyFilter={setAiOnlyFilter}
        aiGeneratedCount={aiGeneratedCount}
        handleDeleteAIGenerated={handleDeleteAIGenerated}
        isSelectMode={isSelectMode}
        toggleSelectMode={toggleSelectMode}
        hasItems={pains.length > 0}
      />

      <SelectedItemsNotification 
        selectedCount={selectedPains.length}
        handleDeleteSelected={handleDeleteSelected}
        itemLabel="pains"
      />

      {filteredPains.length === 0 ? (
        <EmptyState aiOnlyFilter={aiOnlyFilter} itemType="pains" />
      ) : (
        <div className="space-y-2">
          {filteredPains.map((pain) => (
            <ItemCard 
              key={pain.id}
              id={pain.id}
              content={pain.content}
              rating={pain.severity}
              ratingLabel="severity"
              isAIGenerated={pain.isAIGenerated}
              isSelected={selectedPains.includes(pain.id)}
              isSelectMode={isSelectMode}
              isDragged={draggedItem === pain.id}
              isDraggable={onReorder !== undefined}
              onContentChange={(value) => onUpdate(pain.id, value, pain.severity)}
              onToggleSelect={() => toggleSelectPain(pain.id)}
              onDelete={() => onDelete(pain.id)}
              onDragStart={(e) => handleDragStart(e, pain.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, pain.id)}
              placeholderText="What frustrates or annoys your customer?"
            />
          ))}
        </div>
      )}

      {formPosition === 'bottom' && (
        <AddItemForm 
          value={newPainContent}
          onChange={setNewPainContent}
          onAdd={handleAddPain}
          rating={newPainSeverity}
          onRatingChange={setNewPainSeverity}
          inputRef={newPainInputRef}
          placeholder="Add a new customer pain..."
          ratingLabel="pain"
        />
      )}
    </div>
  );
};

export default CustomerPains;
