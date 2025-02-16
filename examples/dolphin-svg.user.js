// ==UserScript==
// @name         DeepSeek助手 - SVG海豚
// @namespace    http://deepseek.com/
// @version      0.1
// @description  为DeepSeek添加可爱的SVG海豚助手
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

        #ds-pet.dragging {
            opacity: 0.8;
            cursor: grabbing;
        }

        #ds-pet.resizing {
            cursor: se-resize;
        }

        #ds-pet svg {
            width: 100%;
            height: 100%;
            overflow: visible;
        }

        #ds-pet .body {
            fill: #1E90FF;
            stroke: none;
        }

        #ds-pet .highlight {
            fill: #87CEFA;
            opacity: 0.3;
        }

        #ds-pet .eye {
            fill: white;
            stroke: none;
        }

        #ds-pet .pupil {
            fill: black;
            stroke: none;
        }

        #ds-pet .smile {
            fill: none;
            stroke: white;
            stroke-width: 2;
            stroke-linecap: round;
        }

        #ds-pet.happy .smile {
            d: path("M3,0 Q8,6 13,0");
        }

        #ds-pet.sad .smile {
            d: path("M3,6 Q8,0 13,6");
        }

        @keyframes swim {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        @keyframes finWave {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-15deg); }
        }

        #ds-pet .fin {
            transform-origin: 0 50%;
            animation: finWave 2s ease-in-out infinite;
        }

        #ds-pet .dolphin {
            animation: swim 3s ease-in-out infinite;
        }

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
        }

        @keyframes bubble {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
        }
    `);

    function createDolphinSVG() {
        return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g class="dolphin">
                <!-- 身体主体 -->
                <path class="body" d="
                    M 20,50 
                    C 20,30 40,20 60,20 
                    C 80,20 90,35 90,50 
                    C 90,65 80,80 60,80 
                    C 40,80 20,70 20,50 
                    Z
                "/>
                
                <!-- 身体高光 -->
                <path class="highlight" d="
                    M 25,45 
                    C 25,30 40,25 60,25 
                    C 75,25 85,35 85,45 
                    C 85,55 75,60 60,60 
                    C 40,60 25,55 25,45 
                    Z
                "/>

                <!-- 鳍 -->
                <path class="body fin" d="
                    M 70,45 
                    C 85,40 90,45 95,50 
                    C 90,55 85,60 70,55 
                    Z
                "/>

                <!-- 尾巴 -->
                <path class="body" d="
                    M 20,50 
                    C 15,45 10,45 5,50 
                    C 10,55 15,55 20,50 
                    Z
                "/>

                <!-- 眼睛 -->
                <circle class="eye" cx="75" cy="40" r="4"/>
                <circle class="pupil" cx="76" cy="39" r="2"/>

                <!-- 微笑 -->
                <path class="smile" d="M65,55 Q75,58 85,55"/>
            </g>
        </svg>`;
    }

    const utils = {
        setMood(pet, mood) {
            pet.classList.remove('happy', 'sad', 'think');
            if (mood) {
                pet.classList.add(mood);
            }
        },

        checkNightMode(pet) {
            const hour = new Date().getHours();
            const isDark = document.body.classList.contains('dark') || (hour >= 18 || hour < 6);
            
            if (isDark) {
                pet.querySelector('.body').style.fill = '#1873CC';
                pet.querySelector('.highlight').style.fill = '#6FB7F7';
            } else {
                pet.querySelector('.body').style.fill = '#1E90FF';
                pet.querySelector('.highlight').style.fill = '#87CEFA';
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
            
            if (bubbleX < 10) {
                bubbleX = petRect.right + 20;
            }
            
            bubbleY = Math.max(10, Math.min(window.innerHeight - bubbleRect.height - 10, bubbleY));
            
            bubble.style.left = bubbleX + 'px';
            bubble.style.top = bubbleY + 'px';
            
            setTimeout(() => bubble.remove(), 3000);
        }
    };

    function initPet() {
        const pet = document.createElement('div');
        pet.id = 'ds-pet';
        pet.innerHTML = createDolphinSVG();

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

        // 拖拽功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            if (e.target.closest('#ds-pet')) {
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

                pet.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                GM_setValue('petPosition', { x: currentX, y: currentY });
            }
        }

        function dragEnd() {
            if (!isDragging) return;
            
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            pet.classList.remove('dragging');
        }

        // 添加事件监听
        pet.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // 点击互动
        pet.addEventListener('click', () => {
            if (!isDragging) {
                utils.setMood(pet, 'happy');
                utils.createBubble('Hi! 👋', pet);
                
                setTimeout(() => {
                    utils.setMood(pet, null);
                }, 1000);
            }
        });

        // 随机心情变化
        setInterval(() => {
            const moods = [null, 'happy', 'sad'];
            const randomMood = moods[Math.floor(Math.random() * moods.length)];
            utils.setMood(pet, randomMood);
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
