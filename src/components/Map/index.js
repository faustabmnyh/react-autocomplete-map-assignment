// import GoogleMapReact from "google-map-react";
import {
  GoogleMap,
  InfoWindow,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import useGeolocation from "../../hooks/useGeolocation";
import Geocode from "react-geocode";
import { useCallback, useState, memo } from "react";
import { useDispatch } from "react-redux";
import { addToHistory } from "../../redux/actions/searchActions";
import InputSearchMap from "../InputSearchMap";

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API);

const Map = () => {
  const dispatch = useDispatch();
  const [location, setLocation] = useGeolocation();
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [address, setAddress] = useState("");
  const [map, setMap] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API,
    libraries: ["places"],
  });

  const handleClickMap = (e) => {
    handleChangeAddress(e.latLng.lat(), e.latLng.lng());
    setLocation({
      ...location,
      coordinates: {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      },
    });
  };

  const handleChangeAddress = (lat, lng) => {
    Geocode.fromLatLng(`${lat}`, `${lng}`).then(
      (response) => {
        setAddress(response.results[0].formatted_address);
        dispatch(
          addToHistory({
            key: new Date().getTime(),
            search: response.results[0].formatted_address,
          })
        );
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const onLoad = useCallback(
    function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(location.coordinates);
      map.fitBounds(bounds);

      setMap(map);
    },
    [location.coordinates]
  );

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <InputSearchMap location={location} setLocation={setLocation} />
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={location.coordinates}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
        }}
        zoom={15}
        onClick={handleClickMap}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <MarkerF
          position={location.coordinates}
          onClick={() => setShowInfoWindow((showInfoWindow) => !showInfoWindow)}
        >
          {showInfoWindow && (
            <InfoWindow
              position={{
                lat: location.coordinates?.lat,
                lng: location.coordinates?.lng,
              }}
            >
              <span>{address}</span>
            </InfoWindow>
          )}
        </MarkerF>
      </GoogleMap>
    </>
  );
};

export default memo(Map);
