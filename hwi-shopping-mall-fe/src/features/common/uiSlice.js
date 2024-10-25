import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 이 ui state를 변경하는 것이 action의 목적
  toastMessage: { message: "", status: "" },
  // 'success', 'error', 'warning'
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  // 토스트메시지는 동기적 처리
  reducers: {
    // 너가 나를 호출할 때 넣는 매개변수로 state를 변경해주게따
    showToastMessage(state, action) {
      state.toastMessage = {
        message: action.payload.message,
        status: action.payload.status,
      };
    },
    hideToastMessage(state) {
      state.open = false;
    },
  },
});

export const { showToastMessage, hideToastMessage } = uiSlice.actions;
export default uiSlice.reducer;
