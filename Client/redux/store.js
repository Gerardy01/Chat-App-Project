import { configureStore } from '@reduxjs/toolkit';

import registerDataReducer from './features/registerDataSlice';

export const store = configureStore({
    reducer: {
        registerData: registerDataReducer,
    }
});