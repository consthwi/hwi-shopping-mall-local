import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

// 로그인 버튼 클릭 시 요청받는 API
export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      // => authController.loginWithEmail로부터 data: {status, user, token} 받음.
      sessionStorage.setItem("token", res.data.token);
      return res.data;
      // 1. 성공
      // 1-1. Loginpage에서 main으로 리다이렉트
      // 1-2. session storage에 토큰 저장
      // 1-3. 성공 시 data return, fulfilled 대기
    } catch (error) {
      // 2. 실패
      // 2-1. 실패한 에러값 return, reject 대기
      return rejectWithValue(error.error);
    }
  }
);

// 구글로그인 버튼 클릭 시 요청받는 API
export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    // api에서 header에 `Bearer token`으로 세팅
    try {
    } catch (error) {}
  }
);

export const logout = () => (dispatch) => {
  // 토큰 정보를 지운다.
  sessionStorage.removeItem("token");
  // reducer user정보 null로 변경 필요
  // userSlice의 비동기적 logout action 요청
  dispatch(userSlice.actions.logout());
};

// 회원가입 버튼 클릭 시 요청받는 API
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    // createAsyncThunk("name", async({사용자정의값}, {thunkAPI 메서드})=>{})
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
      return res.data.data; // fulfilled 사용대기
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
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/user/me");
      // => userController.getUser요청, token id 해당하는 유저 data return
      return res.data;
    } catch (error) {
      return rejectWithValue(error.error);
      // => but, 뒤에서 이루어지는 작업이기 때문에 rejected를 고려할 필요는 없다.
    }
  }
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
    logout: (state) => {
      state.loginError = null;
      state.user = null;
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
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = true;
        state.loginError = action.payload; // error.error
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user; // 다시
      });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
