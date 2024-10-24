import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {}
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const logout = () => (dispatch) => {};
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await api.post("/user", { email, name, password });
      // 성공
      // 1. 성공 토스트 메세지 보여주기
      // uiSlice에 있는 reducer호출 ... dispatch(reducer)
      // reducer에서 payload객체 {message: "~", status: "~"}사용 가능
      dispatch(
        showToastMessage({
          message: "회원가입을 성공했습니다!",
          status: "success",
        })
      );
      // 2. 로그인페이지 리다이렉트
      navigate("/login");
      return res.data.data;
    } catch (error) {
      // 실패
      // 1. 실패 토스트 메세지 보여주기
      dispatch(
        showToastMessage({
          message: "회원가입에 실패했습니다!",
          status: "error",
        })
      );
      // 2. 에러값을 저장
      return rejectWithValue(error.error); // 다시 확인하기
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {}
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  // 동기적 호출
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  // 주로 비동기적 호출 (외부라이브러리에 의한 호출)
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload;
      });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
