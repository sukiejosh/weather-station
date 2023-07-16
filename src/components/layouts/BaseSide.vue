<template>
	<el-menu
		default-active="2"
		class="el-menu-vertical-demo"
		:collapse="false"
		@open="handleOpen"
		@close="handleClose"
	>
		<el-sub-menu index="1">
			<template #title>
				<el-icon><location /></el-icon>
				<span>Stations</span>
			</template>
			<el-menu-item-group>
				<el-menu-item v-for="(s, i) in stations.docs" :key="i">
					{{ s.name }}
				</el-menu-item>
			</el-menu-item-group>
		</el-sub-menu>
	</el-menu>
</template>

<script lang="ts" setup>
	import { Location } from "@element-plus/icons-vue";
	import { storeToRefs } from "pinia";
	import { ref } from "vue";
	import { useStationStore } from "~/store/stations";
	const stationStore = useStationStore();

	const isCollapse = ref(true);
	const handleOpen = (key: string, keyPath: string[]) => {
		console.log(key, keyPath);
	};
	const handleClose = (key: string, keyPath: string[]) => {
		console.log(key, keyPath);
	};

	const { stations } = storeToRefs(stationStore);
</script>
