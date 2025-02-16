智能鲸灵助手油猴脚本PRD
一、背景说明
基于DeepSeek品牌形象（鲸鱼LOGO）设计轻量化互动系统，通过不超过3个核心触发点增强用户情感共鸣，技术实现控制在200行代码内，零权限需求

二、核心设定
形象载体：深蓝智鲸

基础形态：50x50px像素化鲸鱼（致敬经典电子宠物）
视觉元素：
🌟 背部LED屏显示交互状态码
🌟 尾部水流特效呼应回答流畅度
三、功能需求
1. 基础行为反馈
用户操作	鲸灵反应	持续时间	特殊条件
点击复制	喷出气泡包裹复制内容	1.2秒	复制度＞30字触发彩虹气泡特效
重试回答	螺旋下潜动画	0.8秒	3秒内多次重试触发眩晕蚊香眼
点赞	腾空跳跃+背部显示 ❤️xN	1.5秒	连续点赞达3次触发鲤鱼跳龙门
点踩	侧身翻滚+显示「T_T」	1秒	自动推送「补充说明」按钮
2. 环境感知彩蛋
if (当前时间 ∈ 0:00-6:00)

→ 切换月光特效（鲸鱼变半透明荧光蓝）

if (页面出现「谢谢」等礼貌词)

→ 生成珊瑚生长特效（页面边缘缓动）

3. 简易自定义方案
换肤系统
URL参数追加?pet_skin=colorCode（例：#FF3366）即时改变鲸鱼主色
表情包扩展
在Gist存放pet_emoji.json定义新状态码：
  {
    "hungry": "https://example.com/emoji1.png",
    "happy": "https://example.com/emoji2.png" 
  }
  
四、技术方案
1. DOM注入结构
^_^
<div id="ds-pet">
  <div class="body" style="background-color: var(--main-color)"></div>
  <div class="led-screen">^_^</div>
</div>
View Rendered
2. 核心CSS片段
#ds-pet {
  position: fixed;
  bottom: 20px;
  right: 20px;
  transition: transform 0.3s ease;
}

.jump {
  animation: jump 0.5s cubic-bezier(0.5, 1, 0.89, 1);
}
@keyframes jump {
  50% { transform: translateY(-30px) rotate(-10deg); }
}
3. 事件监听逻辑
// 重试按钮监听
document.querySelector('.retry-btn').addEventListener('click', () => {
  pet.classList.add('dive-animation');
  setTimeout(() => pet.classList.remove('dive-animation'), 800);
});

// 换肤实现
const urlParams = new URLSearchParams(window.location.search);
if(urlParams.get('pet_skin')) {
  document.documentElement.style.setProperty('--main-color', urlParams.get('pet_skin'));
}
五、性能保障
优化项	实施方案	预期指标
动画性能	强制GPU加速	帧率＞50fps
DOM操作	使用CSS类切换而非样式修改	每动作耗时＜3ms
内存占用	启用对象池管理动画元素	内存波动＜5MB
六、发布计划
第1周：基础形态+复制/重试反馈
第2周：昼夜模式+点赞彩蛋
第3周：社交分享参数接入
七、风险控制
兼容性风险：限定CSS使用flex布局（覆盖率98%）
用户干扰风险：右下角增加「🐳隐身」切换按钮
性能风险：自动检测设备帧率，低于30fps时停用复杂动画