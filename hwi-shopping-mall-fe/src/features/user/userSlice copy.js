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

// 회원가입 백엔드
// registerUser api생성 => userSlice의 extraReducer로 사용
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await api.post("/user", { email, name, password });
      dispatch(
        showToastMessage({
          message: "회원가입이 완료되었습니다.",
          status: "success",
        })
      );
      navigate("/login");
      return res.data.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "회원가입에 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
      // reject에 { status: "fail", error: //error.message// } 사용
    }
    // 1. 성공
    // 1-1. 토스트메시지 성공 출력
    // 1-2. 로그인페이지 리다이렉트
    // 1-3. data를 return하여 fulfilled실행
    // 2. 실패
    // 2-1. 토스트메시지 실패 출력
    // 2-2. thunkAPI(rejectWithValue)로 reject실행
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
