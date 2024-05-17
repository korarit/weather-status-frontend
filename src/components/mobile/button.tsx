import React from 'react';

import '../../css/components/button.css';
import '../../css/icon.css'

export function GpsButton(props) {

    if(navigator.geolocation && props.can_use_gps !== false){
        return (
            <button title='button-gps' className="button-gps flex justify-center items-center" onClick={props.onPress}>
                <i className="icon-svg-gps-map color-gray-500"></i>
            </button>
        );
    }else{
        return (
        <button title='button-gps' className="button-gps flex justify-center items-center" onClick={props.onPress}>
            <i className="icon-svg-gps-close-map color-gray-500"></i>
        </button>
        );
    }

};

export function LayerButton(props) {
    return (
        <button title='layer-map' className="button-layer-map flex justify-center items-center" onClick={props.onPress}>
            <i className="icon-svg-layer-map color-gray-500"></i>
        </button>
    );
};

