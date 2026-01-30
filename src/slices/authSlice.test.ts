import { 
  authSlice, 
  loginUser, 
  clearAuthError, 
  clearPasswordState,
  setUser 
} from './authSlice';

describe('authSlice', () => {
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(authSlice.getInitialState()).toEqual({
        user: null,
        loading: false,
        error: null,
        forgotPasswordSuccess: false,
        resetPasswordSuccess: false,
        authChecked: false
      });
    });
  });

  describe('reducers', () => {
    it('should handle clearAuthError', () => {
      const stateWithError = {
        user: null,
        loading: false,
        error: 'Some error',
        forgotPasswordSuccess: false,
        resetPasswordSuccess: false,
        authChecked: false
      };

      const action = clearAuthError();
      const state = authSlice.reducer(stateWithError, action);
      
      expect(state.error).toBeNull();
    });

    it('should handle clearPasswordState', () => {
      const stateWithPasswordSuccess = {
        user: null,
        loading: false,
        error: null,
        forgotPasswordSuccess: true,
        resetPasswordSuccess: true,
        authChecked: false
      };

      const action = clearPasswordState();
      const state = authSlice.reducer(stateWithPasswordSuccess, action);
      
      expect(state.forgotPasswordSuccess).toBe(false);
      expect(state.resetPasswordSuccess).toBe(false);
    });

    it('should handle setUser', () => {
      const action = setUser(mockUser as any);
      const state = authSlice.reducer(authSlice.getInitialState(), action);
      
      expect(state.user).toEqual(mockUser);
    });
  });

  describe('async thunk loginUser', () => {
    it('should set loading to true and clear error on pending', () => {
      const action = { type: loginUser.pending.type };
      const state = authSlice.reducer(
        {
          user: null,
          loading: false,
          error: 'Previous error',
          forgotPasswordSuccess: false,
          resetPasswordSuccess: false,
          authChecked: false
        },
        action
      );
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set loading to false and update user on fulfilled', () => {
      const action = { 
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = authSlice.reducer(
        {
          user: null,
          loading: true,
          error: null,
          forgotPasswordSuccess: false,
          resetPasswordSuccess: false,
          authChecked: false
        },
        action
      );
      
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
    });

    it('should set loading to false and update error on rejected', () => {
      const errorMessage = 'Invalid credentials';
      const action = { 
        type: loginUser.rejected.type,
        payload: errorMessage
      };
      const state = authSlice.reducer(
        {
          user: null,
          loading: true,
          error: null,
          forgotPasswordSuccess: false,
          resetPasswordSuccess: false,
          authChecked: false
        },
        action
      );
      
      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe(errorMessage);
    });
  });
});
