import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchPlaceDetails = createAsyncThunk(
    'place/fetchPlaceDetails',
    async(placeId) => {
        const { Place } = await window.google.maps.importLibrary('places')

        const place = new Place({
            id: placeId,
        })

        await place.fetchFields({
            fields: [
                'displayName',
                'formattedAddress',
                'location'
            ],
        })

        if(!place.location){
            throw new Error('No location found for this place')
        }

        return {
            id: place.id,
            name: place.displayName,
            address: place.formattedAddress,
            location: {
                lat: place.location.lat(),
                lng: place.location.lng(),
            },
        }
    }
)

const initialState = {
    place: null,
    loading: false,
    error: null,
}

const placeSlice = createSlice({
    name: 'place',
    initialState,

    reducers: {
        clearPlace: (state) => {
            state.place = null
            state.error = null
        },
    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchPlaceDetails.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(fetchPlaceDetails.fulfilled, (state, action) => {
        state.loading = false
        state.place = action.payload
      })

      .addCase(fetchPlaceDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
    },
})

export const { clearPlace } = placeSlice.actions

export default placeSlice.reducer