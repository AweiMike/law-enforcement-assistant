/**
 * 駕照違規對照表 - 自動化測試套件
 * 
 * 用途：驗證所有法條邏輯正確性
 * 執行：node tests/violation-matrix.test.js
 * 
 * 114年11月6日修正版規格
 */

const { lookupViolation } = require('../src/data/violation-matrix');

let passed = 0;
let failed = 0;
const failures = [];

function test(desc, carLicense, motoLicense, vehicle, expectedArticle, expectedDescContains = null) {
    const result = lookupViolation(carLicense, motoLicense, vehicle);
    const actualArticle = result.legal ? 'V' : result.article;
    const actualDesc = result.desc || '';

    let articleOk = actualArticle === expectedArticle;
    let descOk = !expectedDescContains || actualDesc.includes(expectedDescContains);

    if (articleOk && descOk) {
        passed++;
        return true;
    } else {
        failed++;
        failures.push({
            desc,
            expected: expectedArticle,
            actual: actualArticle,
            expectedDescContains,
            actualDesc
        });
        return false;
    }
}

console.log('=== 駕照違規對照表測試套件 ===\n');
console.log('開始執行測試...\n');

// ========== 關鍵修正驗證 ==========
console.log('--- 關鍵修正驗證 ---');

// 1. 大客車駕照 駕駛 聯結車 -> 21條 (不是21-1條)
test('大客車+大重機 駕駛 聯結車', 'bus', 'super', 'trailer', '21條1項4款');
test('大客車+無機車 駕駛 聯結車', 'bus', 'none', 'trailer', '21條1項4款');

// 2. 大貨車駕照 駕駛 大客車 -> 21-1條 (不是21條)
test('大貨車+大重機 駕駛 大客車', 'truck', 'super', 'bus', '21-1條1項4款');
test('大貨車+無機車 駕駛 大客車', 'truck', 'none', 'bus', '21-1條1項4款');

// 3. 機車駕照吊銷 駕駛 機車 -> 21條1項4款 (不是3款)
test('小型車+機車吊銷 駕駛 大重機', 'small', 'revoked', 'super_moto', '21條1項4款');
test('小型車+機車吊銷 駕駛 普重機', 'small', 'revoked', 'heavy_moto', '21條1項4款');
test('小型車+機車吊銷 駕駛 輕機', 'small', 'revoked', 'light_moto', '21條1項4款');

// 4. 22條1項4款 描述完整度
test('汽車+無機車 駕駛 普重機 (完整描述)', 'small', 'none', 'heavy_moto', '22條1項4款', '領有聯結車');

// 5. 22條2項 描述完整度
test('汽車+無機車 駕駛 大重機 (完整描述)', 'small', 'none', 'super_moto', '22條2項', '領有聯結車');

// 6. 22條2項 for heavy moto license (越級)
test('聯結車+普重機 駕駛 大重機 (22條2項)', 'trailer', 'heavy', 'super_moto', '22條2項', '汽車駕駛人領有');

// ========== 聯結車駕照 ==========
console.log('--- 聯結車駕照 ---');
test('聯結車+大重機 駕駛 聯結車', 'trailer', 'super', 'trailer', 'V');
test('聯結車+大重機 駕駛 大客車', 'trailer', 'super', 'bus', 'V');
test('聯結車+大重機 駕駛 大貨車', 'trailer', 'super', 'truck', 'V');
test('聯結車+大重機 駕駛 小型車', 'trailer', 'super', 'small_car', 'V');
test('聯結車+大重機 駕駛 大重機', 'trailer', 'super', 'super_moto', 'V');
test('聯結車+大重機 駕駛 普重機', 'trailer', 'super', 'heavy_moto', 'V');
test('聯結車+大重機 駕駛 輕機', 'trailer', 'super', 'light_moto', 'V');

test('聯結車+普重機 駕駛 大重機', 'trailer', 'heavy', 'super_moto', '22條2項');
test('聯結車+普重機 駕駛 普重機', 'trailer', 'heavy', 'heavy_moto', 'V');

test('聯結車+輕機 駕駛 普重機', 'trailer', 'light', 'heavy_moto', '22條1項6款');

test('聯結車+機車吊銷 駕駛 大重機', 'trailer', 'revoked', 'super_moto', '21條1項4款');
test('聯結車+機車吊扣 駕駛 大重機', 'trailer', 'suspended', 'super_moto', '21條1項5款');

test('聯結車+無機車 駕駛 大重機', 'trailer', 'none', 'super_moto', '22條2項');
test('聯結車+無機車 駕駛 普重機', 'trailer', 'none', 'heavy_moto', '22條1項4款');
test('聯結車+無機車 駕駛 輕機', 'trailer', 'none', 'light_moto', '22條1項5款');

// ========== 大客車駕照 ==========
console.log('--- 大客車駕照 ---');
test('大客車+大重機 駕駛 大客車', 'bus', 'super', 'bus', 'V');
test('大客車+大重機 駕駛 大貨車', 'bus', 'super', 'truck', 'V');
test('大客車+大重機 駕駛 小型車', 'bus', 'super', 'small_car', 'V');

test('大客車+機車吊銷 駕駛 聯結車', 'bus', 'revoked', 'trailer', '21條1項4款');
test('大客車+機車吊銷 駕駛 大重機', 'bus', 'revoked', 'super_moto', '21條1項4款');

test('大客車+無機車 駕駛 大重機', 'bus', 'none', 'super_moto', '22條2項');
test('大客車+無機車 駕駛 普重機', 'bus', 'none', 'heavy_moto', '22條1項4款');

// ========== 大貨車駕照 ==========
console.log('--- 大貨車駕照 ---');
test('大貨車+大重機 駕駛 聯結車', 'truck', 'super', 'trailer', '21-1條1項4款');
test('大貨車+大重機 駕駛 大貨車', 'truck', 'super', 'truck', 'V');
test('大貨車+大重機 駕駛 小型車', 'truck', 'super', 'small_car', 'V');

test('大貨車+機車吊銷 駕駛 大客車', 'truck', 'revoked', 'bus', '21-1條1項4款');
test('大貨車+機車吊銷 駕駛 大重機', 'truck', 'revoked', 'super_moto', '21條1項4款');

test('大貨車+無機車 駕駛 聯結車', 'truck', 'none', 'trailer', '21-1條1項4款');
test('大貨車+無機車 駕駛 大重機', 'truck', 'none', 'super_moto', '22條2項');
test('大貨車+無機車 駕駛 普重機', 'truck', 'none', 'heavy_moto', '22條1項4款');

// ========== 小型車駕照 ==========
console.log('--- 小型車駕照 ---');
test('小型車+大重機 駕駛 聯結車', 'small', 'super', 'trailer', '21-1條1項3款');
test('小型車+大重機 駕駛 大客車', 'small', 'super', 'bus', '21-1條1項3款');
test('小型車+大重機 駕駛 大貨車', 'small', 'super', 'truck', '21-1條1項3款');
test('小型車+大重機 駕駛 小型車', 'small', 'super', 'small_car', 'V');
test('小型車+大重機 駕駛 大重機', 'small', 'super', 'super_moto', 'V');

test('小型車+普重機 駕駛 大重機', 'small', 'heavy', 'super_moto', '22條2項');
test('小型車+普重機 駕駛 普重機', 'small', 'heavy', 'heavy_moto', 'V');

test('小型車+輕機 駕駛 普重機', 'small', 'light', 'heavy_moto', '22條1項6款');
test('小型車+輕機 駕駛 輕機', 'small', 'light', 'light_moto', 'V');

test('小型車+機車吊扣 駕駛 大重機', 'small', 'suspended', 'super_moto', '21條1項5款');

test('小型車+無機車 駕駛 大重機', 'small', 'none', 'super_moto', '22條2項');
test('小型車+無機車 駕駛 輕機', 'small', 'none', 'light_moto', '22條1項5款');

// ========== 汽車駕照吊銷 ==========
console.log('--- 汽車駕照吊銷 ---');
test('汽車吊銷+大重機 駕駛 聯結車', 'revoked', 'super', 'trailer', '21-1條1項5款');
test('汽車吊銷+大重機 駕駛 大客車', 'revoked', 'super', 'bus', '21-1條1項5款');
test('汽車吊銷+大重機 駕駛 小型車', 'revoked', 'super', 'small_car', '21條1項5款');
test('汽車吊銷+大重機 駕駛 大重機', 'revoked', 'super', 'super_moto', 'V');

test('汽車吊銷+機車吊銷 駕駛 大重機', 'revoked', 'revoked', 'super_moto', '21條1項4款');
test('汽車吊銷+機車吊銷 駕駛 小型車', 'revoked', 'revoked', 'small_car', '21條1項4款');

// ========== 汽車駕照吊扣 ==========
console.log('--- 汽車駕照吊扣 ---');
test('汽車吊扣+大重機 駕駛 聯結車', 'suspended', 'super', 'trailer', '21-1條1項7款');
test('汽車吊扣+大重機 駕駛 小型車', 'suspended', 'super', 'small_car', '21條1項5款');
test('汽車吊扣+大重機 駕駛 大重機', 'suspended', 'super', 'super_moto', 'V');

test('汽車吊扣+機車吊扣 駕駛 大重機', 'suspended', 'suspended', 'super_moto', '21條1項5款');
test('汽車吊扣+機車吊扣 駕駛 小型車', 'suspended', 'suspended', 'small_car', '21條1項5款');

// ========== 無汽車駕照 ==========
console.log('--- 無汽車駕照 ---');
test('無汽車+大重機 駕駛 聯結車', 'none', 'super', 'trailer', '21-1條1項1款');
test('無汽車+大重機 駕駛 大客車', 'none', 'super', 'bus', '21-1條1項1款');
test('無汽車+大重機 駕駛 小型車', 'none', 'super', 'small_car', '21條1項1款');
test('無汽車+大重機 駕駛 大重機', 'none', 'super', 'super_moto', 'V');

test('無汽車+普重機 駕駛 大重機', 'none', 'heavy', 'super_moto', '22條2項');
test('無汽車+普重機 駕駛 普重機', 'none', 'heavy', 'heavy_moto', 'V');

test('無汽車+輕機 駕駛 普重機', 'none', 'light', 'heavy_moto', '22條1項6款');
test('無汽車+輕機 駕駛 輕機', 'none', 'light', 'light_moto', 'V');

test('無汽車+機車吊銷 駕駛 大重機', 'none', 'revoked', 'super_moto', '21條1項4款');
test('無汽車+機車吊銷 駕駛 小型車', 'none', 'revoked', 'small_car', '21條1項1款');

test('無汽車+機車吊扣 駕駛 大重機', 'none', 'suspended', 'super_moto', '21條1項5款');

// ========== 完全無照 ==========
console.log('--- 完全無照 ---');
test('完全無照 駕駛 聯結車', 'none', 'none', 'trailer', '21-1條1項1款');
test('完全無照 駕駛 大客車', 'none', 'none', 'bus', '21-1條1項1款');
test('完全無照 駕駛 大貨車', 'none', 'none', 'truck', '21-1條1項1款');
test('完全無照 駕駛 小型車', 'none', 'none', 'small_car', '21條1項1款');
test('完全無照 駕駛 大重機', 'none', 'none', 'super_moto', '21條1項1款');
test('完全無照 駕駛 普重機', 'none', 'none', 'heavy_moto', '21條1項1款');
test('完全無照 駕駛 輕機', 'none', 'none', 'light_moto', '21條1項1款');

// ========== 結果輸出 ==========
console.log('\n========================================');
console.log(`測試結果: ${passed} 通過, ${failed} 失敗`);
console.log('========================================\n');

if (failures.length > 0) {
    console.log('失敗項目:\n');
    failures.forEach(f => {
        console.log(`❌ ${f.desc}`);
        console.log(`   期望: ${f.expected}, 實際: ${f.actual}`);
        if (f.expectedDescContains) {
            console.log(`   期望描述包含: "${f.expectedDescContains}"`);
            console.log(`   實際描述: ${f.actualDesc}`);
        }
        console.log('');
    });
}

process.exit(failed > 0 ? 1 : 0);
