<template>
	<div id="app">
		<!-- 这里准备了一个LOGO有点丑，就不放了-->
		<!-- <router-link  to="/home"><img src="./assets/logo.png" id="logo"> </router-link> -->
		<div id="nav">
			<el-menu router mode="horizontal" text-color="#0481F1" active-text-color="#30CFFF">
				<el-menu-item index="/home">Home</el-menu-item>
				<el-menu-item index="/editor">Editor</el-menu-item>
				<el-menu-item index="/simulator">Simulator</el-menu-item>
				<el-menu-item index="/mapper">Mapper</el-menu-item>
			</el-menu>
		</div>
		<router-view />
	</div>
</template>
<script>
	export default {
		created:function(){
			//Vue实例创建后，将载入动画设置为display:none
			const loader = document.querySelector("#loader")
			loader.style.display = "none";
		}
	}
</script>
<style>
	* {
		padding: 0px;
		margin: 0px;
	}
	#logo{
		position: fixed;
		width: 48px;
		left: 20px;
		top: 10px;
	}
	#nav {
		width: 50%;
		position: relative;
		margin: auto;
	}

	#nav .el-menu {
		display: flex;
	}

	#nav .el-menu-item {
		flex: 1;
		text-align: center;
		font-family: "Nexa";
		font-size: 18px;
		font-weight: 500;
	}
</style>
