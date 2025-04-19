import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 

export default function LocationPicker({ onLocationSelected }) {
  const [position, setPosition] = useState(null);

  const defaultCenter = [35.6892, 51.3890]; 
  const defaultZoom = 13;

  const MapEvents = () => {
    const map = useMapEvents({
      click: (e) => {
        setPosition(e.latlng);
        onLocationSelected(e.latlng);
      },
    });
    return null;
  }

  return (

    <MapContainer center={defaultCenter} zoom={defaultZoom} className="h-72 w-full"> 
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents />
      {position && <Marker position={position} draggable={true} eventHandlers={{
        dragend: (e) => {
          const newPos = e.target.getLatLng();
          setPosition(newPos);
          onLocationSelected(newPos); // به‌روزرسانی موقعیت بعد از جابجایی
        }
      }} />}
    </MapContainer>
  );
  
}