import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { LoginUI } from '@ui-pages';
import {
  loginUser,
  getAuthError,
  getAuthLoading
} from '../../slices/authSlice';
import { Preloader } from '../../components/ui';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector(getAuthError);
  const loading = useSelector(getAuthLoading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch(() => {
        // Ошибка входа
      });
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
