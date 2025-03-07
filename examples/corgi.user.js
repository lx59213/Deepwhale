// ==UserScript==
// @name         DeepSeek助手 - 柯基
// @namespace    http://deepseek.com/
// @version      0.1
// @description  为DeepSeek添加可爱的柯基助手
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

        /* 动画效果 */
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        @keyframes wag {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(10deg); }
        }

        #ds-pet .corgi {
            animation: bounce 3s ease-in-out infinite;
        }

        #ds-pet .tail {
            transform-origin: center;
            animation: wag 1s ease-in-out infinite;
        }

        #ds-pet.happy .mouth {
            transform: scaleY(1.2);
        }

        #ds-pet.sad .mouth {
            transform: scaleY(-1) translateY(-5px);
        }

        /* 夜间模式 */
        #ds-pet.night-mode {
            filter: brightness(1) saturate(1.2);
        }

        /* 气泡样式 */
        .bubble {
            position: fixed;
            background: rgba(255,255,255,0.95);
            padding: 12px 20px;
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
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

    function createCorgiSVG() {
        // 将整个SVG内容嵌入为字符串
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" viewBox="0 0 542.2 500.3" xmlns="http://www.w3.org/2000/svg">
 <g transform="translate(-870.1,-59.25)">
  <path d="m1171 559.5c-92-1.2-186-6.1-273.2-40.5-28.6-5.1-41.3-45.8-7.4-54.1 87
.7-34.3 182.6-27.7 274.6-28.8 61 1.4 126-5.2 183 19.6 20 13.8 46 18.6 60 39.2 14
 24.5-9 52.9-34 48.9-35-2.6-68 11.9-103 12.3-33 2.8-67 3.2-100 3.4z" fill-rule="
evenodd" opacity=".3"/>
  <path d="m1248 117.5c-4-5.8-63-67.25-86-57.13-29 14.54-14 110.63 18 125.53" fi
ll="#d7882d" fill-rule="evenodd"/>
  <path d="m1176 75.57c-10 0.58-14 11.97-15 20.39-5 30.04 1 61.94 18 87.44 2 3.8
 5 7.2 9 9.7 21-20.9 42-41.9 62-63.8-19-20.2-39-39.74-64-51.52-3-1.28-6-2.27-10-
2.21z" fill="#fff6d5" fill-rule="evenodd"/>
  <rect transform="matrix(.0792 .9969 -.9969 .0792 0 0)" x="425.8" y="-1181" wid
th="163.3" height="57.43" ry="28.72" fill="#f28c1a" fill-rule="evenodd"/>      
  <path d="m1186 494.8c-8-1.8-15-7.8-19-15.3-2-3.9-2-6.3-4-26.2l-2-22.1 11-0.2c15-
0.5 26-3 44-9.7 2-0.6 2 0.9 3 22.6 3 25.9 2 30.3-2 37.3-6 10.8-19 16.5-31 13.6z" fill="#fff6d5" fill-rule="evenodd"/>
  <rect x="882.5" y="244.9" width="403.3" height="196.6" ry="92.9" fill="#d7882d
" fill-rule="evenodd"/>
  <path d="m1310 120.1c3-5.8 62-68.02 85-58.18 29 14.18 15 110.48-17 125.78" fil
l="#d7882d" fill-rule="evenodd"/>
  <path d="m1381 77.29c10 0.46 14 11.8 15 20.2 5 30.01 0 61.91-16 87.71-3 3.8-6 7.2-10 9.8-21-20.7-42-41.4-63-63 19-20.5 39-40.27 64-52.37 3-1.32 6-2.34 10-2.34z" fill="#fff6d5" fill-rule="evenodd"/>
  <path d="m1383 102.9c-9 4.7-16 14.2-22 22 2 10 5 22.6 13 25.8 3 0.7 7 0.4 7-5.1 2-13.8 4-28.4 3-42.3-1-0.7-1-1.1-1-0.4zm0 0.1c1 0 0 0 0 0z" fill="#f5b8b8" fill-rule="evenodd"/>
  <path d="m1209 134.7c40-41.73 124-35.37 148 0 28 43.3 28 108.4-12 140-50 48.4-113 60.2-160 16 5-53.3-12-126 24-156z" fill="#d7882d" fill-rule="evenodd"/>     
  <path d="m1278 382.9c-4-69.1-92-96.2-94-157.4 0 0 3-48.3 4-48.3 1 3.9 23 55.8 65 60.1 21 1.3 57 4.1 82-3.9 21-8.7 37-44.2 42-50.9-2 30.5 1 31.3-6 55.3-8 27.4-32 44.4-54 59.6-7 4.7-23 12.2-29 14.4-5 1.4-5 1.7-5 3.6 5 21.6 3 51-3 66.7l-2 3.7z" fill="#fff6d5" fill-rule="evenodd"/>
  <path d="m1345 268.8c-13 21.1-43 11.4-49 12.1-6 0.8-32 9.4-49-11.8-8-11.1 26-66.5 49-67.3 24-0.1 56 55.3 49 67z" fill="#fff6d5"/>
  <path d="m1254 187.3c-8 0-16 8.4-14 17.8 3 12.3 18 15.6 26 7 5-5.6 4-17-2-21.5-3-2.3-7-3.5-10-3.3z" fill-rule="evenodd"/>
  <path d="m1334 185.3c-8 0-16 8.4-14 17.8 3 12.3 18 15.6 26 7 5-5.6 4-17-2-21.5-3-2.3-7-3.5-10-3.3z" fill-rule="evenodd"/>
  <rect transform="matrix(.0792 .9969 -.9969 .0792 0 0)" x="455.5" y="-1225" width="163.3" height="57.43" ry="28.72" fill="#d7882d" fill-rule="evenodd"/>      
  <path d="m1232 521c-8-1.8-15-7.8-19-15.3-2-3.2-5-41.4-4-42.2 0-0.1 7-0.3 15-0.4l15-0.3 1 5.4v15c1 5.3 1 13.8 2 19l1 9.4-5 2.5c-5 2.7-14 3.9-18 2.5z" fill-rule="evenodd" opacity=".2"/>
  <rect transform="matrix(-.121 .9927 -.9927 -.121 0 0)" x="219.4" y="-984.9" width="163.3" height="57.44" ry="28.72" fill="#d7882d" fill-rule="evenodd"/>
  <path d="m894.6 492.7c-7.6-3.5-13.8-10.9-15.8-18.9-1.5-4.3-1.2-6.7 1.2-26.5l2.7-21.9 10.8 1.9c14.8 2.5 25.9 2.2 44.4-0.8 2.1-0.2 1.9 1.3-0.7 22.8-3.2 25.8-4.7 30-9.5 36.3-8.2 9.2-22.6 12.1-33.1 7.1z" fill="#fff6d5" fill-rule="evenodd"/>
  <path d="m920.8 484.8c-2.8-3.7-3.7-6.1-19.2-55.8-7.9-25-13.8-45.3-13.7-47.1 0-3 0-3 2.3 2.3 8.3 19.1 25.7 37.3 43.7 45.7 5.7 2.6 5.5 1.1 2.7 23.3-2.1 16.6-3.1 21.5-5.2 25.5-1.4 2.7-6.8 8.9-7.8 8.9-0.4 0-1.6-1.3-2.8-2.8z" fill-rule="evenodd" opacity=".2"/>
  <rect transform="matrix(.2397 .9709 -.9709 .2397 0 0)" x="576.8" y="-857.5" width="163.3" height="57.44" ry="28.72" fill="#d7882d" fill-rule="evenodd"/>
  <path d="m929.5 289.9c-17.1 0-32.6 8.6-43.5 22.5-2.3 8.1-3.5 16.6-3.5 25.4v10.8c0 34.2 18.4 64 45.8 80.1 1.9 1.6 2.5 2.6 2.9 4.1 0.5 1.7 4.4 17.7 8.8 35.5 9.4 38.2 10.4 40.7 18.2 46.3 4.4 3.3 5.1 3.1 2.8-0.6-1.1-1.8-2.4-4.4-2.9-5.7-0.6-1.7-10.9-42.9-18.7-74.5 28.5-5.6 50.3-35.5 50.3-71.4 0-40.1-26.9-72.5-60.2-72.5z" fill="#fff6d5" fill-rule="evenodd"/>
  <path d="m911.2 369.5c-4.9-0.4-12.2-2.7-15.7-5.3-5.1-3.5-9.5-10.1-11.7-17.2l-1-3.5 4.9 3.9c20 16.2 53.7 3.2 64.3-24.7 1.6-4.1 3-7.4 3.2-7.4s0.6 3.6 0.8 8c0.3 6.9 0 9.1-2.3 15.3-6.7 18.9-24.6 32-42.5 30.9z" fill-rule="evenodd" opacity=".2"/>
  <path d="m973.6 520.2c-8.4-0.5-16.7-5.3-21.5-12-2.9-3.5-3.5-5.9-8.3-25.3l-5.3-21.4 10.8-2.1c14.8-2.9 25.1-7.1 41.3-16.6 1.8-0.8 2.2 0.6 7.4 21.7 6 25.2 6 29.7 4 37.2-4.3 11.6-16.8 19.4-28.4 18.5z" fill="#fff6d5" fill-rule="evenodd"/>
  <path d="m1066 299.7c13 80-23 134.5-73.2 141.9 40.2-19.4 78.2-78.9 73.2-141.9z" fill-rule="evenodd" opacity=".2"/>
  <path d="m1002 439.7c13-3.4 24-10.2 35-20.9 7-6.7 7-6.9 11-6.9 7 0 34-2.5 47-4.2 24-3.2 47-8.2 68-14.7 13-4 33-11.3 39-14.5 2-1 4-1.6 4-1.4s-1 2-2 4c-2 5.3-2 13 0 37.4 1 16.8 1 21.3 0 21.8 0 0.4-47 0.7-104 0.7-91-0.1-102.1-0.2-98-1.3z" fill-rule="evenodd" opacity=".2"/>
  <path d="m1187 494.8c-2-1-5-5.9-7-10.9-1-3.2-5-41.4-4-42.2 0-0.1 7-0.3 15-0.4l15-0.3 1 5.4v15c1 5.3 1 13.8 2 19l1 9.4-5 2.5c-5 2.7-14 3.9-18 2.5z" fill-rule="evenodd" opacity=".2"/>
  <path d="m1270 283.4c-5-1.5-11-5.5-14-9.6-2-2.2-3-4-4-6.6v-3.6l3 3.6c3 4.7 9 8.7 15 10.5 5 1.8 14 1.9 22 0.4 4-0.9 6-0.9 13-0.1 16 1.7 25-1.1 32-8.9l3-3.8v2.8c0 2.3-1 3.6-4 7.6-4 3.9-6 5.1-9 6.5-5 1.6-7 1.8-20 1.6-8-0.1-18 0.1-24 0.4-7 0.4-10 0.2-13-0.8z" fill-rule="evenodd" opacity=".2"/>
  <path d="m1211 267.8c14 27.9 57 41.7 70 43.3 2 0.6 5 12.3 2 12.3-25-5.4-72-36-72-55.6z" fill-opacity=".4201" fill-rule="evenodd" opacity=".4"/>
  <path d="m1327 195.6c-2 0-4 2-3 4.2 1 2.9 4 3.7 6 1.6 1-1.2 1-4-1-5-1-0.6-1-0.8-2-0.8z" fill="#fff" fill-rule="evenodd"/>
  <path d="m1250 195.5c-3 0-5 2-4 4.3 1 2.9 5 3.6 6 1.5 1-1.2 1-4-1-4.9 0-0.6 0-0.9-1-0.9z" fill="#fff" fill-rule="evenodd"/>
  <path d="m1296 232.4c-7 0.4-14 2.7-21 6.6-1 12.1 7 25.4 20 26.6 15 2.5 28-14.1 25-27.8-7-4-15-5.8-24-5.4z" fill-rule="evenodd"/>
  <g transform="translate(-222,-4)" fill-rule="evenodd" stroke="#d7882d" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
   <path d="m1519 270.7v8.3"/>
   <path d="m1531 282.7-14-3.3"/>
   <path d="m1507 282.7 14-3.3"/>
  </g>
  <ellipse cx="1171" cy="559.5" rx="250" ry="40" fill-rule="evenodd" opacity=".3"/>
  <path d="m1296 120.3c-9-0.2-17 7.8-18 16.4 0 16.9-6 46.7 6 58.9 5 3.3 1 26.3 11 26.3 11 0.7 6-21.9 12-26.1 11-10.4 7-42.2 7-59.7 0-9.4-9-16.4-18-15.8z" fill="#fff6d5" fill-rule="evenodd" stroke="#d7882d"/>
  <path d="m1188 98c-7 1.6-7 9.1-8 14.1-2 8.6-1 23.3 0 31.8 8 3.3 16 2.6 22-2.7 9-6.6 12-12.6 16-21.1-9-6.8-19-20-30-22.1z" fill="#f5b8b8" fill-rule="evenodd" stroke="#d7882d"/>
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
        pet.innerHTML = createCorgiSVG();

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
                utils.createBubble('汪! 👋', pet);
                
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
