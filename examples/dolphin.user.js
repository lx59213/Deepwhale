// ==UserScript==
// @name         DeepSeek助手 - 海豚
// @namespace    http://deepseek.com/
// @version      0.1
// @description  为DeepSeek添加可爱的海豚助手
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

    GM_addStyle(`
        :root {
            --main-color: #1E90FF;
            --highlight-color: #87CEFA;
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
            will-change: transform;
        }

        #ds-pet .dolphin-body {
            position: relative;
            width: 100%;
            height: 100%;
            background-color: var(--main-color);
            border-radius: 40px 40px 15px 15px;
            transform: rotate(-10deg);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            animation: dolphin-swim 3s ease-in-out infinite;
        }

        #ds-pet .dolphin-body:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 40%;
            background: var(--highlight-color);
            border-radius: 40px 40px 0 0;
            opacity: 0.3;
        }

        #ds-pet .dolphin-fin {
            position: absolute;
            top: 40%;
            right: -5px;
            width: 20px;
            height: 25px;
            background: var(--main-color);
            clip-path: polygon(0 0, 100% 50%, 0 100%);
            transform-origin: left center;
            animation: fin-wave 2s ease-in-out infinite;
        }

        #ds-pet .dolphin-tail {
            position: absolute;
            left: -15px;
            bottom: 20px;
            width: 25px;
            height: 30px;
            background: var(--main-color);
            clip-path: polygon(100% 0, 0 50%, 100% 100%);
            transform-origin: right center;
            animation: tail-wave 2s ease-in-out infinite;
        }

        #ds-pet .eyes {
            position: absolute;
            top: 15px;
            right: 15px;
            width: 25px;
            height: 8px;
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
            transition: all 0.3s ease;
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

        #ds-pet .smile {
            position: absolute;
            bottom: 20px;
            right: 25px;
            width: 15px;
            height: 8px;
            border: 2px solid white;
            border-radius: 50%;
            border-top: none;
            transition: all 0.3s ease;
        }

        /* 基础动画 */
        @keyframes dolphin-swim {
            0%, 100% { transform: translateY(0) rotate(-10deg); }
            50% { transform: translateY(-10px) rotate(-10deg); }
        }

        @keyframes fin-wave {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-15deg); }
        }

        @keyframes tail-wave {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-20deg); }
        }

        /* 交互动画 */
        @keyframes jump {
            0%, 100% { transform: translate3d(var(--x), var(--y), 0); }
            50% { transform: translate3d(var(--x), calc(var(--y) - 30px), 0) rotate(15deg); }
        }

        @keyframes flip {
            0%, 100% { transform: translate3d(var(--x), var(--y), 0) rotate(0deg); }
            50% { transform: translate3d(var(--x), var(--y), 0) rotate(360deg); }
        }

        @keyframes think {
            0%, 100% { transform: translate3d(var(--x), var(--y), 0) rotate(0deg); }
            25% { transform: translate3d(var(--x), var(--y), 0) rotate(-15deg); }
            75% { transform: translate3d(var(--x), var(--y), 0) rotate(15deg); }
        }

        /* 情绪状态 */
        #ds-pet.happy .smile {
            border-radius: 0 0 100% 100%;
            height: 12px;
            transform: translateY(-2px);
        }

        #ds-pet.happy .eye {
            height: 6px;
            transform: translateY(1px);
        }

        #ds-pet.sad .smile {
            border-radius: 100% 100% 0 0;
            height: 12px;
            transform: translateY(2px) rotate(180deg);
        }

        #ds-pet.sad .eye {
            transform: translateY(2px);
        }

        #ds-pet.think .smile {
            width: 10px;
            height: 6px;
        }

        #ds-pet.think .eye {
            height: 6px;
            transform: translateY(1px) rotate(-10deg);
        }

        /* 状态类 */
        #ds-pet.dragging {
            opacity: 0.8;
            cursor: grabbing;
        }

        #ds-pet.resizing {
            cursor: se-resize;
        }

        #ds-pet.jump {
            animation: jump 0.5s ease-in-out;
        }

        #ds-pet.flip {
            animation: flip 0.8s ease-in-out;
        }

        #ds-pet.think {
            animation: think 0.8s ease-in-out;
        }

        /* 夜间模式 */
        #ds-pet.night-mode {
            filter: brightness(0.8) saturate(1.2);
        }

        #ds-pet.night-mode .dolphin-body {
            box-shadow: 0 0 20px rgba(30, 144, 255, 0.5);
        }

        /* 气泡样式 */
        .bubble {
            position: fixed;
            background: rgba(255,255,255,0.95);
            padding: 12px 20px;
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(30,144,255,0.2);
            z-index: 99990;
            font-size: 14px;
            color: #333;
            max-width: 200px;
            line-height: 1.4;
            pointer-events: none;
            animation: bubble 0.4s ease-out;
            white-space: pre-wrap;
            word-wrap: break-word;
            transform-origin: bottom center;
        }

        .bubble:before {
            content: '';
            position: absolute;
            bottom: -8px;
            right: 20px;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid rgba(255,255,255,0.95);
        }

        @keyframes bubble {
            0% {
                opacity: 0;
                transform: translateY(20px) scale(0.8);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `);

    const utils = {
        setMood(pet, mood) {
            // 移除所有情绪类
            pet.classList.remove('happy', 'sad', 'think');
            
            // 添加新的情绪类
            if (mood) {
                pet.classList.add(mood);
            }
        },

        checkNightMode(pet) {
            const hour = new Date().getHours();
            const isDark = document.body.classList.contains('dark') || (hour >= 18 || hour < 6);
            
            if (isDark) {
                pet.classList.add('night-mode');
            } else {
                pet.classList.remove('night-mode');
            }
        },

        createBubble(text, pet) {
            const petRect = pet.getBoundingClientRect();
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.textContent = text.length > 50 ? text.substring(0, 50) + '...' : text;
            
            document.body.appendChild(bubble);
            const bubbleRect = bubble.getBoundingClientRect();
            
            let bubbleX = petRect.left - bubbleRect.width - 20;
            let bubbleY = petRect.top + (petRect.height - bubbleRect.height) / 2;
            
            // 如果左边空间不足，显示在右边
            if (bubbleX < 10) {
                bubbleX = petRect.right + 20;
                bubble.style.transformOrigin = 'left center';
            }
            
            // 确保气泡不超出屏幕
            bubbleY = Math.max(10, Math.min(window.innerHeight - bubbleRect.height - 10, bubbleY));
            
            bubble.style.left = bubbleX + 'px';
            bubble.style.top = bubbleY + 'px';
            
            setTimeout(() => bubble.remove(), 3000);
        }
    };

    function initPet() {
        const pet = document.createElement('div');
        pet.id = 'ds-pet';
        pet.innerHTML = `
            <div class="resize-handle"></div>
            <div class="dolphin-body">
                <div class="dolphin-fin"></div>
                <div class="dolphin-tail"></div>
                <div class="eyes">
                    <div class="eye"></div>
                    <div class="eye"></div>
                </div>
                <div class="smile"></div>
            </div>
        `;

        document.body.appendChild(pet);

        // 从localStorage读取大小和位置
        const savedSize = GM_getValue('petSize');
        if (savedSize) {
            pet.style.width = savedSize.width + 'px';
            pet.style.height = savedSize.height + 'px';
        }

        const savedPosition = GM_getValue('petPosition');
        if (savedPosition) {
            pet.style.transform = `translate3d(${savedPosition.x}px, ${savedPosition.y}px, 0)`;
            xOffset = savedPosition.x;
            yOffset = savedPosition.y;
        }

        // 实现拖拽功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        function dragStart(e) {
            if (e.target === pet.querySelector('.resize-handle')) return;
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            if (e.target === pet || pet.contains(e.target)) {
                isDragging = true;
                pet.classList.add('dragging');
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, pet);
                
                // 保存位置
                GM_setValue('petPosition', { x: currentX, y: currentY });
            }
        }

        function dragEnd(e) {
            if (!isDragging) return;
            
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            pet.classList.remove('dragging');
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        // 实现大小调整功能
        const resizeHandle = pet.querySelector('.resize-handle');
        let isResizing = false;
        let originalWidth;
        let originalHeight;
        let originalX;
        let originalY;

        function resizeStart(e) {
            if (e.target !== resizeHandle) return;
            
            isResizing = true;
            pet.classList.add('resizing');
            originalWidth = pet.offsetWidth;
            originalHeight = pet.offsetHeight;
            originalX = e.clientX;
            originalY = e.clientY;
            
            e.stopPropagation();
        }

        function resize(e) {
            if (!isResizing) return;
            
            const width = originalWidth + (e.clientX - originalX);
            const height = originalHeight + (e.clientY - originalY);
            
            if (width > 40 && height > 40) {
                pet.style.width = width + 'px';
                pet.style.height = height + 'px';
                
                // 保存大小
                GM_setValue('petSize', { width, height });
            }
        }

        function resizeEnd(e) {
            if (!isResizing) return;
            
            isResizing = false;
            pet.classList.remove('resizing');
        }

        // 绑定事件
        pet.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        resizeHandle.addEventListener('mousedown', resizeStart);
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', resizeEnd);

        // 添加点击互动
        pet.addEventListener('click', () => {
            if (!isDragging && !isResizing) {
                const actions = ['jump', 'dive', 'think'];
                const randomAction = actions[Math.floor(Math.random() * actions.length)];
                
                pet.classList.add(randomAction);
                utils.setMood(pet, 'happy');
                utils.createBubble('Hi! 👋', pet);
                
                setTimeout(() => {
                    pet.classList.remove(randomAction);
                }, 800);
            }
        });

        // 随机动作
        setInterval(() => {
            const actions = ['happy', 'sad', 'normal'];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            utils.setMood(pet, randomAction);
        }, 5000);

        // 检查夜间模式
        utils.checkNightMode(pet);
        const observer = new MutationObserver(() => utils.checkNightMode(pet));
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        return pet;
    }

    function init() {
        if (document.querySelector('#ds-pet')) return;
        initPet();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
