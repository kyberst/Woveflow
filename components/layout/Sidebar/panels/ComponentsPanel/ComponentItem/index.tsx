import React from 'react';
import ComponentItemView from './ComponentItem.view';
import { useComponentItem } from './useComponentItem.hook';
import { BuilderComponent } from '../../../../../../types';

interface Props {
    component: BuilderComponent;
    onClick?: (component: BuilderComponent) => void;
    key?: React.Key;
}

export default function ComponentItem({ component, onClick }: Props) {
  const {
    componentName,
    isClickable,
    handleDragStart,
    handleDragEnd,
    handleClick,
  } = useComponentItem(component, onClick);

  return (
    <ComponentItemView
      componentName={componentName}
      isClickable={isClickable}
      handleDragStart={handleDragStart}
      handleDragEnd={handleDragEnd}
      handleClick={handleClick}
    />
  );
}