
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UspCanvas } from '../types';

export const useValueMapItems = (
  canvas: UspCanvas,
  setCanvas: React.Dispatch<React.SetStateAction<UspCanvas>>,
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Product Services
  const addProductService = useCallback((content: string, relatedJobIds: string[]) => {
    const newProductService = { id: uuidv4(), content, relatedJobIds };
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      productServices: [...prevCanvas.productServices, newProductService],
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  const updateProductService = useCallback((id: string, content: string, relatedJobIds: string[]) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      productServices: prevCanvas.productServices.map(productService =>
        productService.id === id ? { ...productService, content, relatedJobIds } : productService
      ),
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  const deleteProductService = useCallback((id: string) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      productServices: prevCanvas.productServices.filter(productService => productService.id !== id),
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  // Pain Relievers
  const addPainReliever = useCallback((content: string, relatedPainIds: string[]) => {
    const newPainReliever = { id: uuidv4(), content, relatedPainIds };
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      painRelievers: [...prevCanvas.painRelievers, newPainReliever],
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  const updatePainReliever = useCallback((id: string, content: string, relatedPainIds: string[]) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      painRelievers: prevCanvas.painRelievers.map(painReliever =>
        painReliever.id === id ? { ...painReliever, content, relatedPainIds } : painReliever
      ),
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  const deletePainReliever = useCallback((id: string) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      painRelievers: prevCanvas.painRelievers.filter(painReliever => painReliever.id !== id),
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  // Gain Creators
  const addGainCreator = useCallback((content: string, relatedGainIds: string[]) => {
    const newGainCreator = { id: uuidv4(), content, relatedGainIds };
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      gainCreators: [...prevCanvas.gainCreators, newGainCreator],
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  const updateGainCreator = useCallback((id: string, content: string, relatedGainIds: string[]) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      gainCreators: prevCanvas.gainCreators.map(gainCreator =>
        gainCreator.id === id ? { ...gainCreator, content, relatedGainIds } : gainCreator
      ),
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  const deleteGainCreator = useCallback((id: string) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      gainCreators: prevCanvas.gainCreators.filter(gainCreator => gainCreator.id !== id),
    }));
    setIsSaved(false);
  }, [setCanvas, setIsSaved]);

  return {
    addProductService,
    updateProductService,
    deleteProductService,
    addPainReliever,
    updatePainReliever,
    deletePainReliever,
    addGainCreator,
    updateGainCreator,
    deleteGainCreator
  };
};
