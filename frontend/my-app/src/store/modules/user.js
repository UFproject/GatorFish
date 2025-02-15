import { createSlice } from '@reduxjs/toolkit'
import { request } from '../../utils/request'

const userStore = createSlice({
  name: 'user',

  initialState: {
    token: '',
  },

  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    }
  },
});

const { setToken } = userStore.actions
const userReducer = userStore.reducer

const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    const res = await request.post('/login', loginForm)
    //console.log(res)
    dispatch(setToken(res.token))
  }
}

export { fetchLogin, setToken }
export default userReducer;