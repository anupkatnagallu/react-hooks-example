import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [enteredFilter, setEnteredFilter] = useState('');

  const inputRef = useRef();

  const { filterIngredients } = props;

  useEffect(() => {
    const timer = setTimeout(() => {
      if(enteredFilter === inputRef.current.value){
        const query = enteredFilter === '' ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hooks-example-ab5dc-default-rtdb.firebaseio.com/ingredients.json' + query)
          .then(response => response.json())
          .then(responseData => {
            const ings = [];
            for(let key in responseData) {
              ings.push({ id: key,
                          title: responseData[key].title,
                          amount: responseData[key].amount});
            }
            filterIngredients(ings);
          });
      }
      
    }, 500);

    return () => {
      clearTimeout(timer);
    }
    
  }, [enteredFilter, filterIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={inputRef} type="text" value={enteredFilter} onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
