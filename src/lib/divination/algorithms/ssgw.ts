import type { SsgwData } from '../../../types';
import { SSGW_SIGNS } from '../../../utils/ssgw-data';
import { getDivinationTime } from '../../../utils/timeManager';

const ssgwSigns: Omit<SsgwData, 'ganzhi' | 'timestamp'>[] = SSGW_SIGNS.map((sign) => ({
  number: sign.id,
  title: sign.title,
  poem: sign.qianwen,
  story: sign.story,
  details: sign.details,
}));

/**
 * 验证签号是否有效
 */
function validateSignNumber(signNumber: number): void {
  if (!Number.isInteger(signNumber)) {
    throw new Error('签号必须是整数');
  }
  
  if (signNumber < 1 || signNumber > ssgwSigns.length) {
    throw new Error(`签号必须在 1 到 ${ssgwSigns.length} 之间`);
  }
}

/**
 * 随机求签 - 模拟真实的求签过程
 */
export function drawRandomSign(): SsgwData {
  const { ganzhi, timestamp } = getDivinationTime();
  const randomIndex = Math.floor(Math.random() * ssgwSigns.length);
  const sign = ssgwSigns[randomIndex];
  return {
    ...sign,
    timestamp,
    ganzhi,
  };
}

/**
 * 根据签号获取签文
 */
function getSignByNumber(signNumber: number): SsgwData {
  validateSignNumber(signNumber);
  const { ganzhi, timestamp } = getDivinationTime();
  
  const sign = ssgwSigns.find((s) => s.number === signNumber);
  
  if (!sign) {
    throw new Error(`签号 ${signNumber} 不存在`);
  }
  
  return {
    ...sign,
    timestamp,
    ganzhi,
  };
}

/**
 * 获取所有签文的列表（用于展示）
 */
function getAllSigns(): Omit<SsgwData, 'ganzhi' | 'timestamp'>[] {
  return [...ssgwSigns];
}

/**
 * 获取签文总数
 */
function getSignsCount(): number {
  return ssgwSigns.length;
}
