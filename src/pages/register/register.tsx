import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { RegisterUI } from '@ui-pages';
import {
  registerUser,
  getAuthError,
  getAuthLoading
} from '../../slices/authSlice';
import { Preloader } from '../../components/ui';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector(getAuthError);
  const loading = useSelector(getAuthLoading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(registerUser({ email, password, name: userName }))
      .unwrap()
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch(() => {
        // Ошибка регистрации
      });
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
