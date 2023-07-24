<template>
	<div v-if="!loading" class="w-full">
		<div class="flex flex-col w-full space-y-10">
			<div class="grid gap-4 lg:grid-cols-3 grid-cols-1 w-full">
				<div class="flex flex-col space-y-2 w-full">
					<div
						class="flex flex-col space-y-2 space-x-0 md:flex-row md:space-x-5 md:space-y-0 w-full py-3 justify-start text-left"
					>
						<div class="md:flex-1 text-2xl font-bold text-center">
							Temperature
						</div>
						<div class="md:flex-none">
							<div
								class="flex flex-col space-y-3 space-x-0 md:space-y-0 md:space-x-7 md:flex-row"
							></div>
						</div>
					</div>
					<div class="w-full gap-10">
						<div
							class="text-4xl font-bold flex items-center justify-center text-center shadow-lg rounded-xl p-10"
						>
							<div>
								<p>
									{{
										stationData && stationData["temp"]
											? `${stationData["temp"]?.toFixed(2)} °C`
											: "N/A"
									}}
								</p>
								<p
									v-if="stationData && stationData?.createdAt"
									class="text-xs text-blue"
								>
									Last updated -
									{{ new Date(stationData?.createdAt)?.toLocaleString() }}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="flex flex-col space-y-2 w-full">
					<div
						class="flex flex-col space-y-2 space-x-0 md:flex-row md:space-x-5 md:space-y-0 w-full py-3 justify-start text-left"
					>
						<div class="md:flex-1 font-bold text-2xl text-center">Pressure</div>
						<div class="md:flex-none">
							<!-- <el-select
							v-model="viewType_temeperature"
							class="m-2"
							placeholder="Select"
							size="large"
						>
							<el-option
								v-for="item in viewOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select> -->
						</div>
					</div>
					<div class="w-full gap-10">
						<div
							class="text-4xl font-bold flex items-center justify-center text-center shadow-lg rounded-xl p-10"
						>
							<div>
								<p>
									{{
										stationData && stationData["pressure"]
											? `${formatNumberWithCommas(
													convertToKpa(stationData["pressure"])
											  )} KPa`
											: "N/A"
									}}
								</p>
								<p
									v-if="stationData && stationData?.createdAt"
									class="text-xs text-blue"
								>
									Last updated -
									{{ new Date(stationData?.createdAt)?.toLocaleString() }}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="flex flex-col space-y-2">
					<div
						class="flex flex-col space-y-2 space-x-0 md:flex-row md:space-x-5 md:space-y-0 w-full py-3 justify-start text-left"
					>
						<div class="md:flex-1 font-bold text-2xl text-center">Humidity</div>
						<div class="md:flex-none">
							<!-- <el-select
							v-model="viewType_temeperature"
							class="m-2"
							placeholder="Select"
							size="large"
						>
							<el-option
								v-for="item in viewOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select> -->
						</div>
					</div>
					<div class="w-full gap-10">
						<div
							class="text-4xl font-bold flex items-center justify-center text-center shadow-lg rounded-xl p-10"
						>
							<div>
								<p>
									{{
										stationData && stationData["humidity"]
											? `${stationData["humidity"]?.toFixed(2)} %`
											: "N/A"
									}}
								</p>
								<p
									v-if="stationData && stationData?.createdAt"
									class="text-xs text-blue"
								>
									Last updated -
									{{ new Date(stationData?.createdAt)?.toLocaleString() }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="flex flex-col space-y-2 w-full">
				<div v-if="items.length > 0" class="flex w-full justify-end">
					<el-button type="primary" @click="downloadData" plain>
						Download as CSV
					</el-button>
				</div>
				<div>
					<EasyDataTable
						:headers="headers"
						:items="items"
						alternating
						buttons-pagination
					/>
				</div>
			</div>
		</div>
	</div>
	<div v-else class="w-full">
		<div
			class="font-bold text-4xl flex h-full w-full items-center justify-center text-center"
		>
			<div>Fetching data, please wait</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
	// import { id } from "element-plus/es/locale";
	import csvDownload from "json-to-csv-export";

	import { storeToRefs } from "pinia";
	import { onMounted } from "vue";
	import type { Header, Item } from "vue3-easy-data-table";

	import { useStationStore } from "~/store/stations";
	import { useUserStore } from "~/store/user";

	// import { useStationStore } from "./store/stations";

	const downloadData = () => {
		const dataToConvert = {
			data: items.value,
			filename: ` ${stationDetails?.name} - ${new Date().toLocaleDateString()}`,
			delimiter: ",",
			headers: ["Temperature", "Pressure", "Humidity", "Created"]
		};
		csvDownload(dataToConvert);
	};

	const userStore = useUserStore();
	const stationStore = useStationStore();
	const router = useRouter();
	const id = router.currentRoute.value.params.id;
	const loading = ref(false);
	const { stations, latestWeatherData, totalStations } =
		storeToRefs(stationStore);
	const stationDetails = stations.value.docs.find(
		(station: any) => station.id == id
	);
	const serverOptions = ref({
		page: 1,
		rowsPerPage: 10,
		limit: 10,
		sort: "desc"
	});
	const headers: Header[] = [
		{ text: "Temperature", value: "temp" },
		{ text: "Pressure", value: "pressure" },
		{ text: "Humidity", value: "humidity" },
		{ text: "Created", value: "createdAt" }
	];
	const items = ref<Item[]>([]);
	const serverItemsLength = ref(0);
	onMounted(async () => {
		// userStore.init();
		loading.value = true;
		const Allstations = await stationStore.getStations(userStore.token);
		console.log(Allstations);
		if (!Allstations) {
			router.push({ path: "/login" });
			return;
		}
		if (!stationDetails) {
			router.push({ path: "/login" });
			return;
		}
		const d = await stationStore.getAllWeatherData(id as any, 10, "desc");
		if (d) {
			items.value = d.map((doc: any) => {
				return {
					temp: doc.temp,
					pressure: doc.pressure,
					humidity: doc.humidity,
					createdAt: new Date(doc.createdAt).toDateString()
				};
			});
			serverItemsLength.value = d.totalDocs;
		}
		loading.value = false;
	});

	function formatNumberWithCommas(number: { toString: () => any }) {
		// Convert the number to a string
		let numberStr = number.toString();

		// Split the number into integer and decimal parts
		const parts = numberStr.split(".");
		let integerPart = parts[0];
		const decimalPart = parts[1] || "";

		// Add commas to the integer part
		const integerRegex = /\B(?=(\d{3})+(?!\d))/g;
		integerPart = integerPart.replace(integerRegex, ",");

		// Combine the integer and decimal parts
		const formattedNumber = decimalPart
			? `${integerPart}.${decimalPart}`
			: integerPart;

		return formattedNumber;
	}

	function convertToKpa(pressure: number) {
		return pressure / 1000;
	}

	const stationData = computed(() => {
		return latestWeatherData.value
			? latestWeatherData.value[stationDetails?.name]
			: null;
	});
</script>
