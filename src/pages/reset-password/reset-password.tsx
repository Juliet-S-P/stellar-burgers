import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordUI } from '@ui-pages';
import {
  resetPassword,
  getAuthError,
  getAuthLoading,
  getResetPasswordSuccess
} from '../../slices/authSlice';
import { Preloader } from '../../components/ui';

export const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const error = useSelector(getAuthError);
  const loading = useSelector(getAuthLoading);
  const success = useSelector(getResetPasswordSuccess);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(resetPassword({ password, token }))
      .unwrap()
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <ResetPasswordUI
      errorText={error || ''}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
