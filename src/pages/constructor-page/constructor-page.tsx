import { useSelector } from '../../services/store';
import { ConstructorPageUI } from '@ui-pages';
import { FC } from 'react';
import { getIngredientsLoading } from '../../slices/ingredientsSlice';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(getIngredientsLoading);

  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
