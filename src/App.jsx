// import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import './App.css'

import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPlaceDetails } from './store/placeSlice'

function App() {
  const mapRef = useRef(null)

  const dispatch = useDispatch()

  const selectedPlace = useSelector(
    (state) => state.place.place
  )

  const loading = useSelector(
    (state) => state.place.loading
  )

  const error = useSelector(
    (state) => state.place.error
  )

  useEffect(() => {

    let autocompleteElement = null

    const initMap = async () => {
      if (!mapRef.current || !window.google?.maps) {
        return
      }

      const { PlaceAutocompleteElement } =
        await window.google.maps.importLibrary('places')


      const map = new window.google.maps.Map(mapRef.current, {
        center: {
          lat: 3.139,
          lng: 101.6869,
        },
        zoom: 12,
      })

       autocompleteElement = new PlaceAutocompleteElement()
      autocompleteElement.placeholder = 'Search for a place...'

      const container = document.getElementById('autocomplete-container')
      
      if(container) {
        container.appendChild(autocompleteElement)
      }

      autocompleteElement.addEventListener('gmp-select', async ({ placePrediction }) => {
        
        //const place = placePrediction.toPlace()        

        // await place.fetchFields({
        //   fields: [
        //     'displayName',
        //     'formattedAddress',
        //     'location',
        //     'viewport',
        //   ],
        // })

        // console.log('Selected place:', place)

        // if (!place.location) {
        //   alert('No details available for this place')
        //   return
        // }

        // if (place.viewport) {
        //   map.fitBounds(place.viewport)
        // } else {
        //   map.setCenter(place.location)
        //   map.setZoom(17)
        // }

        const place = placePrediction.toPlace()

        try {
          const result = await dispatch(
            fetchPlaceDetails(place.id)
          ).unwrap()

          console.log('Selected place:', result)

          map.setCenter(result.location)
          map.setZoom(17)
        } catch (error) {
          console.error('Failed to get place:', error)
          alert('No details available for this place')
        }
      })
    }

    if (window.google?.maps) {
      initMap()
    }else {
      const existingScript = document.querySelector(
      'script[data-google-maps]'
    )
    
    if (existingScript) {
      existingScript.addEventListener('load', initMap)
      
    }else {

    const script = document.createElement('script')

    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`

    script.async = true
    script.defer = true
    script.setAttribute('data-google-maps', 'true')

    script.onload = initMap

    document.head.appendChild(script)
    }
  }

    //Cleanup
 return () => {
    if (autocompleteElement && autocompleteElement.parentNode) {
      autocompleteElement.parentNode.removeChild(autocompleteElement)
    }
  }


  }, [])

  return (
    <div className="container py-5">
  <div className="row justify-content-center">
    <div className="col-lg-10">

      <div className="mb-4">
        <h1 className="fw-bold text-dark">
          Google Place Finder
        </h1>

        <p className="text-muted">
          Search for a place and view it on the map.
        </p>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">

          <div className="mb-4">
            <label className="form-label fw-semibold">
              Location
            </label>

            <div id="autocomplete-container"></div>

            {loading && (
              <div className="text-muted mt-2">
                Loading place...
              </div>
            )}

            {error && (
              <div className="alert alert-danger mt-2 mb-0">
                {error}
              </div>
            )}
          </div>

          <div
            ref={mapRef}
            style={{
              width: '100%',
              height: '400px',
              borderRadius: '8px',
            }}
          />

          {selectedPlace && (
            <div className="mt-4">
              <h5 className="fw-bold">
                {selectedPlace.name}
              </h5>

              <p className="text-muted mb-0">
                {selectedPlace.address}
              </p>
            </div>
          )}

        </div>
      </div>

    </div>
  </div>
</div>
  )
}

export default App