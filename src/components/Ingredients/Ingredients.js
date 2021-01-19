import React, { useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

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

const httpReducer = (currHttpState, action) => {
  switch(action.type) {
    case 'SEND':
      console.log('SEND');
      return {loading: true, error: null};
    case 'SUCCESS':
      return {...currHttpState, loading: false};
    case 'FAIL':
      return {loading: false, error: action.errorMsg};
    case 'CLEAR':
      return {...currHttpState, error: null};
    default:
      throw new Error('Should not get here!')
  }
}

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);

  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });

  useEffect(() => {
    console.log('Rendering', ingredients);
  }, [ingredients]);

  const filteredIngredientsHandler = useCallback(ings => {
    dispatch({ type: 'SET', ingredients: ings});
  }, []);

  const addIngredientHandler = ingredient => {
    dispatchHttp({type: 'SEND'});
    fetch('https://react-hooks-example-ab5dc-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      dispatchHttp({type: 'SUCCESS'});
      dispatch({ type: 'ADD', ingredient: {id: responseData.name, ...ingredient}});
    }).catch(error => {
      dispatchHttp({type: 'FAIL', errorMsg: 'Something went wrong!'});
    });
  }

  const removeIngredientHandler = id => {
    dispatchHttp({type: 'SEND'});
    fetch(`https://react-hooks-example-ab5dc-default-rtdb.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(response => {
      dispatchHttp({type: 'SUCCESS'});
      dispatch({type: 'REMOVE', id: id});
    }).catch(error => {
      dispatchHttp({type: 'FAIL', errorMsg: 'Something went wrong!'});
    });
  }

  const closeErrorHandler = () => {
    dispatchHttp({type: 'CLEAR'});
  }

  console.log(httpState);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} isLoading={httpState.loading} />
      {httpState.error ? <ErrorModal onClose={closeErrorHandler}>{httpState.error}</ErrorModal> : null}

      <section>
        <Search filterIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
