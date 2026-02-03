/**
 * 日期處理工具 - 針對民國年與台灣法規需求
 */
// const moment = require('moment'); // Removed unused dependency

/**
 * 取得今日的民國日期字串 (格式: 115/03/05)
 * @returns {string} e.g. "115/03/05"
 */
function getCurrentROCDate() {
    return formatROCDate(new Date());
}

/**
 * 將日期物件格式化為民國年字串
 * @param {Date} date
 * @returns {string} e.g. "115/03/05"
 */
function formatROCDate(date) {
    const year = date.getFullYear() - 1911;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

/**
 * 增加指定天數
 * @param {number} days
 * @returns {string} ROC Date string
 */
function addDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return formatROCDate(date);
}

/**
 * 解析民國生日字串 (6碼或7碼)
 * @param {string} str - e.g. "680101" or "1000101"
 * @returns {Date|null} - Date object or null if invalid
 */
function parseROCBirthdate(str) {
    if (!str || !/^\d{6,7}$/.test(str)) {
        return null;
    }

    let year, month, day;

    if (str.length === 6) {
        year = parseInt(str.substring(0, 2)) + 1911;
        month = parseInt(str.substring(2, 4)) - 1;
        day = parseInt(str.substring(4, 6));
    } else {
        year = parseInt(str.substring(0, 3)) + 1911;
        month = parseInt(str.substring(3, 5)) - 1;
        day = parseInt(str.substring(5, 7));
    }

    const date = new Date(year, month, day);

    // 驗證日期有效性 (例如 2/30 會被自動進位到 3/2)
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
        return null;
    }

    return date;
}

/**
 * 計算年齡 (歲 + 月)
 * @param {Date} birthDate
 * @returns {object} { years, months }
 */
function calculateAge(birthDate) {
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // 如果月份是負的，或者月份相同但天數還沒到，歲數減一
    if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
    }

    // 如果天數是負的，月份減一
    if (days < 0) {
        months--;
        // 借上個月的天數來補
        // 取得上個月的最後一天
        const prevMonthDate = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonthDate.getDate();

        if (months < 0) {
            months += 12;
            years--;
        }
    }

    return { years, months, days };
}

module.exports = {
    getCurrentROCDate,
    addDays,
    parseROCBirthdate,
    calculateAge,
    formatROCDate
};
