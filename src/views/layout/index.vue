<template>
	<div>
		<!-- Header Section -->
		<div class="header">
			<div class="nav">
				<div class="nav-left">
					<div class="nav-logo">
						<div class="nav-logo-img"></div>
						<div class="nav-logo-text">鹰眼任务系统</div>
					</div>
				</div>
				<div class="nav-right">
					<el-button class="login-btn" @click="navigateToLogin">登陆</el-button>

					<el-button class="register-btn" @click="navigateToRegister">
						立即注册
					</el-button>
				</div>
			</div>
			<div class="header-all">
				<div class="header-title">网上办公，与团队高效协作</div>
				<div class="header-experience" @click="navigateToExperience">
					立即体验
				</div>
				<div class="header-index-img"></div>
			</div>
		</div>

		<!-- Content Sections -->
		<div id="content-all">
			<section class="content-first content-first-active">
				<div class="content-first-all">
					<div class="content-first-right">
						<div class="content-right-title">专注项目，实现目标</div>
						<div class="content-right-text">
							“鹰眼任务系统”是一款协力企业和团队实现目标的系统。企业在创建团队后，可以建立项目，对项目成员分配任务，查看项目或成员进度。
						</div>
					</div>
					<div class="content-first-left">
						<div class="content-left-img"></div>
					</div>
				</div>
			</section>

			<section class="content-first">
				<div class="content-first-all">
					<div class="content-second-right">
						<div class="content-right-bluebg">
							<div class="content-right-oneimg"></div>
							<div class="content-right-twoimg"></div>
							<div class="content-right-thrimg"></div>
							<div class="content-right-fouimg"></div>
						</div>
					</div>
					<div class="content-second-left">
						<div class="content-left-title">有目标的推进工作</div>
						<div class="content-left-text">
							<div class="content-left-text-one">
								<div class="content-left-one-title">1</div>
								<div class="content-left-one-text">创建一个项目</div>
							</div>
							<div class="content-left-text-one">
								<div class="content-left-one-title">2</div>
								<div class="content-left-one-text">邀请成员</div>
							</div>
							<div class="content-left-text-one">
								<div class="content-left-one-title">3</div>
								<div class="content-left-one-text">添加成员任务，项目文件</div>
							</div>
							<div class="content-left-text-one">
								<div class="content-left-one-title">4</div>
								<div class="content-left-one-text">查看项目进度</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section class="content-first content-first-active">
				<div class="content-first-all">
					<div class="content-third-right">
						<div class="content-third-text">
							现在就开始使用鹰眼，开始高效团队协作
						</div>
					</div>
					<div class="content-third-left">
						<div class="content-third-img"></div>
					</div>
				</div>
			</section>

			<footer class="footer">
				<div class="footer-all-text">
					©2018 鹰眼任务系统 —— 网上办公，与团队高效协作
				</div>
			</footer>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToLogin = () => {
	router.push('/login')
}

const navigateToRegister = () => {
	router.push('/register')
}

const navigateToExperience = () => {
	router.push('/login')
}
</script>

<style lang="scss" scoped>
.header {
	height: 1100px;
	width: 100%;
	background: url(../../assets/images/index/indexbg.png) no-repeat;
	background-size: 100% 80%;
	min-width: 1200px;
}

.header .header-all {
	width: 1200px;
	height: 100%;
	margin: 0 auto;
}

.nav {
	height: 78px;
	margin-bottom: 100px;
	cursor: default;
}

.nav-left {
	font-family: 'PingFangSC-Regular', sans-serif;
	font-size: 20px;
	float: left;
	width: 210px;
	margin: 20px 0 0 60px;
}

.nav-right {
	float: right;
	color: #fff;
	margin: 15px 20px 0 0;
}

.nav-logo-img {
	float: left;
	width: 37px;
	height: 38px;
	margin-right: 25px;
	background: url(../../assets/images/index/logo.png) no-repeat;
}

.nav-logo-text {
	float: left;
	color: #fff;
	line-height: 35px;
}

.login-btn {
	background-color: transparent;
	color: #fff;
	margin-right: 20px;
	border: none;
}

.register-btn {
	background-color: #1c7ffe;
	border: 1px solid #1c7ffe;
	color: #fff;
}

.header-title {
	color: #fff;
	font-size: 24px;
	margin: 0 auto;
	width: 350px;
	letter-spacing: 5px;
	margin-bottom: 50px;
}

.header-experience {
	color: #fff;
	margin: 0 auto;
	background: linear-gradient(to bottom left, #61a6ff, #1c7ffe);
	width: 150px;
	height: 49px;
	line-height: 49px;
	text-align: center;
	cursor: pointer;
}

.header-index-img {
	background-color: #fff;
	border: 1px;
	width: 1200px;
	height: 680px;
	background: url(../../assets/images/index/index_drop.png) no-repeat;
	margin: 0 auto;
	background-size: 100%;
	margin-top: 60px;
	box-shadow: 0px 0px 15px #2d2d2d;
}

#content-all {
	margin: 0 auto;
}

.content-first {
	height: 800px;
}

.content-first-active {
	background-color: #fafafa;
}

.content-first-all {
	width: 1200px;
	height: 100%;
	margin: 0 auto;
}

.content-first-right {
	float: left;
	width: 600px;
	margin-top: 309.5px;
}

.content-right-title {
	font-size: 18pt;
}

.content-right-text {
	font-size: 14pt;
	color: #b8b8b8;
	width: 500px;
	margin-top: 30px;
	line-height: 40px;
}

.content-first-left {
	float: left;
	width: 600px;
	margin-top: 225px;
}

.content-left-img {
	width: 500px;
	height: 350px;
	background: url(../../assets/images/index/pc.png) no-repeat;
	background-size: 100%;
	margin: 0 auto;
}

.content-second-right {
	float: left;
	width: 800px;
	margin-top: 100px;
}

.content-right-bluebg {
	width: 455px;
	height: 600px;
	position: relative;
	left: 0;
	top: 0;
	background: linear-gradient(to bottom left, #61a6ff, #1c7ffe);
}

.content-right-oneimg,
.content-right-twoimg,
.content-right-thrimg,
.content-right-fouimg {
	border-radius: 5px;
	position: absolute;
}

.content-right-oneimg {
	width: 285px;
	height: 165px;
	background: url(../../assets/images/index/createproject.png) no-repeat;
	background-size: 100%;
	left: 75px;
	top: 90px;
}

.content-right-twoimg {
	width: 290px;
	height: 140px;
	background: url(../../assets/images/index/Invitation.png) no-repeat;
	background-size: 100%;
	left: 75px;
	top: 280px;
}

.content-right-thrimg {
	width: 295px;
	height: 140px;
	background: url(../../assets/images/index/filechild.png) no-repeat;
	background-size: 100%;
	left: 380px;
	top: 90px;
}

.content-right-fouimg {
	width: 295px;
	height: 140px;
	background: url(../../assets/images/index/statistics.png) no-repeat;
	background-size: 100%;
	left: 380px;
	top: 280px;
}

.content-second-left {
	float: left;
	width: 400px;
	margin-top: 190.5px;
}

.content-left-title {
	font-size: 18pt;
	margin-bottom: 90px;
	letter-spacing: 5px;
}

.content-left-text-one {
	display: flex;
	width: 100%;
	height: 50px;
	border-bottom: 1px solid #b8b8b8;
	align-items: center;
}

.content-left-one-title {
	width: 40px;
	color: #1c7ffe;
	font-size: 20pt;
	font-weight: bold;
}

.content-left-one-text {
	margin-left: 10px;
	font-size: 14pt;
}

.content-third-right {
	float: left;
	width: 600px;
	margin-top: 200px;
}

.content-third-left {
	float: left;
	width: 600px;
}

.content-third-text {
	font-size: 18pt;
	letter-spacing: 5px;
	width: 370px;
	line-height: 45px;
}

.content-third-img {
	width: 585px;
	height: 685px;
	background: url(../../assets/images/index/loginall.png) no-repeat;
	background-size: 100%;
	margin: 0 auto;
}

.footer {
	height: 100px;
	width: 100%;
	background-color: #161616;
	box-shadow: 0px 0px 15px #2d2d2d;
}

.footer-all-text {
	color: #fff;
	font-size: 14pt;
	text-align: center;
	padding-top: 35px;
}
</style>
