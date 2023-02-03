import { Alert, Button, Drawer, Input, List, Space } from "antd";
import {
  CloseOutlined,
  HistoryOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import Geocode from "react-geocode";
import { useDispatch, useSelector } from "react-redux";
import {
  addToHistory,
  removeAllHistory,
  removeFromHistory,
} from "../../redux/actions/searchActions";
import "./InputSearchMap.css";
import ReactGoogleAutocomplete from "react-google-autocomplete";

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API);

const InputSearchMap = ({ location, setLocation }) => {
  const dispatch = useDispatch();
  const [searchLocation, setSearchLocation] = useState("");
  const [searchHistory, setSearchHistory] = useState("");
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const { searchHistories } = useSelector((state) => state.searchHistory);
  const inputAddressMap = useRef(null);

  const handleSearchAddress = (e) => {
    e.preventDefault();
    handleSearchAddressName(searchLocation);
  };

  const handleClickSearchHistory = (name) => {
    setOpen(false);
    inputAddressMap.current.value = name;
    handleSearchAddressName(name);
    dispatch(
      addToHistory({
        key: new Date().getTime(),
        search: name,
      })
    );
  };

  const handleSearchAddressName = (name) => {
    setError(false);
    Geocode.fromAddress(name).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        Geocode.fromLatLng(`${lat}`, `${lng}`).then((response) => {
          setSearchLocation(response.results[0].formatted_address);
        });
        setLocation({
          ...location,
          coordinates: {
            lat: lat,
            lng: lng,
          },
        });
      },
      (err) => setError(true)
    );
  };

  const handleClickSuggestion = (e) => {
    setError(false);
    dispatch(
      addToHistory({
        key: new Date().getTime(),
        search: e.formatted_address || e.name,
      })
    );
    setLocation({
      ...location,
      coordinates: {
        lat: e.geometry.location.lat(),
        lng: e.geometry.location.lng(),
      },
    });
  };

  return (
    <div className="inputSearchMap">
      <Space direction="vertical" align="start">
        {error && <Alert message="Location not found" type="error" showIcon />}
        <Space>
          <form onSubmit={handleSearchAddress} className="inputSearchMap__form">
            <SearchOutlined />
            <ReactGoogleAutocomplete
              placeholder="Search location here..."
              ref={inputAddressMap}
              onChange={(e) => setSearchLocation(e.target.value)}
              apiKey={process.env.REACT_APP_GOOGLE_MAP_API}
              onPlaceSelected={handleClickSuggestion}
            />
          </form>

          <Button onClick={() => setOpen(true)} size="large">
            <HistoryOutlined />
          </Button>
        </Space>
      </Space>
      <Drawer
        title="Your search history"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
      >
        <Space align="center" style={{ marginBottom: "1rem", width: "100%" }}>
          <Input
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Searh your history..."
            value={searchHistory}
            onChange={(e) => setSearchHistory(e.target.value)}
          />
          <Button
            type="link"
            danger
            size="small"
            style={{ fontSize: "0.75rem" }}
            className="inputSearchMap__drawerCleanAll"
            onClick={() => dispatch(removeAllHistory())}
          >
            Clear All
          </Button>
        </Space>
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={searchHistories}
          renderItem={(item) =>
            item.search.includes(searchHistory) && (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    danger
                    onClick={() => dispatch(removeFromHistory(item.key))}
                  >
                    <CloseOutlined />
                  </Button>,
                ]}
              >
                <div onClick={() => handleClickSearchHistory(item.search)}>
                  {item.search}
                </div>
              </List.Item>
            )
          }
        />
      </Drawer>
    </div>
  );
};
export default InputSearchMap;
