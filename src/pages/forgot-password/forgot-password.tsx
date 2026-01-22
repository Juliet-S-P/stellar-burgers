import { FC, useState, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import {
  forgotPassword,
  getAuthError,
  getAuthLoading,
  getForgotPasswordSuccess
} from '../../slices/authSlice';
import { Preloader } from '../../components/ui';

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const error = useSelector(getAuthError);
  const loading = useSelector(getAuthLoading);
  const success = useSelector(getForgotPasswordSuccess);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(forgotPassword(email))
      .unwrap()
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch(() => {});
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <ForgotPasswordUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
