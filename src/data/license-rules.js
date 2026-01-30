/**
 * 駕照持照狀態及車種適法性對照表
 * 依據：安全規則第61條、61-1條
 * 修正日期：114年11月6日
 */

// 車種定義
const VEHICLE_TYPES = {
    LIGHT_MOTO: { id: 'light_moto', label: '輕型機車', category: 'moto' },
    HEAVY_MOTO: { id: 'heavy_moto', label: '普通重型機車', category: 'moto' },
    SUPER_MOTO: { id: 'super_moto', label: '大型重型機車', category: 'moto' },
    SMALL_CAR: { id: 'small_car', label: '小型車', category: 'car' },
    TRUCK: { id: 'truck', label: '大貨車', category: 'large' },
    BUS: { id: 'bus', label: '大客車', category: 'large' },
    TRAILER: { id: 'trailer', label: '聯結車', category: 'large' },
    TRACTOR: { id: 'tractor', label: '曳引車', category: 'large' },
};

// 汽車駕照狀態
const CAR_LICENSE_STATUS = {
    NONE: { id: 'none', label: '未曾考領汽車駕照' },
    SUSPENDED: { id: 'suspended', label: '汽車駕照吊扣' },
    REVOKED: { id: 'revoked', label: '汽車駕照吊/註銷' },
    SMALL: { id: 'small', label: '小型車駕照' },
    TRUCK: { id: 'truck', label: '大貨車駕照' },
    BUS: { id: 'bus', label: '大客車駕照' },
    TRAILER: { id: 'trailer', label: '聯結車駕照' },
};

// 機車駕照狀態
const MOTO_LICENSE_STATUS = {
    NONE: { id: 'none', label: '未曾考領機車駕照' },
    SUSPENDED: { id: 'suspended', label: '機車駕照吊扣' },
    REVOKED: { id: 'revoked', label: '機車駕照吊/註銷' },
    LIGHT: { id: 'light', label: '輕型機車' },
    HEAVY: { id: 'heavy', label: '普通重型機車' },
    SUPER: { id: 'super', label: '大型重型機車' },
};

/**
 * 持照可駕駛車種對照表 (依據安全規則第61條)
 * key: 持有的駕照
 * value: 可合法駕駛的車種 array
 */
const LICENSE_ALLOWS = {
    // 汽車駕照
    trailer: ['trailer', 'bus', 'truck', 'tractor', 'small_car', 'light_moto'], // 聯結車駕照
    bus: ['bus', 'truck', 'tractor', 'small_car', 'light_moto'], // 大客車駕照 (不含雙節式)
    truck: ['truck', 'small_car', 'light_moto'], // 大貨車駕照
    small: ['small_car', 'light_moto'], // 小型車駕照 (112/6/30前考領者可駕輕型機車)

    // 機車駕照
    super: ['super_moto', 'heavy_moto', 'light_moto'], // 大型重型機車駕照
    heavy: ['heavy_moto', 'light_moto'], // 普通重型機車駕照
    light: ['light_moto'], // 輕型機車駕照
};

// 112/6/30 後新考領之小型車駕照不能騎輕型機車
const LICENSE_ALLOWS_NEW = {
    ...LICENSE_ALLOWS,
    small: ['small_car'], // 112/6/30 後考領者不可駕輕型機車
};

/**
 * 判斷駕駛行為是否合法
 * @param {string} vehicleType - 駕駛的車種
 * @param {string} carLicense - 汽車駕照狀態
 * @param {string} motoLicense - 機車駕照狀態
 * @returns {object} { legal: boolean, violation: string, article: string }
 */
function checkDrivingLegality(vehicleType, carLicense, motoLicense) {
    const vehicle = vehicleType;
    const isMoto = ['light_moto', 'heavy_moto', 'super_moto'].includes(vehicle);
    const isLargeCar = ['truck', 'bus', 'trailer', 'tractor'].includes(vehicle);

    // 檢查吊扣/吊銷狀態
    if (isMoto && motoLicense === 'suspended') {
        return { legal: false, violation: '吊扣期間駕車', article: '21條1項4款' };
    }
    if (isMoto && motoLicense === 'revoked') {
        return { legal: false, violation: '吊銷/註銷後駕車', article: '21條1項5款' };
    }
    if (!isMoto && carLicense === 'suspended') {
        return { legal: false, violation: '吊扣期間駕車', article: isLargeCar ? '21-1條1項4款' : '21條1項4款' };
    }
    if (!isMoto && carLicense === 'revoked') {
        return { legal: false, violation: '吊銷/註銷後駕車', article: isLargeCar ? '21-1條1項5款' : '21條1項5款' };
    }

    // 收集所有可駕駛的車種
    let allowedVehicles = [];

    // 從汽車駕照獲得的權限
    if (carLicense && LICENSE_ALLOWS[carLicense]) {
        allowedVehicles = [...allowedVehicles, ...LICENSE_ALLOWS[carLicense]];
    }

    // 從機車駕照獲得的權限
    if (motoLicense && LICENSE_ALLOWS[motoLicense]) {
        allowedVehicles = [...allowedVehicles, ...LICENSE_ALLOWS[motoLicense]];
    }

    // 去重
    allowedVehicles = [...new Set(allowedVehicles)];

    // 檢查是否可合法駕駛
    if (allowedVehicles.includes(vehicle)) {
        return { legal: true, violation: null, article: null };
    }

    // 判斷違規類型
    if (isMoto) {
        // 機車違規
        if (motoLicense === 'none' && carLicense === 'none') {
            return { legal: false, violation: '無照駕駛', article: '21條1項1款' };
        }
        // 有其他機車駕照但越級
        if (['light', 'heavy'].includes(motoLicense) && ['heavy_moto', 'super_moto'].includes(vehicle)) {
            return { legal: false, violation: '越級駕駛', article: '21條1項3款' };
        }
        // 有汽車駕照但無機車駕照
        if (carLicense !== 'none' && motoLicense === 'none') {
            // 112/6/30 後考領者不可騎輕型機車
            return { legal: false, violation: '無照駕駛', article: '21條1項1款' };
        }
        return { legal: false, violation: '無照駕駛', article: '21條1項1款' };
    } else if (isLargeCar) {
        // 大型車違規 - 適用21-1條
        if (carLicense === 'none') {
            return { legal: false, violation: '無照駕駛大型車', article: '21-1條1項1款' };
        }
        // 持較低級別駕照
        return { legal: false, violation: '越級駕駛大型車', article: '21-1條1項3款' };
    } else {
        // 小型車違規
        if (carLicense === 'none') {
            return { legal: false, violation: '無照駕駛', article: '21條1項1款' };
        }
        return { legal: false, violation: '越級駕駛', article: '21條1項3款' };
    }
}

/**
 * 取得罰鍰金額
 * @param {string} vehicleType - 車種
 * @param {string} recidivism - 再犯狀況 (none, within10y, dui_period, both)
 * @returns {object} { min: number, max: number, text: string }
 */
function getFineAmount(vehicleType, recidivism) {
    const isMoto = ['light_moto', 'heavy_moto', 'super_moto'].includes(vehicleType);
    const isLargeCar = ['truck', 'bus', 'trailer', 'tractor'].includes(vehicleType);

    let baseMin, baseMax, addPer;

    if (isMoto) {
        baseMin = 18000;
        baseMax = 36000;
        addPer = 12000;
    } else if (isLargeCar) {
        baseMin = 40000;
        baseMax = 80000;
        addPer = 24000;
    } else {
        // 小型車
        baseMin = 36000;
        baseMax = 60000;
        addPer = 12000;
    }

    switch (recidivism) {
        case 'none':
            return { min: baseMin, max: baseMax, text: `${baseMin.toLocaleString()} ~ ${baseMax.toLocaleString()} 元` };
        case 'within10y':
            return { min: baseMax, max: baseMax, text: `${baseMax.toLocaleString()} 元 (10年內再犯)` };
        case 'dui_period':
            // 酒駕吊扣銷期間駕車 - 適用21條1項2款
            return { min: baseMax, max: baseMax, text: `${baseMax.toLocaleString()} 元 (酒駕吊扣銷期間)` };
        case 'both':
            return { min: baseMax + addPer, max: null, text: `${baseMax.toLocaleString()} 元 + 每次加罰 ${addPer.toLocaleString()} 元 (無上限)` };
        default:
            return { min: baseMin, max: baseMax, text: `${baseMin.toLocaleString()} ~ ${baseMax.toLocaleString()} 元` };
    }
}

/**
 * 取得應加開的條款
 * @param {boolean} isOwner - 是否同為車主
 * @param {string} violation - 違規類型
 * @returns {string[]} - 加開條款列表
 */
function getAdditionalCitations(isOwner, violation, vehicleType) {
    const isLargeCar = ['truck', 'bus', 'trailer', 'tractor'].includes(vehicleType);
    const citations = [];

    // 所有無照/越級駕駛都要移置保管
    citations.push('當場移置保管車輛 (禁止其駕駛)');

    if (isOwner) {
        // 駕駛同為車主 - 合併處理
        if (isLargeCar) {
            citations.push(`舉發「21-1條6項」：吊扣牌照，移置保管時扣繳牌照`);
        } else {
            citations.push(`舉發「21條6項」：吊扣牌照，移置保管時扣繳牌照`);
        }
    } else {
        // 駕駛非車主 - 另舉發所有人
        if (isLargeCar) {
            citations.push(`舉發『所有人』「21-1條6項」：吊扣牌照，移置保管時扣繳牌照`);
            citations.push(`舉發『所有人』「21-1條7項」：併處罰鍰`);
        } else {
            citations.push(`舉發『所有人』「21條6項」：吊扣牌照，移置保管時扣繳牌照`);
            citations.push(`舉發『所有人』「21條7項」：併處罰鍰`);
        }
    }

    return citations;
}

/**
 * 法條註釋/函釋依據
 */
const LEGAL_ANNOTATIONS = {
    // 基本參考資料
    referenceTable: '參考資料：駕照及車種違規舉發對照表（114年11月6日修正）',

    // 警署交字第1150053864號
    policeDirective: '依據警署交字第1150053864號：車輛所有人或受託人到場並能即時接手駕駛，得准予當場領回。',

    // 路監交字第1130062780號函 - 重要！
    roadSupervision_21_3: '依據路監交字第1130062780號函(二)：第21條3項、第21-1條3項所稱「吊銷駕駛執照期間」，駕駛執照吊銷後未重新考領者均適用之。',
    roadSupervision_66: '依據路監交字第1130062780號函(三)：第66條1項規定汽車牌照經吊銷或註銷者，須滿6個月且經檢驗合格後，始得再行請領。',

    // 60條3項
    disobey: '不聽制止或不服稽查，另舉發60條3項。',

    // 安全規則
    safetyRule54: '依據安全規則54條3項：職業駕照經註銷未換領普通駕照，不得駕駛汽車。',
    safetyRule61: '依據安全規則61條：持照可駕駛車種對照。',
    safetyRule61_1: '依據安全規則61-1條：第21條1項9款所稱持照條件。',

    // 新法施行日期
    newLawDate: '新法施行日期：115年1月31日起，無照累犯計算「重新起算」。',
};

module.exports = {
    VEHICLE_TYPES,
    CAR_LICENSE_STATUS,
    MOTO_LICENSE_STATUS,
    LICENSE_ALLOWS,
    LEGAL_ANNOTATIONS,
    checkDrivingLegality,
    getFineAmount,
    getAdditionalCitations,
};
