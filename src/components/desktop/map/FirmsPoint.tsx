import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Marker, useMapEvents, useMap } from 'react-leaflet';
import { firms_cache_location } from '../../../function/map_firms';
import L from 'leaflet';

export default function MarkerFirms(prop) {
    const map = useMap();
    const [data, setData] = useState<any[]>([]);
    const [zooms, setZooms] = useState<number>();

    async function get_markers(e) {
        const mapBounds = e.getBounds();
        const maker_location = await firms_cache_location(mapBounds);

        if (maker_location) {
            setData(maker_location);
        }
    }

    useMapEvents({
        dragend: async (e) => {
            get_markers(e.target);
            setZooms(e.target.getZoom() * 2.5);
        },
        zoom: async (e) => {
            get_markers(e.target);
            setZooms(e.target.getZoom() * 2.5);
        }
    });

    const [firstLoading, setStatusLoading] = useState<boolean>(true);

    useLayoutEffect(() => {
        if (firstLoading) {
            setStatusLoading(false);
            return;
        }
    }, [firstLoading]);

    const get_first_data = async () => {
        if (!firstLoading) {
            return;
        }
        get_markers(map);
        setZooms(map.getZoom() * 2.5);
    };

    useEffect(() => {
        get_first_data();
        setZooms(map.getZoom() * 2.5);
    }, [prop.use]);

    // สร้าง Canvas Icon
    const canvasIcon = (size) => {
        return L.icon({
            iconUrl: createCanvasIcon(size),
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2], // จุดยึดที่กึ่งกลางวงกลม
        });
    };

    // ฟังก์ชันสร้าง Canvas Icon (วงกลมสีแดง)
    const createCanvasIcon = (size) => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            // วาดวงกลมสีแดง (หลัก)
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI);
            ctx.fillStyle = '#FF0000'; // สีแดง
            ctx.fill();
        }

        return canvas.toDataURL();
    };

    return (
        <>
            {prop.use && data.map((marker: any, index: number) => (
                <Marker
                    key={index}
                    position={[marker.latitude, marker.longitude]}
                    icon={canvasIcon(zooms || 24)} // ใช้ zooms หรือ default เป็น 24
                />
            ))}
        </>
    );
}