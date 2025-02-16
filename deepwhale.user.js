// ==UserScript==
// @name         智能鲸灵助手
// @namespace    http://deepseek.com/
// @version      0.1
// @description  为DeepSeek添加可爱的像素风格鲸鱼助手
// @author       DeepSeek
// @match        *://*.deepseek.com/*
// @match        *://*.deepseek.ai/*
// @match        http://localhost/*
// @match        file:///*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 使用GM_addStyle注入样式
    GM_addStyle(`
        :root {
            --main-color: #0066cc;
            --highlight-color: #3399ff;
        }

        #ds-pet {
            position: fixed;
            bottom: 50%;
            right: 20px;
            width: 80px;
            height: 70px;
            z-index: 99999;
            cursor: move;
            transition: all 0.3s ease;
            pointer-events: auto;
            user-select: none;
            touch-action: none;
        }

        #ds-pet .resize-handle {
            position: absolute;
            width: 20px;
            height: 20px;
            right: -10px;
            bottom: -10px;
            cursor: se-resize;
            background: transparent;
            z-index: 100000;
        }

        #ds-pet .resize-handle:hover::after {
            content: '';
            position: absolute;
            width: 8px;
            height: 8px;
            right: 6px;
            bottom: 6px;
            border-right: 2px solid var(--main-color);
            border-bottom: 2px solid var(--main-color);
            border-radius: 1px;
            opacity: 0.8;
        }

        #ds-pet.dragging {
            transition: none;
            opacity: 0.8;
        }

        #ds-pet.resizing {
            transition: none;
        }

        #ds-pet .whale-body {
            position: relative;
            z-index: 2;
            width: 100%;
            height: 100%;
            background-color: var(--main-color);
            border-radius: 30px 30px 15px 15px;
            position: relative;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            overflow: hidden;
        }

        #ds-pet .whale-body:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 40%;
            background: var(--highlight-color);
            border-radius: 30px 30px 0 0;
            opacity: 0.3;
        }

        #ds-pet .eyes {
            position: absolute;
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 10px;
            display: flex;
            justify-content: space-between;
            z-index: 1;
        }

        #ds-pet .eye {
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            position: relative;
        }

        #ds-pet .eye:after {
            content: '';
            position: absolute;
            top: 1px;
            right: 1px;
            width: 3px;
            height: 3px;
            background: #000;
            border-radius: 50%;
        }

        #ds-pet .mouth {
            position: absolute;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 8px;
            background: white;
            border-radius: 10px;
            z-index: 1;
        }

        #ds-pet .whale-tail {
            position: absolute;
            left: -18px;
            bottom: 8px;
            width: 28px;
            height: 31px;
            z-index: 1;
            transform-origin: right center;
            transform: rotate(-45deg);
        }

        #ds-pet .whale-tail::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: #4169E1;
            clip-path: polygon(
                100% 35%,    /* 右上连接点 */
                70% 35%,     /* 内弧上点 */
                45% 0%,      /* 上尖点 */
                20% 35%,     /* 左上弧 */
                0% 50%,      /* 最左点 */
                20% 65%,     /* 左下弧 */
                45% 100%,    /* 下尖点 */
                70% 65%,     /* 内弧下点 */
                100% 65%     /* 右下连接点 */
            );
            transform-origin: right center;
            animation: tail-wave 4s ease-in-out infinite;
        }

        #ds-pet .whale-tail::after {
            content: '';
            position: absolute;
            left: 2px;
            top: 2px;
            width: calc(100% - 4px);
            height: calc(100% - 4px);
            background: #6495ED;
            clip-path: polygon(
                100% 35%,
                70% 35%,
                45% 0%,
                20% 35%,
                0% 50%,
                20% 65%,
                45% 100%,
                70% 65%,
                100% 65%
            );
            transform-origin: right center;
            animation: tail-wave 4s ease-in-out infinite;
        }

        @keyframes tail-wave {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-10deg) scaleX(0.95); }
        }

        @keyframes tail-jump {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-25deg) scaleY(1.1) scaleX(0.9); }
        }

        @keyframes tail-think {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-15deg) scaleX(0.95); }
            75% { transform: rotate(15deg) scaleX(0.95); }
        }

        #ds-pet.jump .whale-tail::before,
        #ds-pet.jump .whale-tail::after {
            animation: tail-jump 0.5s ease-in-out;
        }

        #ds-pet.think .whale-tail::before,
        #ds-pet.think .whale-tail::after {
            animation: tail-think 0.8s ease-in-out;
        }

        .jump {
            animation: jump 0.5s ease-in-out;
        }

        .dive {
            animation: dive 0.8s ease-in-out;
        }

        .think {
            animation: think 0.8s ease-in-out;
        }

        .bubble {
            position: fixed;
            background: rgba(255,255,255,0.95);
            padding: 12px 20px;
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(0,102,204,0.2);
            z-index: 99990;
            font-size: 14px;
            color: #333;
            max-width: 200px;
            line-height: 1.4;
            pointer-events: none;
            animation: bubble 0.4s ease-out; /* 加快速度 */
            white-space: pre-wrap;
            word-wrap: break-word;
            transform-origin: bottom center;
            transition: all 0.1s ease-out; /* 加快速度 */
        }

        .bubble.bottom {
            transform-origin: top center;
        }

        @keyframes bubble {
            0% {
                opacity: 0;
                transform: translateY(20px) scale(0.8);
            }
            50% {
                opacity: 1;
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .bubble:before {
            content: '';
            position: absolute;
            bottom: -8px;
            right: 20px;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid rgba(255,255,255,0.95);
        }

        @keyframes jump {
            0%, 100% { transform: translate3d(var(--x), var(--y), 0); }
            50% { transform: translate3d(var(--x), calc(var(--y) - 20px), 0); }
        }

        @keyframes dive {
            0%, 100% { transform: translate3d(var(--x), var(--y), 0) rotate(0deg); }
            50% { transform: translate3d(var(--x), var(--y), 0) rotate(360deg); }
        }

        @keyframes think {
            0%, 100% { transform: translate3d(var(--x), var(--y), 0) rotate(0deg); }
            50% { transform: translate3d(var(--x), var(--y), 0) rotate(30deg); }
        }

        #ds-pet.jump {
            animation: jump 0.5s ease-in-out;
        }

        #ds-pet.dive {
            animation: dive 0.8s ease-in-out;
        }

        #ds-pet.think {
            animation: think 0.8s ease-in-out;
        }

        .night-mode {
            opacity: 0.8;
            filter: brightness(1.2) saturate(1.5);
            box-shadow: 0 0 20px rgba(0, 102, 204, 0.5);
        }

        .happy .mouth {
            height: 12px !important;
            border-radius: 5px 5px 10px 10px !important;
        }

        .sad .mouth {
            height: 12px !important;
            border-radius: 10px 10px 5px 5px !important;
            transform: translateX(-50%) rotate(180deg) !important;
        }
    `);

    // 工具函数
    const utils = {
        setMood: (pet, mood) => {
            pet.querySelector('.whale-body').className = 'whale-body ' + mood;
        },
        checkNightMode: (pet) => {
            const hour = new Date().getHours();
            if (hour >= 0 && hour < 6) {
                pet.querySelector('.whale-body').classList.add('night-mode');
            } else {
                pet.querySelector('.whale-body').classList.remove('night-mode');
            }
        },
        createBubble: (text, pet) => {
            const petRect = pet.getBoundingClientRect();
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.textContent = text.length > 50 ? text.substring(0, 50) + '...' : text;
            
            document.body.appendChild(bubble);
            const bubbleRect = bubble.getBoundingClientRect();
            
            // 调整气泡位置，使其与小鲸鱼居中对齐
            let bubbleX = petRect.left + (petRect.width - bubbleRect.width) / 2 - 10; // 向左偏移10px
            let bubbleY = petRect.top - bubbleRect.height - 20; // 向上偏移多5px
            
            // 如果气泡会超出屏幕，调整位置
            if (bubbleX < 10) bubbleX = 10;
            if (bubbleX + bubbleRect.width > window.innerWidth - 10) {
                bubbleX = window.innerWidth - bubbleRect.width - 10;
            }
            
            // 如果上方空间不足，显示在下方
            if (bubbleY < 10) {
                bubbleY = petRect.bottom + 20;
                bubble.classList.add('bottom');
            }
            
            bubble.style.left = bubbleX + 'px';
            bubble.style.top = bubbleY + 'px';
            
            setTimeout(() => bubble.remove(), 2000);
        }
    };

    // 初始化函数
    function initPet() {
        const pet = document.createElement('div');
        pet.id = 'ds-pet';
        pet.innerHTML = `
            <div class="whale-body">
                <div class="eyes">
                    <div class="eye"></div>
                    <div class="eye"></div>
                </div>
                <div class="mouth"></div>
            </div>
            <div class="whale-tail"></div>
            <div class="resize-handle"></div>
        `;
        document.body.appendChild(pet);

        // 从localStorage读取大小
        const savedSize = GM_getValue('petSize');
        if (savedSize) {
            pet.style.width = savedSize.width + 'px';
            pet.style.height = savedSize.height + 'px';
        }

        // 拖动功能
        let isDragging = false;
        let isResizing = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        let initialWidth;
        let initialHeight;

        // 从localStorage读取保存的位置
        const savedPosition = GM_getValue('petPosition');
        if (savedPosition) {
            xOffset = savedPosition.x;
            yOffset = savedPosition.y;
            setTranslate(xOffset, yOffset, pet);
        }

        function dragStart(e) {
            if (e.target.classList.contains('resize-handle')) {
                isResizing = true;
                pet.classList.add('resizing');
                initialWidth = pet.offsetWidth;
                initialHeight = pet.offsetHeight;
                initialX = e.clientX;
                initialY = e.clientY;
                return;
            }

            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            if (e.target === pet || pet.contains(e.target)) {
                isDragging = true;
                pet.classList.add('dragging');
                // 记录当前位置作为CSS变量，用于动画
                pet.style.setProperty('--x', `${xOffset}px`);
                pet.style.setProperty('--y', `${yOffset}px`);
            }
        }

        function dragEnd(e) {
            if (isResizing) {
                isResizing = false;
                pet.classList.remove('resizing');
                // 保存大小到localStorage
                GM_setValue('petSize', {
                    width: pet.offsetWidth,
                    height: pet.offsetHeight
                });
                return;
            }

            if (!isDragging) return;
            
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            pet.classList.remove('dragging');

            // 更新CSS变量，用于动画
            pet.style.setProperty('--x', `${xOffset}px`);
            pet.style.setProperty('--y', `${yOffset}px`);

            // 保存位置到localStorage
            GM_setValue('petPosition', { x: xOffset, y: yOffset });
        }

        function drag(e) {
            if (isResizing) {
                e.preventDefault();
                const deltaX = e.clientX - initialX;
                const deltaY = e.clientY - initialY;
                const newWidth = Math.max(60, Math.min(200, initialWidth + deltaX));
                const newHeight = Math.max(50, Math.min(175, initialHeight + deltaY));
                pet.style.width = newWidth + 'px';
                pet.style.height = newHeight + 'px';
                return;
            }

            if (!isDragging) return;

            e.preventDefault();

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, pet);
            
            // 更新CSS变量，用于动画
            pet.style.setProperty('--x', `${currentX}px`);
            pet.style.setProperty('--y', `${currentY}px`);
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        // 添加事件监听器
        pet.addEventListener('touchstart', dragStart, false);
        pet.addEventListener('touchend', dragEnd, false);
        pet.addEventListener('touchmove', drag, false);
        pet.addEventListener('mousedown', dragStart, false);
        document.addEventListener('mousemove', drag, false);
        document.addEventListener('mouseup', dragEnd, false);

        // 点击小鲸鱼的交互（仅在非拖动状态下触发）
        let clickCount = 0;
        let clickTimer = null;
        pet.addEventListener('click', (e) => {
            if (!isDragging) {
                clickCount++;
                clearTimeout(clickTimer);
                
                if (clickCount === 1) {
                    utils.setMood(pet, 'happy');
                    utils.createBubble('你好啊！有我登场你就放心吧 ^_^', pet);
                } else if (clickCount === 2) {
                    pet.classList.add('jump');
                    utils.createBubble('好开心！让我帮你解答问题吧！', pet);
                } else if (clickCount >= 3) {
                    pet.classList.add('dive');
                    utils.createBubble('哇！你太热情啦！我都要转晕了～', pet);
                }

                clickTimer = setTimeout(() => {
                    clickCount = 0;
                    utils.setMood(pet, '');
                    pet.classList.remove('jump', 'dive');
                }, 2000);
            }
        });

        // 监听用户操作
        document.addEventListener('click', (event) => {
            // 如果最近500ms内有拖动或调整大小，不触发按钮事件
            if (Date.now() - lastInteractionTime < 500) return;

            const target = event.target;
            
            // 调试日志
            console.log('Clicked element details:', {
                tagName: target.tagName,
                className: target.className,
                innerHTML: target.innerHTML,
                parentClassName: target.parentElement?.className,
                grandParentClassName: target.parentElement?.parentElement?.className
            });

            // 获取按钮元素的工具函数
            const getButton = (element) => {
                let current = element;
                while (current && current !== document.body) {
                    // 检查重试按钮
                    if (current.classList?.contains('ds-icon-button')) {
                        const svg = current.querySelector('svg');
                        if (svg?.querySelector('#重新生成')) {
                            return { type: 'retry', element: current };
                        }
                    }
                    
                    // 检查复制按钮
                    if (current.tagName?.toLowerCase() === 'svg') {
                        const content = current.innerHTML || '';
                        if (content.includes('clip1248_20193') || content.includes('拷贝图标')) {
                            return { type: 'copy', element: current };
                        }
                    }
                    current = current.parentElement;
                }
                return null;
            };

            // 显示动画和文字
            const showAnimation = (type, text) => {
                if (type) {
                    pet.classList.add(type);
                    setTimeout(() => pet.classList.remove(type), 800);
                }
                if (text) {
                    utils.createBubble(text, pet);
                }
            };

            // 定义按钮动作
            const buttonActions = {
                copy: () => showAnimation('jump', '已为你运载18.3KB智慧到剪贴板🌊'),
                retry: () => showAnimation('think', '那我再想想0.0....')
            };

            // 检测并执行按钮动作
            const foundButton = getButton(target);
            if (foundButton?.type && buttonActions[foundButton.type]) {
                console.log(`Executing action for ${foundButton.type} button`);
                buttonActions[foundButton.type]();
            }
        });

        // 监听复制事件
        document.addEventListener('copy', () => {
            const selectedText = window.getSelection().toString();
            if (selectedText) {
                utils.setMood(pet, 'happy');
                utils.createBubble('已为你运载18.3KB智慧到剪贴板🌊', pet);
                setTimeout(() => utils.setMood(pet, ''), 1500);
            }
        });

        // 记录最后一次交互时间
        let lastInteractionTime = 0;
        pet.addEventListener('mousedown', () => {
            lastInteractionTime = Date.now();
        });

        // 初始化夜间模式
        utils.checkNightMode(pet);
        setInterval(() => utils.checkNightMode(pet), 60000);

        // 换肤功能
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('pet_skin')) {
            document.documentElement.style.setProperty('--main-color', urlParams.get('pet_skin'));
            document.documentElement.style.setProperty('--highlight-color', urlParams.get('pet_skin'));
        }

        return pet;
    }

    // 确保DOM加载完成后再初始化
    function init() {
        const pet = initPet();
        console.log('智能鲸灵助手已启动！');
        // 初始欢迎
        setTimeout(() => {
            utils.createBubble('Hi！有什么需要帮忙的吗？', pet);
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
