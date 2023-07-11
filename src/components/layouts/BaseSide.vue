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
				<el-menu-item index="1-1">Location 1</el-menu-item>
				<el-menu-item index="1-2">Location 2</el-menu-item>
				<el-menu-item index="1-2">Location 3</el-menu-item>
			</el-menu-item-group>
		</el-sub-menu>
	</el-menu>
</template>

<script lang="ts" setup>
	import { Location } from "@element-plus/icons-vue";
	import { ref } from "vue";

	const isCollapse = ref(true);
	const handleOpen = (key: string, keyPath: string[]) => {
		console.log(key, keyPath);
	};
	const handleClose = (key: string, keyPath: string[]) => {
		console.log(key, keyPath);
	};
</script>
