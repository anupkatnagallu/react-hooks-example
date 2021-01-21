import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {
  const [enteredFilter, setEnteredFilter] = useState('');

  const inputRef = useRef();

  const { filterIngredients } = props;

  const { isLoading, error, data, sendRequest, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter === '' ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest('https://react-hooks-example-ab5dc-default-rtdb.firebaseio.com/ingredients.json' + query, 'GET');
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    }

  }, [enteredFilter, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const ings = [];
      for (let key in data) {
        ings.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      filterIngredients(ings);
    }

  }, [data, isLoading, error, filterIngredients])

  return (
    <section className="search">
      {error ? <ErrorModal onClose={clear}>{error}</ErrorModal> : null}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading ? <span>Loading...</span> : null}
          <input ref={inputRef} type="text" value={enteredFilter} onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
