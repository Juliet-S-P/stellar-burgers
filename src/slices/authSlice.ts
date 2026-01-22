import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData,
  TLoginData
} from '../utils/burger-api';
import { setCookie, getCookie, deleteCookie } from '../utils/cookie';
import { TUser } from '@utils-types';
import { RootState } from '../services/store';

type TAuthState = {
  user: TUser | null;
  loading: boolean;
  error: string | null | undefined;
  forgotPasswordSuccess: boolean;
  resetPasswordSuccess: boolean;
  authChecked: boolean;
};

export const initialState: TAuthState = {
  user: null,
  loading: false,
  error: null,
  forgotPasswordSuccess: false,
  resetPasswordSuccess: false,
  authChecked: false
};

export const checkUserAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = getCookie('accessToken');

      if (!accessToken) {
        return null;
      }

      const response = await getUserApi();

      if (response?.success && response?.user) {
        return response.user;
      }

      return null;
    } catch (error: any) {
      if (
        error.message?.includes('401') ||
        error.message?.includes('Unauthorized') ||
        error.message?.includes('Сессия истекла') ||
        error.message?.includes('jwt expired')
      ) {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      }

      return rejectWithValue(error.message || 'Ошибка проверки авторизации');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);

      if (response.success) {
        let tokenValue = response.accessToken;

        if (tokenValue && tokenValue.startsWith('Bearer ')) {
          tokenValue = tokenValue.substring(7);
        }

        setCookie('accessToken', tokenValue, {
          expires: 20 * 60,
          path: '/'
        });

        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }

        return response.user;
      } else {
        return rejectWithValue('Ошибка регистрации');
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка регистрации';
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(credentials);

      if (response.success) {
        let tokenValue = response.accessToken;

        if (tokenValue && tokenValue.startsWith('Bearer ')) {
          tokenValue = tokenValue.substring(7);
        }

        setCookie('accessToken', tokenValue, {
          expires: 20 * 60,
          path: '/'
        });

        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }

        return response.user;
      } else {
        return rejectWithValue('Ошибка входа');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка входа';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка выхода';
      return rejectWithValue(errorMessage);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordApi({ email });
      return response.success;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка восстановления пароля';
      return rejectWithValue(errorMessage);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    { password, token }: { password: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await resetPasswordApi({ password, token });
      return response.success;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка сброса пароля';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: Partial<TUser>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userData);
      return response.user;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Ошибка обновления данных пользователя';
      return rejectWithValue(errorMessage);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearPasswordState: (state) => {
      state.forgotPasswordSuccess = false;
      state.resetPasswordSuccess = false;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    },
    updateWebSocketConnection: (state) => {}
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.authChecked = true;
        state.error = null;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.authChecked = true;
        state.error = action.payload as string;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.forgotPasswordSuccess = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetPasswordSuccess = true;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  clearAuthError,
  clearPasswordState,
  setUser,
  updateWebSocketConnection
} = authSlice.actions;

export const getUser = (state: RootState) => state.auth.user;
export const getAuthLoading = (state: RootState) => state.auth.loading;
export const getAuthError = (state: RootState) => state.auth.error;
export const getAuthChecked = (state: RootState) => state.auth.authChecked;
export const getForgotPasswordSuccess = (state: RootState) =>
  state.auth.forgotPasswordSuccess;
export const getResetPasswordSuccess = (state: RootState) =>
  state.auth.resetPasswordSuccess;

export default authSlice.reducer;
