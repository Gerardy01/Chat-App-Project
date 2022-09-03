import { createSlice } from '@reduxjs/toolkit';



export const registerDataSlice = createSlice({
    name: "registerData",
    initialState: {
        data: {
            username: '',
            email: '',
            birth: '',
            password: '',
            confirmPassword: ''
        }
    },
    reducers: {
        setRegisterUsername: (state, action) => {
            state.data = {
                ...state.data,
                username: action.payload
            }
        },
        setRegisterEmail: (state, action) => {
            state.data = {
                ...state.data,
                email: action.payload
            }
        },
        setRegisterBirth: (state, action) => {
            state.data = {
                ...state.data,
                birth: action.payload
            }
        },
        setRegisterPassword: (state, action) => {
            state.data = {
                ...state.data,
                password: action.payload
            }
        },
        setRegisterConfirm: (state, action) => {
            state.data = {
                ...state.data,
                confirmPassword: action.payload
            }
        }
    }
});

export default registerDataSlice.reducer;
export const { setRegisterUsername, setRegisterEmail, setRegisterBirth, setRegisterPassword, setRegisterConfirm } = registerDataSlice.actions;