import React from "react"
import numeral from "numeral"
import { Circle, Popup } from "react-leaflet"

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multipliter: 800,
  },
  recovered: {
    hex: "#7dd71d",
    multipliter: 1200,
  },
  deaths: {
    hex: "#fb4443",
    multipliter: 2000,
  },
}
export const sortData = (data) => {
  const sortedData = [...data]

  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1))
}

// Draw Circle on the Map
export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multipliter
      }>
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{
              backgroundSize: "cover",
              background: `url(${country.countryInfo.flag})`,
            }}></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirm">
            Cases: {numeral(country.cases).format("0.0")}
          </div>
          <div className="info-recoverd">
            Recoverd: {numeral(country.recovered).format("0.0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0.0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ))
