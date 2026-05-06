/**
 * 占卜通用辅助函数
 * 提供各种占卜功能的通用工具方法
 */

import type { LiuyaoYaoDetail, LiuyaoData, MeihuaData } from '../types/divination';

/**
 * 六爻专用工具函数
 */
const LiuyaoHelpers = {
  getChangedYaoType(yaoType: '阳' | '阴'): '阳' | '阴' {
    return yaoType === '阳' ? '阴' : '阳';
  },

  getChangedYaoInfo(yaoDetail: LiuyaoYaoDetail): string {
    if (yaoDetail.isChanging && yaoDetail.changedYao) {
      const { liuqin, dizhi, wuxing } = yaoDetail.changedYao;
      return `${liuqin}${dizhi}${wuxing}`;
    }
    return `${yaoDetail.sixRelative}${yaoDetail.najiaDizhi}${yaoDetail.wuxing}`;
  },

  reverseYaosDetail(yaosDetail?: LiuyaoYaoDetail[]): LiuyaoYaoDetail[] {
    if (!yaosDetail) return [];
    return [...yaosDetail].reverse();
  },

  formatGanZhi(ganzhi?: LiuyaoData['ganzhi']): string {
    if (!ganzhi) return '';
    const { year, month, day, hour } = ganzhi;
    return `${year}年 ${month}月 ${day}日 ${hour}时`;
  },

  formatVoidBranches(voidBranches?: string[]): string {
    if (!voidBranches || voidBranches.length === 0) return '';
    return `[${voidBranches.join('、')}:空]`;
  },

  getChangeMarkSymbol(rawValue: number): string {
    if (rawValue === 6) return '×';
    if (rawValue === 9) return '●';
    return '';
  },

  isChangingYao(rawValue: number): boolean {
    return rawValue === 6 || rawValue === 9;
  },

  getWorldResponseMark(isWorld: boolean, isResponse: boolean): string {
    if (isWorld) return '世';
    if (isResponse) return '应';
    return '';
  },

  getVoidMark(isVoid: boolean): string {
    return isVoid ? '空' : '';
  },

  validateDivinationData(data: LiuyaoData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    if (!data.originalName) {
      errors.push('缺少主卦名称');
    }
    if (!data.yaosDetail || data.yaosDetail.length !== 6) {
      errors.push('爻象数据不完整');
    }
    if (!data.palace) {
      errors.push('缺少宫位信息');
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  generateDivinationSummary(data: LiuyaoData): string {
    const changingCount = data.yaosDetail?.filter((yao) => yao.isChanging).length || 0;
    const voidInfo = data.voidBranches?.length ? ` 空亡：${data.voidBranches.join('、')}` : '';
    return `${data.originalName} → ${data.changedName} (${changingCount}个动爻)${voidInfo}`;
  },

  /**
   * 生成专业排盘数据
   */
  generatePaipanData(data: LiuyaoData) {
    if (!data.yaosDetail) return [];

    return data.yaosDetail.map((yao, index) => ({
      ...yao,
      displayPosition: 6 - index,
      changeMarkSymbol: this.getChangeMarkSymbol(yao.rawValue),
      worldResponseMark: this.getWorldResponseMark(yao.isWorld, yao.isResponse),
      voidMark: this.getVoidMark(yao.isVoid),
      changedYaoType: this.getChangedYaoType(yao.yaoType),
      changedYaoInfo: this.getChangedYaoInfo(yao),
    }));
  },

  /**
   * 分析卦象特征
   */
  analyzeHexagram(data: LiuyaoData) {
    const changingYaos = data.yaosDetail?.filter((yao) => yao.isChanging) || [];
    const voidYaos = data.yaosDetail?.filter((yao) => yao.isVoid) || [];

    return {
      changingCount: changingYaos.length,
      voidCount: voidYaos.length,
      hasWorld: data.yaosDetail?.some((yao) => yao.isWorld) || false,
      hasResponse: data.yaosDetail?.some((yao) => yao.isResponse) || false,
      changingPositions: changingYaos.map((yao) => yao.position),
      voidPositions: voidYaos.map((yao) => yao.position),
      palace: data.palace?.name || '',
      palaceElement: data.palace?.wuxing || '',
    };
  },

  /**
   * 生成卦象解读要点
   */
  generateInterpretationPoints(data: LiuyaoData): string[] {
    const analysis = this.analyzeHexagram(data);
    const points: string[] = [];

    // 基本卦象信息
    points.push(`主卦：${data.originalName}（${analysis.palace}宫）`);
    points.push(`变卦：${data.changedName}`);

    if (data.interName) {
      points.push(`互卦：${data.interName}`);
    }

    // 动爻分析
    if (analysis.changingCount > 0) {
      points.push(
        `动爻：第${analysis.changingPositions.join('、')}爻（共${analysis.changingCount}个）`
      );
    } else {
      points.push('静卦：无动爻');
    }

    // 空亡分析
    if (analysis.voidCount > 0) {
      points.push(`空亡：第${analysis.voidPositions.join('、')}爻`);
    }

    // 世应分析
    if (analysis.hasWorld && analysis.hasResponse) {
      points.push('世应俱全，卦象完整');
    }

    return points;
  },
};

/**
 * 梅花易数专用工具函数
 */
export const MeihuaHelpers = {
  getExternalOmenSourceLabel(source: string): string {
    const sourceLabels: Record<string, string> = {
      direction: '方位',
      person: '人物',
      animal: '动物',
      object: '物件',
      sound: '声音',
      color: '颜色',
    };

    return sourceLabels[source] || '外应';
  },

  getSeasonByJieQi(jieQi: string): '春' | '夏' | '秋' | '冬' | '未知' {
    const seasonByJieQi: Record<string, '春' | '夏' | '秋' | '冬'> = {
      立春: '春',
      雨水: '春',
      惊蛰: '春',
      春分: '春',
      清明: '春',
      谷雨: '春',
      立夏: '夏',
      小满: '夏',
      芒种: '夏',
      夏至: '夏',
      小暑: '夏',
      大暑: '夏',
      立秋: '秋',
      处暑: '秋',
      白露: '秋',
      秋分: '秋',
      寒露: '秋',
      霜降: '秋',
      立冬: '冬',
      小雪: '冬',
      大雪: '冬',
      冬至: '冬',
      小寒: '冬',
      大寒: '冬',
    };

    return seasonByJieQi[jieQi] || '未知';
  },

  getSeasonByMonth(monthNumber: number): '春' | '夏' | '秋' | '冬' {
    if (monthNumber >= 1 && monthNumber <= 3) return '春';
    if (monthNumber >= 4 && monthNumber <= 6) return '夏';
    if (monthNumber >= 7 && monthNumber <= 9) return '秋';
    return '冬';
  },

  getElementSeasonState(element: string, season: '春' | '夏' | '秋' | '冬'): '旺' | '相' | '休' | '囚' | '死' | '未知' {
    const seasonStates: Record<'春' | '夏' | '秋' | '冬', Record<string, '旺' | '相' | '休' | '囚' | '死'>> = {
      春: { 木: '旺', 火: '相', 水: '休', 金: '囚', 土: '死' },
      夏: { 火: '旺', 土: '相', 木: '休', 水: '囚', 金: '死' },
      秋: { 金: '旺', 水: '相', 土: '休', 火: '囚', 木: '死' },
      冬: { 水: '旺', 木: '相', 金: '休', 土: '囚', 火: '死' },
    };

    return seasonStates[season]?.[element] || '未知';
  },

  /**
   * 分析梅花易数卦象特征
   */
  analyzeMeihuaHexagram(data: MeihuaData) {
    const movingYao = data.yaosDetail?.find((yao) => yao.isChanging);

    return {
      hasMovingYao: !!movingYao,
      movingYaoPosition: movingYao?.position || 0,
      upperTrigramElement: data.mainHexagram?.upper || '',
      lowerTrigramElement: data.mainHexagram?.lower || '',
      elementRelation: this.getElementRelation(
        data.yongGua?.element || '',
        data.tiGua?.element || ''
      ),
    };
  },

  /**
   * 生成梅花易数解读要点
   */
  generateMeihuaInterpretationPoints(data: MeihuaData): string[] {
    const points: string[] = [];

    // 基本卦象信息
    points.push(`主卦：${data.originalName}`);
    points.push(`变卦：${data.changedName}`);

    if (data.interName) {
      points.push(`互卦：${data.interName}`);
    }

    // 八卦分析
    if (data.mainHexagram?.upper && data.mainHexagram?.lower) {
      points.push(`上卦${data.mainHexagram.upper}，下卦${data.mainHexagram.lower}`);
      points.push(`体卦${data.tiGua.name}（${data.tiGua.element}），用卦${data.yongGua.name}（${data.yongGua.element}）`);
    }

    // 动爻分析
    if (data.movingYao) {
      points.push(`${data.movingYao.description}`);
    }

    // 五行关系
    const analysis = this.analyzeMeihuaHexagram(data);
    if (analysis.elementRelation) {
      points.push(`五行关系：${analysis.elementRelation}`);
    }

    return points;
  },

  /**
   * 获取五行相生相克关系
   */
  getElementRelation(yong: string, ti: string): string {
    const shengMap: Record<string, string> = {
      金: '水',
      水: '木',
      木: '火',
      火: '土',
      土: '金',
    };
    const keMap: Record<string, string> = {
      金: '木',
      木: '土',
      土: '水',
      水: '火',
      火: '金',
    };

    if (!yong || !ti) {
      return '未知';
    }
    if (yong === ti) {
      return '体用比和';
    }
    if (shengMap[yong] === ti) {
      return '用生体';
    }
    if (shengMap[ti] === yong) {
      return '体生用';
    }
    if (keMap[yong] === ti) {
      return '用克体';
    }
    if (keMap[ti] === yong) {
      return '体克用';
    }
    return '未知';
  },
};
