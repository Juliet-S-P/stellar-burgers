import { FC } from 'react';
import { useDispatch } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutUser } from '../../slices/authSlice';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch(() => {
        // Ошибка при выходе
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
