import React, { useState, useEffect } from "react"
import "./App.css"
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core"
import InfoBox from "./InfoBox"
import Map from "./Map"
import Table from "./Table"
import { sortData } from "./util"
import LineGraph from "./LineGraph"
import "leaflet/dist/leaflet.css"

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("worldwide")
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => setCountryInfo(data))
  }, [])
  useEffect(() => {
    const getCountrisData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2, // Country Code Like In
          }))

          const sortedData = sortData(data)
          setTableData(sortedData)
          setMapCountries(data)
          setCountries(countries)
        })
    }
    getCountrisData()
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode)
        setCountryInfo(data)
        if (countryCode === "worldwide") {
          setMapCenter({ lat: 34.80746, lng: -40.4796 })
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        }
      })
  }
  //
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered "
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        {/* Map Component  */}
        <Map countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new Cases </h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  )
}

export default App
