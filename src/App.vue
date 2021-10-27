<template>
	
	<div id="app">
		
		<!--<div id="nav">
			<el-menu router mode="horizontal" text-color="#0481F1" active-text-color="#30CFFF">
				<el-menu-item index="/home">Home</el-menu-item>
				<el-menu-item index="/editor">Editor</el-menu-item>
				<el-menu-item index="/simulator">Simulator</el-menu-item>
				<el-menu-item index="/mapper">Mapper</el-menu-item>
				<el-menu-item index="/rater">ModelRater</el-menu-item>
				<el-menu-item index="/transformer">NLTransformer</el-menu-item>
				<el-menu-item index="/bpmnToChatbot">BPMN To Chatbot</el-menu-item>
			</el-menu>
		</div>-->
		<router-view />
	</div>
</template>
<script>
	export default {
		mounted:function(){
			//Vue实例创建后，将载入动画设置为display:none
			const loader = document.querySelector(".loading")
			loader.style.display = "none";
		}
	}
</script>
<style>
	* {
		padding: 0px;
		margin: 0px;
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
