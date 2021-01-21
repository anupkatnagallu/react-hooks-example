import { useReducer, useCallback } from 'react';

const initialState = { loading: false, error: null, data: null, extra: null, identifier: '' };

const httpReducer = (currHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return { ...currHttpState, loading: true, error: null, data: null, identifier: action.identifier };
        case 'SUCCESS':
            return { ...currHttpState, loading: false, data: action.responseData, extra: action.extra };
        case 'FAIL':
            return { ...currHttpState, loading: false, error: action.errorMsg };
        case 'CLEAR':
            return initialState;
        default:
            throw new Error('Should not get here!')
    }
}

const useHttp = () => {

  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => {
    dispatchHttp({type: 'CLEAR'});
  }, [])

  const sendRequest = useCallback((url, method, body, extra, identifier) => {
    dispatchHttp({type: 'SEND', identifier: identifier});
    fetch(url, {
        method: method,
        body: body,
        headers: { 'Content-Type': 'application/json' }
      }).then(response => {
        return response.json();
      }).then(responseData => {
        dispatchHttp({type: 'SUCCESS', responseData: responseData, extra: extra});
      }).catch(error => {
        dispatchHttp({type: 'FAIL', errorMsg: 'Something went wrong!'});
      });
  }, []);

  return {
      isLoading: httpState.loading,
      error: httpState.error,
      data: httpState.data,
      sendRequest: sendRequest,
      extra: httpState.extra,
      identifier: httpState.identifier,
      clear: clear
  }

}

export default useHttp;