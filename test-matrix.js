/**
 * 測試腳本：驗證違規矩陣邏輯是否正確
 * 對照參考 APP 的預期結果
 */

const { lookupViolation } = require('./src/data/violation-matrix.js');

// 預期結果測試案例 (根據參考 APP)
const testCases = [
    // Case 1: 小型車駕照 + 無機車駕照 + 輕型機車 → 22條1項5款
    {
        car: 'small',
        moto: 'none',
        vehicle: 'light_moto',
        expected: '22條1項5款',
        desc: '小型車駕照+無機車駕照+輕型機車'
    },

    // Case 2: 汽車駕照吊/註銷 + 機車駕照吊/註銷 + 輕型機車 → 21條1項4款
    {
        car: 'revoked',
        moto: 'revoked',
        vehicle: 'light_moto',
        expected: '21條1項4款',
        desc: '汽車吊銷+機車吊銷+輕型機車'
    },

    // Case 3: 小型車駕照 + 輕型機車駕照 + 普通重型機車 → 22條1項6款
    {
        car: 'small',
        moto: 'light',
        vehicle: 'heavy_moto',
        expected: '22條1項6款',
        desc: '小型車駕照+輕型機車駕照+普通重型機車'
    },

    // Case 4: 無汽車駕照 + 無機車駕照 + 小型車 → 21條1項1款
    {
        car: 'none',
        moto: 'none',
        vehicle: 'small_car',
        expected: '21條1項1款',
        desc: '完全無照+小型車'
    },

    // Case 5: 無汽車駕照 + 無機車駕照 + 大貨車 → 21-1條1項1款
    {
        car: 'none',
        moto: 'none',
        vehicle: 'truck',
        expected: '21-1條1項1款',
        desc: '完全無照+大貨車'
    },

    // Case 6: 小型車駕照 + 普通重型機車駕照 + 輕型機車 → 合法
    {
        car: 'small',
        moto: 'heavy',
        vehicle: 'light_moto',
        expected: 'legal',
        desc: '小型車駕照+普重機駕照+輕型機車'
    },

    // Case 7: 小型車駕照 + 無機車駕照 + 大貨車 → 21-1條1項3款
    {
        car: 'small',
        moto: 'none',
        vehicle: 'truck',
        expected: '21-1條1項3款',
        desc: '小型車駕照+無機車駕照+大貨車'
    },

    // Case 8: 聯結車駕照 + 大型重型機車駕照 + 所有車種 → 全部合法
    {
        car: 'trailer',
        moto: 'super',
        vehicle: 'small_car',
        expected: 'legal',
        desc: '聯結車駕照+大重機駕照+小型車'
    },

    // Case 9: 汽車駕照吊扣 + 機車駕照吊扣 + 小型車 → 21條1項5款
    {
        car: 'suspended',
        moto: 'suspended',
        vehicle: 'small_car',
        expected: '21條1項5款',
        desc: '汽車吊扣+機車吊扣+小型車'
    },

    // Case 10: 無汽車駕照 + 機車駕照吊銷 + 輕型機車 → 21條1項4款
    {
        car: 'none',
        moto: 'revoked',
        vehicle: 'light_moto',
        expected: '21條1項4款',
        desc: '無汽車駕照+機車吊銷+輕型機車'
    },

    // Case 11: 小型車駕照 + 無機車駕照 + 普通重型機車 → 22條1項4款
    {
        car: 'small',
        moto: 'none',
        vehicle: 'heavy_moto',
        expected: '22條1項4款',
        desc: '小型車駕照+無機車駕照+普通重型機車'
    },

    // Case 12: 大貨車駕照 + 無機車駕照 + 輕型機車 → 22條1項5款
    {
        car: 'truck',
        moto: 'none',
        vehicle: 'light_moto',
        expected: '22條1項5款',
        desc: '大貨車駕照+無機車駕照+輕型機車'
    },
];

console.log('========== 違規矩陣邏輯測試 ==========\n');

let passed = 0;
let failed = 0;

testCases.forEach((tc, index) => {
    const result = lookupViolation(tc.car, tc.moto, tc.vehicle);
    const actual = result.legal ? 'legal' : result.article;
    const isPass = actual === tc.expected;

    if (isPass) {
        passed++;
        console.log(`✅ Case ${index + 1}: ${tc.desc}`);
        console.log(`   Expected: ${tc.expected}, Got: ${actual}`);
    } else {
        failed++;
        console.log(`❌ Case ${index + 1}: ${tc.desc}`);
        console.log(`   Expected: ${tc.expected}, Got: ${actual}`);
        if (result.desc) {
            console.log(`   Desc: ${result.desc}`);
        }
    }
    console.log('');
});

console.log('========== 測試結果 ==========');
console.log(`通過: ${passed}/${testCases.length}`);
console.log(`失敗: ${failed}/${testCases.length}`);

if (failed > 0) {
    console.log('\n⚠️ 有測試案例失敗，請檢查矩陣邏輯！');
    process.exit(1);
} else {
    console.log('\n🎉 所有測試案例通過！');
}
