import * as React from 'react';

export const navigation = React.createRef();

export function navigate(name, params) {
    navigation.current?.navigate(name, params);
}
