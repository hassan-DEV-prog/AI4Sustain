// import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
// import { useEffect, useState, useRef } from 'react'

// function iso2ToIso3(iso2) {
//   const map = {
//     AF:'AFG',AL:'ALB',DZ:'DZA',AD:'AND',AO:'AGO',AG:'ATG',AR:'ARG',AM:'ARM',
//     AU:'AUS',AT:'AUT',AZ:'AZE',BS:'BHS',BH:'BHR',BD:'BGD',BB:'BRB',BY:'BLR',
//     BE:'BEL',BZ:'BLZ',BJ:'BEN',BT:'BTN',BO:'BOL',BA:'BIH',BW:'BWA',BR:'BRA',
//     BN:'BRN',BG:'BGR',BF:'BFA',BI:'BDI',CV:'CPV',KH:'KHM',CM:'CMR',CA:'CAN',
//     CF:'CAF',TD:'TCD',CL:'CHL',CN:'CHN',CO:'COL',KM:'COM',CG:'COG',CD:'COD',
//     CR:'CRI',HR:'HRV',CU:'CUB',CY:'CYP',CZ:'CZE',DK:'DNK',DJ:'DJI',DM:'DMA',
//     DO:'DOM',EC:'ECU',EG:'EGY',SV:'SLV',GQ:'GNQ',ER:'ERI',EE:'EST',SZ:'SWZ',
//     ET:'ETH',FJ:'FJI',FI:'FIN',FR:'FRA',GA:'GAB',GM:'GMB',GE:'GEO',DE:'DEU',
//     GH:'GHA',GR:'GRC',GD:'GRD',GT:'GTM',GN:'GIN',GW:'GNB',GY:'GUY',HT:'HTI',
//     HN:'HND',HU:'HUN',IS:'ISL',IN:'IND',ID:'IDN',IR:'IRN',IQ:'IRQ',IE:'IRL',
//     IL:'ISR',IT:'ITA',JM:'JAM',JP:'JPN',JO:'JOR',KZ:'KAZ',KE:'KEN',KI:'KIR',
//     KP:'PRK',KR:'KOR',KW:'KWT',KG:'KGZ',LA:'LAO',LV:'LVA',LB:'LBN',LS:'LSO',
//     LR:'LBR',LY:'LBY',LI:'LIE',LT:'LTU',LU:'LUX',MG:'MDG',MW:'MWI',MY:'MYS',
//     MV:'MDV',ML:'MLI',MT:'MLT',MH:'MHL',MR:'MRT',MU:'MUS',MX:'MEX',FM:'FSM',
//     MD:'MDA',MC:'MCO',MN:'MNG',ME:'MNE',MA:'MAR',MZ:'MOZ',MM:'MMR',NA:'NAM',
//     NR:'NRU',NP:'NPL',NL:'NLD',NZ:'NZL',NI:'NIC',NE:'NER',NG:'NGA',NO:'NOR',
//     OM:'OMN',PK:'PAK',PW:'PLW',PA:'PAN',PG:'PNG',PY:'PRY',PE:'PER',PH:'PHL',
//     PL:'POL',PT:'PRT',QA:'QAT',RO:'ROU',RU:'RUS',RW:'RWA',KN:'KNA',LC:'LCA',
//     VC:'VCT',WS:'WSM',SM:'SMR',ST:'STP',SA:'SAU',SN:'SEN',RS:'SRB',SC:'SYC',
//     SL:'SLE',SG:'SGP',SK:'SVK',SI:'SVN',SB:'SLB',SO:'SOM',ZA:'ZAF',SS:'SSD',
//     ES:'ESP',LK:'LKA',SD:'SDN',SR:'SUR',SE:'SWE',CH:'CHE',SY:'SYR',TW:'TWN',
//     TJ:'TJK',TZ:'TZA',TH:'THA',TL:'TLS',TG:'TGO',TO:'TON',TT:'TTO',TN:'TUN',
//     TR:'TUR',TM:'TKM',TV:'TUV',UG:'UGA',UA:'UKR',AE:'ARE',GB:'GBR',US:'USA',
//     UY:'URY',UZ:'UZB',VU:'VUT',VE:'VEN',VN:'VNM',YE:'YEM',ZM:'ZMB',ZW:'ZWE',
//   }
//   return map[iso2] || null
// }

// function getCountryName(props) {
//   return props.ADMIN || props.NAME || props.name ||
//          props.NAME_EN || props.sovereignt || 'Unknown'
// }

// function getISO3(props) {
//   // Some GeoJSONs have ISO_A3 directly
//   if (props.ISO_A3 && props.ISO_A3 !== '-99') return props.ISO_A3
//   // Fall back to converting ISO_A2
//   if (props.ISO_A2 && props.ISO_A2 !== '-99') return iso2ToIso3(props.ISO_A2)
//   return null
// }

// export default function MapView({ onCountryClick, selectedCode }) {
//   const [geoData, setGeoData] = useState(null)
//   const geoRef = useRef()

//   useEffect(() => {
//     fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
//       .then(r => r.json())
//       .then(data => {
//         // Debug: log first feature's properties so we know exact field names
//         if (data.features?.length > 0) {
//           console.log('GeoJSON props sample:', data.features[0].properties)
//         }
//         setGeoData(data)
//         // inside your useEffect after setGeoData(data):
// console.log('GeoJSON loaded, features:', data.features?.length)
//       })
//       .catch(err => console.error('GeoJSON load failed:', err))
//   }, [])

//   const style = (feature) => {
//     const iso3 = getISO3(feature.properties)
//     const isSelected = iso3 && iso3 === selectedCode
//     return {
//       fillColor  : isSelected ? '#69f0ae' : 'rgba(30,80,30,0.55)',
//       fillOpacity: isSelected ? 0.85 : 0.5,
//       color      : isSelected ? '#69f0ae' : 'rgba(100,200,100,0.3)',
//       weight     : isSelected ? 2 : 0.5,
//     }
//   }

//   const onEachFeature = (feature, layer) => {
//     const props = feature.properties
//     const name  = getCountryName(props)
//     const iso3  = getISO3(props)

//     layer.on({
//       mouseover(e) {
//         e.target.setStyle({
//           fillColor: '#69f0ae', fillOpacity: 0.7,
//           color: '#69f0ae', weight: 1.5
//         })
//         // Only show tooltip if we have a valid name
//         if (name && name !== 'Unknown') {
//           e.target.bindTooltip(
//             `<div style="background:rgba(0,0,0,0.85);color:#81c784;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;border:1px solid rgba(100,255,100,0.3)">${name}</div>`,
//             { sticky: true, direction: 'top', offset: [0, -4], className: '' }
//           ).openTooltip()
//         }
//       },
//       mouseout(e) {
//         if (geoRef.current) geoRef.current.resetStyle(e.target)
//         e.target.closeTooltip()
//       },
//       click() {
//         if (iso3) {
//           console.log('Clicked:', name, iso3)
//           onCountryClick(iso3)
//         } else {
//           console.warn('No ISO3 found for:', props)
//         }
//       }
//     })
//   }

//   return (
//     <MapContainer
//       center={[20, 0]} zoom={2} minZoom={2} maxZoom={6}
//       style={{ width: '100%', height: '100%', background: 'transparent' }}
//       zoomControl={false}
//       attributionControl={false}
//     >
//       <TileLayer
//         url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
//         attribution=""
//       />
//       {geoData && (
//         <GeoJSON
//           ref={geoRef}
//           key={selectedCode || 'map'}
//           data={geoData}
//           style={style}
//           onEachFeature={onEachFeature}
//         />
//       )}
      
//     </MapContainer>
//   )
// }
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useEffect, useState, useRef } from 'react'

function getCountryName(props) {
  return props.name || props.ADMIN || props.NAME || 
         props.NAME_EN || props.sovereignt || props.ADMIN_NAME || 'Unknown'
}

function getISO3(props) {
  // This specific GeoJSON uses these property names
  if (props['ISO3166-1-Alpha-3']) {
    return props['ISO3166-1-Alpha-3'];
  }
  
  // Convert from ISO2 if needed
  if (props['ISO3166-1-Alpha-2']) {
    return iso2ToIso3(props['ISO3166-1-Alpha-2']);
  }
  
  return null;
}

function iso2ToIso3(iso2) {
  const map = {
    AF:'AFG',AL:'ALB',DZ:'DZA',AD:'AND',AO:'AGO',AG:'ATG',AR:'ARG',AM:'ARM',
    AU:'AUS',AT:'AUT',AZ:'AZE',BS:'BHS',BH:'BHR',BD:'BGD',BB:'BRB',BY:'BLR',
    BE:'BEL',BZ:'BLZ',BJ:'BEN',BT:'BTN',BO:'BOL',BA:'BIH',BW:'BWA',BR:'BRA',
    BN:'BRN',BG:'BGR',BF:'BFA',BI:'BDI',CV:'CPV',KH:'KHM',CM:'CMR',CA:'CAN',
    CF:'CAF',TD:'TCD',CL:'CHL',CN:'CHN',CO:'COL',KM:'COM',CG:'COG',CD:'COD',
    CR:'CRI',HR:'HRV',CU:'CUB',CY:'CYP',CZ:'CZE',DK:'DNK',DJ:'DJI',DM:'DMA',
    DO:'DOM',EC:'ECU',EG:'EGY',SV:'SLV',GQ:'GNQ',ER:'ERI',EE:'EST',SZ:'SWZ',
    ET:'ETH',FJ:'FJI',FI:'FIN',FR:'FRA',GA:'GAB',GM:'GMB',GE:'GEO',DE:'DEU',
    GH:'GHA',GR:'GRC',GD:'GRD',GT:'GTM',GN:'GIN',GW:'GNB',GY:'GUY',HT:'HTI',
    HN:'HND',HU:'HUN',IS:'ISL',IN:'IND',ID:'IDN',IR:'IRN',IQ:'IRQ',IE:'IRL',
    IL:'ISR',IT:'ITA',JM:'JAM',JP:'JPN',JO:'JOR',KZ:'KAZ',KE:'KEN',KI:'KIR',
    KP:'PRK',KR:'KOR',KW:'KWT',KG:'KGZ',LA:'LAO',LV:'LVA',LB:'LBN',LS:'LSO',
    LR:'LBR',LY:'LBY',LI:'LIE',LT:'LTU',LU:'LUX',MG:'MDG',MW:'MWI',MY:'MYS',
    MV:'MDV',ML:'MLI',MT:'MLT',MH:'MHL',MR:'MRT',MU:'MUS',MX:'MEX',FM:'FSM',
    MD:'MDA',MC:'MCO',MN:'MNG',ME:'MNE',MA:'MAR',MZ:'MOZ',MM:'MMR',NA:'NAM',
    NR:'NRU',NP:'NPL',NL:'NLD',NZ:'NZL',NI:'NIC',NE:'NER',NG:'NGA',NO:'NOR',
    OM:'OMN',PK:'PAK',PW:'PLW',PA:'PAN',PG:'PNG',PY:'PRY',PE:'PER',PH:'PHL',
    PL:'POL',PT:'PRT',QA:'QAT',RO:'ROU',RU:'RUS',RW:'RWA',KN:'KNA',LC:'LCA',
    VC:'VCT',WS:'WSM',SM:'SMR',ST:'STP',SA:'SAU',SN:'SEN',RS:'SRB',SC:'SYC',
    SL:'SLE',SG:'SGP',SK:'SVK',SI:'SVN',SB:'SLB',SO:'SOM',ZA:'ZAF',SS:'SSD',
    ES:'ESP',LK:'LKA',SD:'SDN',SR:'SUR',SE:'SWE',CH:'CHE',SY:'SYR',TW:'TWN',
    TJ:'TJK',TZ:'TZA',TH:'THA',TL:'TLS',TG:'TGO',TO:'TON',TT:'TTO',TN:'TUN',
    TR:'TUR',TM:'TKM',TV:'TUV',UG:'UGA',UA:'UKR',AE:'ARE',GB:'GBR',US:'USA',
    UY:'URY',UZ:'UZB',VU:'VUT',VE:'VEN',VN:'VNM',YE:'YEM',ZM:'ZMB',ZW:'ZWE',
  }
  return map[iso2] || null
}

export default function MapView({ onCountryClick, selectedCode }) {
  const [geoData, setGeoData] = useState(null)
  const geoRef = useRef()

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(r => r.json())
      .then(data => {
        console.log('GeoJSON loaded, features:', data.features?.length);
        if (data.features?.length > 0) {
          console.log('Sample feature properties:', data.features[0].properties);
        }
        setGeoData(data)
      })
      .catch(err => console.error('GeoJSON load failed:', err))
  }, [])

  const style = (feature) => {
    const iso3 = getISO3(feature.properties)
    const isSelected = iso3 && iso3 === selectedCode
    return {
      fillColor  : isSelected ? '#69f0ae' : 'rgba(30,80,30,0.55)',
      fillOpacity: isSelected ? 0.85 : 0.5,
      color      : isSelected ? '#69f0ae' : 'rgba(100,200,100,0.3)',
      weight     : isSelected ? 2 : 0.5,
    }
  }

  const onEachFeature = (feature, layer) => {
    const props = feature.properties
    const name  = getCountryName(props)
    const iso3  = getISO3(props)

    layer.on({
      mouseover(e) {
        e.target.setStyle({
          fillColor: '#69f0ae', 
          fillOpacity: 0.7,
          color: '#69f0ae', 
          weight: 1.5
        })
        if (name && name !== 'Unknown') {
          e.target.bindTooltip(
            `<div style="background:rgba(0,0,0,0.85);color:#81c784;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;border:1px solid rgba(100,255,100,0.3)">${name}</div>`,
            { sticky: true, direction: 'top', offset: [0, -4] }
          ).openTooltip()
        }
      },
      mouseout(e) {
        if (geoRef.current) geoRef.current.resetStyle(e.target)
        e.target.closeTooltip()
      },
      click() {
        console.log('Clicked country:', name, 'ISO3:', iso3)
        if (iso3) {
          onCountryClick(iso3)
        } else {
          console.warn('No ISO3 code found for:', name, props)
        }
      }
    })
  }

  return (
    <MapContainer
      center={[20, 0]} 
      zoom={2} 
      minZoom={2} 
      maxZoom={6}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution=""
      />
      {geoData && (
        <GeoJSON
          ref={geoRef}
          key={selectedCode || 'map'}
          data={geoData}
          style={style}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  )
}