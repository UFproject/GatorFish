import { createSlice } from '@reduxjs/toolkit'
import { request } from '../../utils/request'

const userStore = createSlice({
  name: 'user',

  initialState: {
    token: localStorage.getItem('token_key') || '',
  },

  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token_key', action.payload)
    },
    clearUserInfo (state) {
      state.token = ''
      localStorage.removeItem('token_key')
    }
  },
});

const { setToken, clearUserInfo } = userStore.actions
const userReducer = userStore.reducer

const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    const res = await request.post('/auth/login', loginForm)
    //console.log(res)
    dispatch(setToken(res.token))
  }
}

export { fetchLogin, setToken, clearUserInfo}
export default userReducer;