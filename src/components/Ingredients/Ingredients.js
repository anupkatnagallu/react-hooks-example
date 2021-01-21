import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'REMOVE':
      return currentIngredients.filter(ing => action.id !== ing.id);
    default:
      throw new Error('Should not get here!');
  }
}



function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);

  const { isLoading, error, data, sendRequest, extra, identifier, clear } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && identifier === 'DELETE_ID') {
      dispatch({ type: 'REMOVE', id: extra });
    } else if (!isLoading && !error && identifier === 'ADD_ID') {
      dispatch({ type: 'ADD', ingredient: { id: data.name, ...extra } });
    }
  }, [isLoading, error, identifier, data, extra]);

  const filteredIngredientsHandler = useCallback(ings => {
    dispatch({ type: 'SET', ingredients: ings });
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest('https://react-hooks-example-ab5dc-default-rtdb.firebaseio.com/ingredients.json', 'POST', JSON.stringify(ingredient),
      ingredient, 'ADD_ID');
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(id => {
    sendRequest(`https://react-hooks-example-ab5dc-default-rtdb.firebaseio.com/ingredients/${id}.json`, 'DELETE', null, id, 'DELETE_ID');
  }, [sendRequest]);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
    )
  }, [ingredients, removeIngredientHandler]);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} isLoading={isLoading} />
      {error ? <ErrorModal onClose={clear}>{error}</ErrorModal> : null}

      <section>
        <Search filterIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
