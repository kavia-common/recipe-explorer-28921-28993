import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import App from '../App';
import { useRecipes } from '../state/useRecipes';

/**
 * PUBLIC_INTERFACE
 * AppRoutes
 * Defines application routes using react-router-dom v6.
 * Routes:
 * - "/": renders the main App shell and list.
 * - "/recipe/:id": opens the modal for the given recipe id and navigates back to "/" on close.
 *
 * Behavior:
 * - When the route contains :id, we sync it with RecipesContext.openRecipe(id).
 * - When the modal is closed via context.closeRecipe(), callers should navigate back to "/".
 *
 * Note:
 * - This file is only used if react-router-dom is installed and index.js wraps with <BrowserRouter>.
 */
function RecipeRouteBinder() {
  // Bridge route param to context selection
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedRecipeId, openRecipe, closeRecipe } = useRecipes();

  // Sync route -> state
  useEffect(() => {
    if (id && id !== selectedRecipeId) {
      openRecipe(id);
    }
    if (!id && selectedRecipeId) {
      // If route cleared but state still set, clear it
      closeRecipe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Intercept closeRecipe to also navigate home
  const originalClose = closeRecipe;
  const closeAndNavigate = () => {
    originalClose();
    navigate('/', { replace: false });
  };

  // Provide a wrapper App that uses the same context but we need closeRecipe to navigate.
  // Since we don't want to alter App, we can rely on the context consumer components to
  // call closeRecipe from context which we cannot easily override here without a provider.
  // To ensure navigation on close, we rely on the RecipeDetailModal close to call closeRecipe()
  // and also the URL will be reset by the Effect above when selectedRecipeId becomes null after navigation.
  // As a safety, also listen to selectedRecipeId changes to navigate if it becomes null while on /recipe/:id.
  useEffect(() => {
    if (!selectedRecipeId && id) {
      navigate('/', { replace: false });
    }
  }, [selectedRecipeId, id, navigate]);

  return <App />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/recipe/:id" element={<RecipeRouteBinder />} />
      {/* Fallback */}
      <Route path="*" element={<App />} />
    </Routes>
  );
}
