<template>
	<div class="hello">
		<h1>{{ msg }}</h1>

		<form @submit.prevent="findAddress()">
			<input v-model="address_input">
			<button type="submit">Go!</button>
		</form>

		<p>{{ address_input }}</p>
		<p>{{ address_geo }}</p>
		<p>{{ response }}</p>
	</div>
</template>

<script>
import * as esriLoader from 'esri-loader'

export default {
	name: 'address-form',
	data () {
		return {
			msg: 'HC Parcel Finder',
			address_input: null,
			address_geo: null,
			response: null
		}
	},
	methods: {
		findAddress () {
			console.log('searching')

			esriLoader.dojoRequire([
				"esri/tasks/Locator"
			], (Locator) => {

				var hcLocator = new Locator({
					url: "https://maps.hillsboroughcounty.org/arcgis/rest/services/Geocoding/DBO_composite_address_locator/GeocodeServer"
				})

				hcLocator.addressToLocations({
					address: { SingleLine: this.address_input },
					maxLocations: 1
				}).then( (response) => {
					this.address_input = response[0].address
					this.address_geo = response[0].location
					this.getParcel()
				}).otherwise( (err) => {
					console.log('error finding address')
					// this.$store.commit('addAlert', 'address-not-found')
					// that.is_map_shown = true
					// that.is_loading = false
				})
			})
		},
		getParcel () {
			esriLoader.dojoRequire([
				"esri/tasks/QueryTask",
				"esri/tasks/support/Query"
			], (QueryTask, Query) => {

				var parcelQueryTask = new QueryTask({
					url: "https://maps.hillsboroughcounty.org/arcgis/rest/services/InfoLayers/HC_Parcels/MapServer/0"
				})

				var query = new Query()
				query.geometry = this.address_geo
				query.outFields = ['*']

				parcelQueryTask.execute(query).then( (response) => {
					this.response = response.features[0]
				}).otherwise( (err) => {
					console.log('error finding parcel info')
				})

			})

		}
	},
	mounted () {
		if (!esriLoader.isLoaded()) {
			esriLoader.bootstrap((err) => {
				if (err) {
					console.log('esri didnt laod...')
					console.error(err)
				}
				console.log('esri loaded, no error')
			}, {
				url: 'https://js.arcgis.com/4.3'
			})
		}
	}
}
</script>
