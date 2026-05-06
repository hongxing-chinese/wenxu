/**
 * @file 六爻排盘算法
 * @description 基于京房八宫法，实现六爻卦象的完整排盘。
 * @流派 京房易
 * @核心思想
 * 1. 时间起卦：通过时间获取卦象的六个爻。
 * 2. 卦象转换：将主卦、变卦、互卦转换为二进制表示，并从数据中查找对应卦象。
 * 3. 安世应：根据主卦在其所属八宫中的位置（首卦、一世、二世...归魂）来确定世爻和应爻。
 * 4. 纳甲：为六个爻配上天干地支，此为定五行、六亲之本。
 * 5. 六亲：根据主卦宫位五行与各爻纳甲地支五行的生克关系，确定父母、官鬼、妻财、子孙、兄弟。
 * 6. 六神：根据起卦日的日干，安上青龙、朱雀、勾陈、螣蛇、白虎、玄武。
 * 7. 变卦分析：分析动爻变化后的爻，形成“父化财”等判断依据。
 */

import { hexagramsData } from '../../../utils/hexagram-data.ts';
import { getSixAnimals, getVoidBranches } from '../../../utils/lunar.ts';
import {
  wuxing,
  liuqinRelations,
  hexagramNaJia, // 使用新的完整纳甲数据
  palaces,
  hexagramPalaceMap,
  palaceHexagrams,
} from '../../../config/divination-data.ts';
import {
  generateYaosByTime,
  getDivinationTime,
} from '../../../utils/timeManager.ts';

/**
 * 寻宫：根据卦名查找其所属的八宫
 * @param hexagramName 卦名，如“乾为天”
 * @returns 返回该卦所属的宫位对象，包含五行属性
 */
function findPalace(hexagramName: string) {
    const palaceName = hexagramPalaceMap[hexagramName as keyof typeof hexagramPalaceMap];
    return palaces[palaceName as keyof typeof palaces];
}

/**
 * 纳甲与安六亲
 * @param mainHexagramName 主卦卦名
 * @param palace 主卦所属宫位
 * @returns 返回一个包含六个爻的地支、五行、六亲信息的数组
 */
function getNaJiaAndLiuQin(
  mainHexagramName: string,
  palace: { name: string; wuxing: string }
) {
    const yaosWithInfo: Array<{ dizhi: string; wuxing: string; liuqin: string }> = [];
    const najiaDizhiArray = hexagramNaJia[mainHexagramName];

    if (!najiaDizhiArray) {
        throw new Error(`找不到卦象 "${mainHexagramName}" 的纳甲信息。`);
    }

    for (let i = 0; i < 6; i++) {
        const dizhi = najiaDizhiArray[i];
        const yaoWuxing = Object.keys(wuxing).find(key => wuxing[key as keyof typeof wuxing].includes(dizhi)) || '';
        const liuqin = liuqinRelations[palace.wuxing as keyof typeof liuqinRelations][yaoWuxing as keyof typeof liuqinRelations[keyof typeof liuqinRelations]];
        yaosWithInfo.push({ dizhi, wuxing: yaoWuxing, liuqin });
    }
    return yaosWithInfo;
}

/**
 * 安世应
 * @param hexagramName 卦名
 * @param palaceName 宫位名
 * @returns 返回世爻和应爻所在的爻位（1-6）
 */
function getShiYing(hexagramName: string, palaceName: string): { shi: number; ying: number } {
    // 京房八宫卦序，决定了世爻的位置
    const palaceOrder = ['首卦', '一世', '二世', '三世', '四世', '五世', '游魂', '归魂'];
    const shiYaoMap = { '首卦': 6, '一世': 1, '二世': 2, '三世': 3, '四世': 4, '五世': 5, '游魂': 4, '归魂': 3 };

    const hexagramsInPalace = palaceHexagrams[palaceName as keyof typeof palaceHexagrams];
    if (!hexagramsInPalace) {
        throw new Error(`找不到宫位 "${palaceName}" 的卦象列表。`);
    }
    
    const generation = hexagramsInPalace.indexOf(hexagramName);
    if (generation === -1) {
        // 理论上不应该发生，因为 palaceName 是从 hexagramName 查出来的
        throw new Error(`卦象 "${hexagramName}" 不在宫位 "${palaceName}" 的列表中。`);
    }

    const shiYao = shiYaoMap[palaceOrder[generation] as keyof typeof shiYaoMap];
    // 应爻永远在世爻之上或之下三位
    const yingYao = shiYao + 3 > 6 ? shiYao - 3 : shiYao + 3;
    return { shi: shiYao, ying: yingYao };
}

/**
 * 生成一个代表世应位置的字符串数组
 * @param shiYing 世应位置对象
 * @returns 一个六元素的数组，在世应位置上标记“世”或“应”
 */
function getWorldAndResponseArray(shiYing: { shi: number; ying: number }): string[] {
    const result = ['', '', '', '', '', ''];
    result[shiYing.shi - 1] = '世';
    result[shiYing.ying - 1] = '应';
    return result;
}

function getSpecialPattern(changingCount: number, mainHexagramName: string): {
    specialPattern?: '静卦' | '独静卦' | '全动卦' | '乾卦用九' | '坤卦用六';
    specialAdvice?: string;
    isChaotic: boolean;
    chaoticReason?: string;
} {
    if (changingCount === 0) {
        return {
            specialPattern: '静卦',
            specialAdvice: '六爻安静，以本卦卦意和世应用神为主，不取变爻之象。',
            isChaotic: false,
        };
    }

    if (changingCount === 5) {
        return {
            specialPattern: '独静卦',
            specialAdvice: '五爻俱动，一爻独静。常见取法以独静爻为关键，同时兼看变卦所示趋势。',
            isChaotic: false,
        };
    }

    if (changingCount === 6) {
        if (mainHexagramName === '乾为天') {
            return {
                specialPattern: '乾卦用九',
                specialAdvice: '乾卦六爻皆动，宜以用九“见群龙无首，吉”为主，兼参之卦总势，不按常规逐爻细断。',
                isChaotic: false,
            };
        }

        if (mainHexagramName === '坤为地') {
            return {
                specialPattern: '坤卦用六',
                specialAdvice: '坤卦六爻皆动，宜以用六“利永贞”为主，兼参之卦总势，不按常规逐爻细断。',
                isChaotic: false,
            };
        }

        return {
            specialPattern: '全动卦',
            specialAdvice: '六爻全动，宜总观本卦与变卦气势，不宜按常规逐爻细碎分断。',
            isChaotic: true,
            chaoticReason: '六爻全动，属于乱动卦。传统上此类卦不宜按常规多爻细断，宜另取用神旺衰总观。',
        };
    }

    return {
        isChaotic: false,
    };
}

/**
 * 生成六爻卦盘
 * @param customDate 自定义时间，若不提供则使用当前时间
 * @returns 返回一个完整的六爻卦盘数据对象
 */
export function generateLiuyao(
  customDate?: Date
) {
    // 1. 获取占卜时间的干支信息
    const { ganzhi, timestamp } = getDivinationTime(customDate);
    const rawYaos = generateYaosByTime(timestamp, 6);

    const mainYaos = rawYaos.map((yao) => (yao === 7 || yao === 9 ? '阳' : '阴'));
    const changedYaos = rawYaos.map((yao, index) => {
        if (yao === 6) return '阳';
        if (yao === 9) return '阴';
        return mainYaos[index];
    });

    const mainBinary = mainYaos.map((y) => (y === '阳' ? '1' : '0')).reverse().join('');
    const changedBinary = changedYaos.map((y) => (y === '阳' ? '1' : '0')).reverse().join('');

    const getInterHexagram = (yaos: string[]) => {
        const interLower = yaos.slice(1, 4);
        const interUpper = yaos.slice(2, 5);
        return [...interLower, ...interUpper];
    };
    const interYaos = getInterHexagram(mainYaos);
    const interBinary = interYaos.map((y) => (y === '阳' ? '1' : '0')).reverse().join('');

    const mainHexagram = hexagramsData.find((h) => h.binarySymbol === mainBinary);
    const changedHexagram = hexagramsData.find((h) => h.binarySymbol === changedBinary);
    const interHexagram = hexagramsData.find((h) => h.binarySymbol === interBinary);

    if (!mainHexagram || !changedHexagram || !interHexagram) {
        throw new Error(`卦象查找失败: 主=${mainBinary}, 变=${changedBinary}, 互=${interBinary}`);
    }

    const dayGan = ganzhi.day.substring(0, 1);
    const animals = getSixAnimals(dayGan);
    const palace = findPalace(mainHexagram.name);
    const yaosInfo = getNaJiaAndLiuQin(mainHexagram.name, palace);
    const shiYing = getShiYing(mainHexagram.name, palace.name);
    const voids = getVoidBranches(ganzhi.day);

    //【核心修正：增加变卦分析】
    // 六爻占断，吉凶之机尽在“动变”二字。静爻观其本，动爻察其变。
    // 原算法只排主卦，不知其变，则吉凶难辨，故此为修正之核心。
    // 1. 获取变卦的纳甲六亲信息。
    // 2. 关键法理：变卦的宫位五行，永远跟从主卦的宫位五行来定六亲。
    //    例如，乾宫（金）的“天地否”变“风地观”，虽变卦“观”属巽宫（木），
    //    但在定六亲时，仍以主卦的乾金为“我”，来论其兄弟、子孙等。
    const changedYaosInfo = getNaJiaAndLiuQin(changedHexagram.name, palace);

    const changingYaosResult = rawYaos
        .map((yao, index) => ({
            position: index + 1,
            isChanging: yao === 6 || yao === 9,
            type: yao === 6 ? '老阴' : yao === 9 ? '老阳' : '静爻',
        }))
        .filter((yao) => yao.isChanging);

    const { specialPattern, specialAdvice, isChaotic, chaoticReason } = getSpecialPattern(
        changingYaosResult.length,
        mainHexagram.name
    );

    return {
        originalName: mainHexagram.name,
        changedName: changedHexagram.name,
        interName: interHexagram.name,
        yaoArray: rawYaos,
        changingYaos: changingYaosResult,
        sixGods: animals,
        sixRelatives: yaosInfo.map((info) => info.liuqin),
        najiaDizhi: yaosInfo.map((info) => info.dizhi),
        wuxing: yaosInfo.map((info) => info.wuxing),
        worldAndResponse: getWorldAndResponseArray(shiYing),
        voidBranches: voids,
        palace,
        ganzhi,
        specialPattern,
        specialAdvice,
        isChaotic,
        chaoticReason,
        yaosDetail: yaosInfo.map((info, index) => {
            const isChanging = rawYaos[index] === 6 || rawYaos[index] === 9;
            const changedInfo = isChanging ? changedYaosInfo[index] : null;
            return {
                position: index + 1,
                rawValue: rawYaos[index],
                yaoType: mainYaos[index] as '阳' | '阴',
                isChanging: isChanging,
                changeType: rawYaos[index] === 6 ? '老阴' : rawYaos[index] === 9 ? '老阳' : '静爻',
                sixGod: animals[index],
                sixRelative: info.liuqin,
                najiaDizhi: info.dizhi,
                wuxing: info.wuxing,
                isWorld: shiYing.shi === index + 1,
                isResponse: shiYing.ying === index + 1,
                isVoid: voids.includes(info.dizhi),
                changedYao: changedInfo ? {
                    dizhi: changedInfo.dizhi,
                    wuxing: changedInfo.wuxing,
                    liuqin: changedInfo.liuqin,
                    isVoid: voids.includes(changedInfo.dizhi),
                } : null,
            };
        }),
        timestamp,
    };
}
