import React from 'react';
import { BuilderComponent } from '../../../../../types';
import ComponentListView from './ComponentList/ComponentList.view';

interface Props {
    components: BuilderComponent[];
    onItemClick?: (component: BuilderComponent) => void;
}

export default function ComponentList({ components, onItemClick }: Props) {
    return (
        <ComponentListView
            components={components}
            onItemClick={onItemClick}
        />
    );
}