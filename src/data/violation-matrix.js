/**
 * 我國駕駛人駕駛執照「持照狀態」及駕駛「車種」適法性對照表
 * 依據：道路交通管理處罰條例、安全規則第61條、61-1條
 * 修正日期：114年11月6日
 * 
 * 表格結構：
 * - X軸 (columns): 駕駛車種
 * - Y軸 (rows): 汽車駕照狀態 + 機車駕照狀態
 * - 值: V = 合法, 條款 = 違規應舉發之法條
 */

// 車種代碼
const VEHICLES = {
    TRAILER: 'trailer',      // 聯結車
    BUS: 'bus',              // 大客車
    TRUCK: 'truck',          // 大貨車
    SMALL_CAR: 'small_car',  // 小型車
    SUPER_MOTO: 'super_moto', // 大型重型機車
    HEAVY_MOTO: 'heavy_moto', // 普通重型機車
    LIGHT_MOTO: 'light_moto', // 普通輕型機車
    MINI_MOTO: 'mini_moto',   // 小型輕型機車
};

// 汽車駕照狀態代碼
const CAR_LICENSE = {
    TRAILER: 'trailer',    // 聯結車駕照
    BUS: 'bus',            // 大客車駕照
    TRUCK: 'truck',        // 大貨車駕照
    SMALL: 'small',        // 小型車駕照
    REVOKED: 'revoked',    // 汽車駕照吊(註)銷
    SUSPENDED: 'suspended', // 汽車駕照吊扣
    NONE: 'none',          // 無汽車駕照
};

// 機車駕照狀態代碼
const MOTO_LICENSE = {
    SUPER: 'super',        // 大型重型機車駕照
    HEAVY: 'heavy',        // 普通重型機車駕照
    LIGHT: 'light',        // 普通輕型機車駕照
    REVOKED: 'revoked',    // 機車駕照吊(註)銷
    SUSPENDED: 'suspended', // 機車駕照吊扣
    NONE: 'none',          // 無機車駕照
};

// 合法標記
const V = { legal: true };

/**
 * 完整違規對照矩陣
 * 格式: MATRIX[汽車駕照][機車駕照][駕駛車種] = 結果
 * 結果: { legal: true } 或 { article: '條款', desc: '說明' }
 */
const VIOLATION_MATRIX = {
    // ==================== 聯結車駕照 ====================
    trailer: {
        super: {  // 大型重型機車駕照
            trailer: V, bus: V, truck: V, small_car: V,
            super_moto: V, heavy_moto: V, light_moto: V, mini_moto: V,
        },
        heavy: {  // 普通重型機車駕照
            trailer: V, bus: V, truck: V, small_car: V,
            super_moto: { article: '22條2項', desc: '駕駛執照逾期' },
            heavy_moto: V, light_moto: V, mini_moto: V,
        },
        light: {  // 普通輕型機車駕照
            trailer: V, bus: V, truck: V, small_car: V,
            super_moto: { article: '22條2項', desc: '駕駛執照逾期' },
            heavy_moto: { article: '22條1項6款', desc: '領有輕型機車駕駛執照，駕駛普通重型機車' },
            light_moto: V, mini_moto: V,
        },
        revoked: {  // 機車駕照吊(註)銷
            trailer: V, bus: V, truck: V, small_car: V,
            super_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
            heavy_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
            light_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
            mini_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
        },
        suspended: {  // 機車駕照吊扣
            trailer: V, bus: V, truck: V, small_car: V,
            super_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
            heavy_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
            light_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
            mini_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
        },
        none: {  // 無機車駕照
            trailer: V, bus: V, truck: V, small_car: V,
            super_moto: { article: '22條2項', desc: '持汽車駕照駕駛大型重型機車' },
            heavy_moto: { article: '22條1項4款', desc: '持汽車駕照駕駛普通重型機車' },
            light_moto: { article: '22條1項5款', desc: '領有聯結車、大客車、大貨車或小型車駕駛執照，駕駛輕型機車。但112年06月30日前已取得該汽車駕駛執照者，不在此限', note112: true },
            mini_moto: { article: '22條1項5款', desc: '領有聯結車、大客車、大貨車或小型車駕駛執照，駕駛輕型機車。但112年06月30日前已取得該汽車駕駛執照者，不在此限', note112: true },
        },
    },

    // ==================== 大客車駕照 ====================
    bus: {
        super: {
            trailer: { article: '21-1條1項4款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: V, truck: V, small_car: V,
            super_moto: V, heavy_moto: V, light_moto: V, mini_moto: V,
        },
        heavy: {
            trailer: { article: '21-1條1項4款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: V, truck: V, small_car: V,
            super_moto: { article: '22條2項', desc: '駕駛執照逾期' },
            heavy_moto: V, light_moto: V, mini_moto: V,
        },
        light: {
            trailer: { article: '21-1條1項4款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: V, truck: V, small_car: V,
            super_moto: { article: '22條2項', desc: '駕駛大型重型機車' },
            heavy_moto: { article: '22條1項6款', desc: '領有輕型機車駕駛執照，駕駛普通重型機車' },
            light_moto: V, mini_moto: V,
        },
        revoked: {
            trailer: { article: '21-1條1項4款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: V, truck: V, small_car: V,
            super_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
            heavy_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
            light_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
            mini_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
        },
        suspended: {
            trailer: { article: '21-1條1項4款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: V, truck: V, small_car: V,
            super_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
            heavy_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
            light_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
            mini_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
        },
        none: {
            trailer: { article: '21-1條1項4款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: V, truck: V, small_car: V,
            super_moto: { article: '22條2項', desc: '持汽車駕照駕駛大型重型機車' },
            heavy_moto: { article: '22條1項4款', desc: '持汽車駕照駕駛普通重型機車' },
            light_moto: { article: '22條1項5款', desc: '領有聯結車、大客車、大貨車或小型車駕駛執照，駕駛輕型機車。但112年06月30日前已取得該汽車駕駛執照者，不在此限', note112: true },
            mini_moto: { article: '22條1項5款', desc: '領有聯結車、大客車、大貨車或小型車駕駛執照，駕駛輕型機車。但112年06月30日前已取得該汽車駕駛執照者，不在此限', note112: true },
        },
    },

    // ==================== 大貨車駕照 ====================
    truck: {
        super: {
            trailer: { article: '21-1條1項4款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: { article: '21條1項4款', desc: '未領有大客車駕照駕駛大客車' },
            truck: V, small_car: V,
            super_moto: V, heavy_moto: V, light_moto: V, mini_moto: V,
        },
        heavy: {
            trailer: { article: '21-1條1項4款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: { article: '21條1項4款', desc: '未領有大客車駕照駕駛大客車' },
            truck: V, small_car: V,
            super_moto: { article: '22條2項', desc: '駕駛大型重型機車' },
            heavy_moto: V, light_moto: V, mini_moto: V,
        },
        light: {
            trailer: { article: '21-1條1項4款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: { article: '21條1項4款', desc: '未領有大客車駕照駕駛大客車' },
            truck: V, small_car: V,
            super_moto: { article: '22條2項', desc: '駕駛大型重型機車' },
            heavy_moto: { article: '22條1項6款', desc: '領有輕型機車駕駛執照，駕駛普通重型機車' },
            light_moto: V, mini_moto: V,
        },
        revoked: {
            trailer: { article: '21-1條1項4款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: { article: '21條1項4款', desc: '未領有大客車駕照駕駛大客車' },
            truck: V, small_car: V,
            super_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
            heavy_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
            light_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
            mini_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
        },
        suspended: {
            trailer: { article: '21-1條1項4款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: { article: '21條1項4款', desc: '未領有大客車駕照駕駛大客車' },
            truck: V, small_car: V,
            super_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
            heavy_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
            light_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
            mini_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
        },
        none: {
            trailer: { article: '21-1條1項4款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: { article: '21條1項4款', desc: '未領有大客車駕照駕駛大客車' },
            truck: V, small_car: V,
            super_moto: { article: '22條2項', desc: '持汽車駕照駕駛大型重型機車' },
            heavy_moto: { article: '22條1項4款', desc: '持汽車駕照駕駛普通重型機車' },
            light_moto: { article: '22條1項5款', desc: '領有聯結車、大客車、大貨車或小型車駕駛執照，駕駛輕型機車。但112年06月30日前已取得該汽車駕駛執照者，不在此限', note112: true },
            mini_moto: { article: '22條1項5款', desc: '領有聯結車、大客車、大貨車或小型車駕駛執照，駕駛輕型機車。但112年06月30日前已取得該汽車駕駛執照者，不在此限', note112: true },
        },
    },

    // ==================== 小型車駕照 ====================
    small: {
        super: {
            trailer: { article: '21-1條1項3款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: { article: '21-1條1項3款', desc: '未領有大客車駕照駕駛大客車' },
            truck: { article: '21-1條1項3款', desc: '未領有大貨車駕照駕駛大貨車' },
            small_car: V,
            super_moto: V, heavy_moto: V, light_moto: V, mini_moto: V,
        },
        heavy: {
            trailer: { article: '21-1條1項3款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: { article: '21-1條1項3款', desc: '未領有大客車駕照駕駛大客車' },
            truck: { article: '21-1條1項3款', desc: '未領有大貨車駕照駕駛大貨車' },
            small_car: V,
            super_moto: { article: '22條2項', desc: '駕駛大型重型機車' },
            heavy_moto: V, light_moto: V, mini_moto: V,
        },
        light: {
            trailer: { article: '21-1條1項3款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: { article: '21-1條1項3款', desc: '未領有大客車駕照駕駛大客車' },
            truck: { article: '21-1條1項3款', desc: '未領有大貨車駕照駕駛大貨車' },
            small_car: V,
            super_moto: { article: '22條2項', desc: '駕駛大型重型機車' },
            heavy_moto: { article: '22條1項6款', desc: '領有輕型機車駕駛執照，駕駛普通重型機車' },
            light_moto: V, mini_moto: V,
        },
        revoked: {
            trailer: { article: '21-1條1項3款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: { article: '21-1條1項3款', desc: '未領有大客車駕照駕駛大客車' },
            truck: { article: '21-1條1項3款', desc: '未領有大貨車駕照駕駛大貨車' },
            small_car: V,
            super_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
            heavy_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
            light_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
            mini_moto: { article: '21條1項3款', desc: '吊銷駕照期間駕駛機車' },
        },
        suspended: {
            trailer: { article: '21-1條1項3款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: { article: '21-1條1項3款', desc: '未領有大客車駕照駕駛大客車' },
            truck: { article: '21-1條1項3款', desc: '未領有大貨車駕照駕駛大貨車' },
            small_car: V,
            super_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
            heavy_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
            light_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
            mini_moto: { article: '21條1項5款', desc: '吊扣駕照期間駕駛機車' },
        },
        none: {
            trailer: { article: '21-1條1項3款', desc: '未領有聯結車駕照駕駛聯結車' },
            bus: { article: '21-1條1項3款', desc: '未領有大客車駕照駕駛大客車' },
            truck: { article: '21-1條1項3款', desc: '未領有大貨車駕照駕駛大貨車' },
            small_car: V,
            super_moto: { article: '22條2項', desc: '持汽車駕照駕駛大型重型機車' },
            heavy_moto: { article: '22條1項4款', desc: '持汽車駕照駕駛普通重型機車' },
            light_moto: { article: '22條1項5款', desc: '領有聯結車、大客車、大貨車或小型車駕駛執照，駕駛輕型機車。但112年06月30日前已取得該汽車駕駛執照者，不在此限', note112: true },
            mini_moto: { article: '22條1項5款', desc: '領有聯結車、大客車、大貨車或小型車駕駛執照，駕駛輕型機車。但112年06月30日前已取得該汽車駕駛執照者，不在此限', note112: true },
        },
    },

    // ==================== 汽車駕照吊(註)銷 ====================
    revoked: {
        super: {
            trailer: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛聯結車' },
            bus: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛大客車' },
            truck: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛大貨車' },
            small_car: { article: '21條1項5款', desc: '汽車駕照吊銷期間駕駛小型車' },
            super_moto: V, heavy_moto: V, light_moto: V, mini_moto: V,
        },
        heavy: {
            trailer: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛聯結車' },
            bus: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛大客車' },
            truck: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛大貨車' },
            small_car: { article: '21條1項5款', desc: '汽車駕照吊銷期間駕駛小型車' },
            super_moto: { article: '22條2項', desc: '駕駛大型重型機車' },
            heavy_moto: V, light_moto: V, mini_moto: V,
        },
        light: {
            trailer: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛聯結車' },
            bus: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛大客車' },
            truck: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛大貨車' },
            small_car: { article: '21條1項5款', desc: '汽車駕照吊銷期間駕駛小型車' },
            super_moto: { article: '22條2項', desc: '駕駛大型重型機車' },
            heavy_moto: { article: '22條1項6款', desc: '領有輕型機車駕駛執照，駕駛普通重型機車' },
            light_moto: V, mini_moto: V,
        },
        revoked: {  // 汽車+機車都吊銷
            trailer: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛聯結車' },
            bus: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛大客車' },
            truck: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛大貨車' },
            small_car: { article: '21條1項4款', desc: '駕駛執照業經吊銷、註銷仍駕駛小型車' },
            super_moto: { article: '21條1項4款', desc: '駕駛執照業經吊銷、註銷仍駕駛機車' },
            heavy_moto: { article: '21條1項4款', desc: '駕駛執照業經吊銷、註銷仍駕駛機車' },
            light_moto: { article: '21條1項4款', desc: '駕駛執照業經吊銷、註銷仍駕駛機車' },
            mini_moto: { article: '21條1項4款', desc: '駕駛執照業經吊銷、註銷仍駕駛機車' },
        },
        suspended: {  // 汽車吊銷+機車吊扣
            trailer: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛聯結車' },
            bus: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛大客車' },
            truck: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛大貨車' },
            small_car: { article: '21條1項5款', desc: '汽車駕照吊銷期間駕駛小型車' },
            super_moto: { article: '21條1項5款', desc: '機車駕照吊扣期間駕駛機車' },
            heavy_moto: { article: '21條1項5款', desc: '機車駕照吊扣期間駕駛機車' },
            light_moto: { article: '21條1項5款', desc: '機車駕照吊扣期間駕駛機車' },
            mini_moto: { article: '21條1項5款', desc: '機車駕照吊扣期間駕駛機車' },
        },
        none: {
            trailer: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛聯結車' },
            bus: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛大客車' },
            truck: { article: '21-1條1項5款', desc: '汽車駕照吊銷期間駕駛大貨車' },
            small_car: { article: '21條1項5款', desc: '汽車駕照吊銷期間駕駛小型車' },
            super_moto: { article: '21條1項1款', desc: '無照駕駛大型重型機車' },
            heavy_moto: { article: '21條1項1款', desc: '無照駕駛普通重型機車' },
            light_moto: { article: '21條1項1款', desc: '無照駕駛輕型機車' },
            mini_moto: { article: '21條1項1款', desc: '無照駕駛輕型機車' },
        },
    },

    // ==================== 汽車駕照吊扣 ====================
    suspended: {
        super: {
            trailer: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛聯結車' },
            bus: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛大客車' },
            truck: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛大貨車' },
            small_car: { article: '21條1項5款', desc: '汽車駕照吊扣期間駕駛小型車' },
            super_moto: V, heavy_moto: V, light_moto: V, mini_moto: V,
        },
        heavy: {
            trailer: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛聯結車' },
            bus: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛大客車' },
            truck: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛大貨車' },
            small_car: { article: '21條1項5款', desc: '汽車駕照吊扣期間駕駛小型車' },
            super_moto: { article: '22條2項', desc: '駕駛大型重型機車' },
            heavy_moto: V, light_moto: V, mini_moto: V,
        },
        light: {
            trailer: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛聯結車' },
            bus: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛大客車' },
            truck: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛大貨車' },
            small_car: { article: '21條1項5款', desc: '汽車駕照吊扣期間駕駛小型車' },
            super_moto: { article: '22條2項', desc: '駕駛大型重型機車' },
            heavy_moto: { article: '22條1項6款', desc: '領有輕型機車駕駛執照，駕駛普通重型機車' },
            light_moto: V, mini_moto: V,
        },
        revoked: {
            trailer: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛聯結車' },
            bus: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛大客車' },
            truck: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛大貨車' },
            small_car: { article: '21條1項5款', desc: '汽車駕照吊扣期間駕駛小型車' },
            super_moto: { article: '21條1項3款', desc: '機車駕照吊銷期間駕駛機車' },
            heavy_moto: { article: '21條1項3款', desc: '機車駕照吊銷期間駕駛機車' },
            light_moto: { article: '21條1項3款', desc: '機車駕照吊銷期間駕駛機車' },
            mini_moto: { article: '21條1項3款', desc: '機車駕照吊銷期間駕駛機車' },
        },
        suspended: {  // 汽車+機車都吊扣
            trailer: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛聯結車' },
            bus: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛大客車' },
            truck: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛大貨車' },
            small_car: { article: '21條1項5款', desc: '汽車駕照吊扣期間駕駛小型車' },
            super_moto: { article: '21條1項5款', desc: '機車駕照吊扣期間駕駛機車' },
            heavy_moto: { article: '21條1項5款', desc: '機車駕照吊扣期間駕駛機車' },
            light_moto: { article: '21條1項5款', desc: '機車駕照吊扣期間駕駛機車' },
            mini_moto: { article: '21條1項5款', desc: '機車駕照吊扣期間駕駛機車' },
        },
        none: {
            trailer: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛聯結車' },
            bus: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛大客車' },
            truck: { article: '21-1條1項7款', desc: '汽車駕照吊扣期間駕駛大貨車' },
            small_car: { article: '21條1項5款', desc: '汽車駕照吊扣期間駕駛小型車' },
            super_moto: { article: '21條1項1款', desc: '無照駕駛大型重型機車' },
            heavy_moto: { article: '21條1項1款', desc: '無照駕駛普通重型機車' },
            light_moto: { article: '21條1項1款', desc: '無照駕駛輕型機車' },
            mini_moto: { article: '21條1項1款', desc: '無照駕駛輕型機車' },
        },
    },

    // ==================== 無汽車駕照 ====================
    none: {
        super: {
            trailer: { article: '21-1條1項1款', desc: '無照駕駛聯結車' },
            bus: { article: '21-1條1項1款', desc: '無照駕駛大客車' },
            truck: { article: '21-1條1項1款', desc: '無照駕駛大貨車' },
            small_car: { article: '21條1項1款', desc: '無照駕駛小型車' },
            super_moto: V, heavy_moto: V, light_moto: V, mini_moto: V,
        },
        heavy: {
            trailer: { article: '21-1條1項1款', desc: '無照駕駛聯結車' },
            bus: { article: '21-1條1項1款', desc: '無照駕駛大客車' },
            truck: { article: '21-1條1項1款', desc: '無照駕駛大貨車' },
            small_car: { article: '21條1項1款', desc: '無照駕駛小型車' },
            super_moto: { article: '22條2項', desc: '駕駛大型重型機車' },
            heavy_moto: V, light_moto: V, mini_moto: V,
        },
        light: {
            trailer: { article: '21-1條1項1款', desc: '無照駕駛聯結車' },
            bus: { article: '21-1條1項1款', desc: '無照駕駛大客車' },
            truck: { article: '21-1條1項1款', desc: '無照駕駛大貨車' },
            small_car: { article: '21條1項1款', desc: '無照駕駛小型車' },
            super_moto: { article: '22條2項', desc: '駕駛大型重型機車' },
            heavy_moto: { article: '22條1項6款', desc: '領有輕型機車駕駛執照，駕駛普通重型機車' },
            light_moto: V, mini_moto: V,
        },
        revoked: {
            trailer: { article: '21-1條1項1款', desc: '無照駕駛聯結車' },
            bus: { article: '21-1條1項1款', desc: '無照駕駛大客車' },
            truck: { article: '21-1條1項1款', desc: '無照駕駛大貨車' },
            small_car: { article: '21條1項1款', desc: '無照駕駛小型車' },
            super_moto: { article: '21條1項4款', desc: '駕駛執照業經吊銷、註銷仍駕駛機車' },
            heavy_moto: { article: '21條1項4款', desc: '駕駛執照業經吊銷、註銷仍駕駛機車' },
            light_moto: { article: '21條1項4款', desc: '駕駛執照業經吊銷、註銷仍駕駛機車' },
            mini_moto: { article: '21條1項4款', desc: '駕駛執照業經吊銷、註銷仍駕駛機車' },
        },
        suspended: {
            trailer: { article: '21-1條1項1款', desc: '無照駕駛聯結車' },
            bus: { article: '21-1條1項1款', desc: '無照駕駛大客車' },
            truck: { article: '21-1條1項1款', desc: '無照駕駛大貨車' },
            small_car: { article: '21條1項1款', desc: '無照駕駛小型車' },
            super_moto: { article: '21條1項5款', desc: '機車駕照吊扣期間駕駛機車' },
            heavy_moto: { article: '21條1項5款', desc: '機車駕照吊扣期間駕駛機車' },
            light_moto: { article: '21條1項5款', desc: '機車駕照吊扣期間駕駛機車' },
            mini_moto: { article: '21條1項5款', desc: '機車駕照吊扣期間駕駛機車' },
        },
        none: {  // 完全無照
            trailer: { article: '21-1條1項1款', desc: '無照駕駛聯結車' },
            bus: { article: '21-1條1項1款', desc: '無照駕駛大客車' },
            truck: { article: '21-1條1項1款', desc: '無照駕駛大貨車' },
            small_car: { article: '21條1項1款', desc: '無照駕駛小型車' },
            super_moto: { article: '21條1項1款', desc: '無照駕駛大型重型機車' },
            heavy_moto: { article: '21條1項1款', desc: '無照駕駛普通重型機車' },
            light_moto: { article: '21條1項1款', desc: '無照駕駛輕型機車' },
            mini_moto: { article: '21條1項1款', desc: '無照駕駛輕型機車' },
        },
    },
};

/**
 * 查詢違規結果
 * @param {string} carLicense - 汽車駕照狀態
 * @param {string} motoLicense - 機車駕照狀態
 * @param {string} vehicle - 駕駛的車種
 * @returns {object} { legal: boolean, article?: string, desc?: string }
 */
function lookupViolation(carLicense, motoLicense, vehicle) {
    // 預設值處理
    const car = carLicense || 'none';
    const moto = motoLicense || 'none';

    // 查找矩陣
    if (VIOLATION_MATRIX[car] && VIOLATION_MATRIX[car][moto] && VIOLATION_MATRIX[car][moto][vehicle]) {
        return VIOLATION_MATRIX[car][moto][vehicle];
    }

    // 找不到匹配，回傳無照駕駛
    return { article: '21條1項1款', desc: '無照駕駛' };
}

/**
 * 判斷罰鍰類型
 */
function getFineType(article) {
    if (!article) return null;

    // 22條 - 較輕
    if (article.startsWith('22條')) {
        return 'light';  // 1,800 ~ 3,600 元
    }

    // 21-1條 - 大型車
    if (article.startsWith('21-1條')) {
        return 'large';  // 40,000 ~ 80,000 元
    }

    // 21條 - 標準
    return 'standard';  // 機車: 18,000~36,000, 小型車: 36,000~60,000
}

/**
 * 取得罰鍰金額
 */
function getFineAmount(article, vehicleType, recidivism) {
    const fineType = getFineType(article);

    if (fineType === 'light') {
        return { text: '1,800 ~ 3,600 元，並禁止其駕駛。' };
    }

    const isMoto = ['super_moto', 'heavy_moto', 'light_moto', 'mini_moto'].includes(vehicleType);
    const isLarge = ['trailer', 'bus', 'truck'].includes(vehicleType);

    let baseMin, baseMax, addPer;

    if (fineType === 'large' || isLarge) {
        baseMin = 40000;
        baseMax = 80000;
        addPer = 24000;
    } else if (isMoto) {
        baseMin = 18000;
        baseMax = 36000;
        addPer = 12000;
    } else {
        // 小型車
        baseMin = 36000;
        baseMax = 60000;
        addPer = 12000;
    }

    switch (recidivism) {
        case 'none':
            return { text: `${baseMin.toLocaleString()} ~ ${baseMax.toLocaleString()} 元` };
        case 'within10y':
            return { text: `${baseMax.toLocaleString()} 元 (10年內再犯)` };
        case 'dui_period':
            return { text: `${baseMax.toLocaleString()} 元 (酒駕吊扣銷期間)` };
        case 'both':
            return { text: `${baseMax.toLocaleString()} 元 + 每次加罰 ${addPer.toLocaleString()} 元 (無上限)` };
        default:
            return { text: `${baseMin.toLocaleString()} ~ ${baseMax.toLocaleString()} 元` };
    }
}

module.exports = {
    VEHICLES,
    CAR_LICENSE,
    MOTO_LICENSE,
    VIOLATION_MATRIX,
    lookupViolation,
    getFineType,
    getFineAmount,
};
