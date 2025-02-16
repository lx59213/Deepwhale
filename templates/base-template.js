// ==UserScript==
// @name         DeepSeek助手 - {CHARACTER_NAME}
// @namespace    http://deepseek.com/
// @version      0.1
// @description  为DeepSeek添加可爱的{CHARACTER_NAME}助手
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
            --main-color: {MAIN_COLOR};
            --highlight-color: {HIGHLIGHT_COLOR};
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

        /* 这里添加角色特定的样式 */
        {CHARACTER_SPECIFIC_STYLES}

        /* 这里添加角色特定的动画 */
        {CHARACTER_SPECIFIC_ANIMATIONS}
    `);

    // 工具函数
    const utils = {
        setMood(pet, mood) {
            // 设置心情的函数
        },

        checkNightMode(pet) {
            // 检查夜间模式的函数
        },

        createBubble(text, pet) {
            // 创建对话气泡的函数
        }
    };

    // 初始化函数
    function initPet() {
        // 这里实现角色特定的初始化逻辑
    }

    // 确保DOM加载完成后再初始化
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
