import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  const isConstructor = location.pathname === '/';
  const isFeed = location.pathname === '/feed';
  const isProfile = location.pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {/* Конструктор */}
          <Link
            to='/'
            className={`${styles.link} ${isConstructor ? styles.link_active : ''}`}
          >
            <BurgerIcon type={isConstructor ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>

          {/* Лента заказов */}
          <Link
            to='/feed'
            className={`${styles.link} ${isFeed ? styles.link_active : ''}`}
          >
            <ListIcon type={isFeed ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </div>

        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>

        <div className={styles.link_position_last}>
          {/* Личный кабинет */}
          <Link
            to='/profile'
            className={`${styles.link} ${isProfile ? styles.link_active : ''}`}
          >
            <ProfileIcon type={isProfile ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
