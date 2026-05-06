/**
 * 本地大模型配置弹窗
 * 允许用户输入自定义 API Key、Base URL、Model
 */

import { useState } from 'react';
import {
  loadLocalLLMConfig,
  saveLocalLLMConfig,
  fetchAvailableModels,
  type LocalLLMConfig,
} from '@/lib/local-llm-config';

export function LocalLLMConfigModal(props: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const { onClose, onSaved } = props;
  const [config, setConfig] = useState<LocalLLMConfig>(loadLocalLLMConfig);
  const [saved, setSaved] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  async function handleFetchModels() {
    if (!config.baseUrl.trim()) {
      setFetchError('请先填写 Base URL');
      return;
    }
    setFetching(true);
    setFetchError('');
    try {
      const models = await fetchAvailableModels(config.baseUrl, config.apiKey);
      setAvailableModels(models);
      if (models.length > 0) {
        // 自动选中第一个模型，或当模型列表中有当前值时保持不变
        if (!config.model || !models.includes(config.model)) {
          setConfig((prev) => ({ ...prev, model: models[0] }));
        }
      } else {
        setFetchError('未获取到可用模型');
      }
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : '获取失败，请检查 URL 或网络');
    } finally {
      setFetching(false);
    }
  }

  function handleSave() {
    saveLocalLLMConfig(config);
    setSaved(true);
    onSaved();
    setTimeout(() => onClose(), 600);
  }

  function handleClear() {
    const empty: LocalLLMConfig = { apiKey: '', baseUrl: '', model: '' };
    setConfig(empty);
    saveLocalLLMConfig(empty);
    onSaved();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="panel-head">
          <h2>本地大模型配置</h2>
        </div>
        <p className="llm-config-tip">
          配置后将使用你自己的 API 直连大模型，提示词不会经过云端。兼容 OpenAI 格式的 API 均可使用（如 DeepSeek、Qwen、Kimi 等）。
        </p>
        <div className="llm-config-form">
          <label className="llm-config-label">
            <span>API Key</span>
            <input
              type="password"
              value={config.apiKey}
              placeholder="sk-..."
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            />
          </label>
          <label className="llm-config-label">
            <span>Base URL</span>
            <input
              type="text"
              value={config.baseUrl}
              placeholder="https://api.deepseek.com/v1"
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
            />
          </label>
          <label className="llm-config-label">
            <span>模型名称</span>
            <div className="llm-config-model-row">
              {availableModels.length > 0 ? (
                <select
                  value={config.model}
                  className="form-input"
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                >
                  {availableModels.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={config.model}
                  placeholder="deepseek-chat"
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                />
              )}
              <button
                type="button"
                className="modal-btn modal-btn-secondary llm-fetch-btn"
                disabled={fetching}
                onClick={handleFetchModels}
              >
                {fetching ? '获取中...' : '自动获取'}
              </button>
            </div>
            {fetchError ? <span className="llm-config-error">{fetchError}</span> : null}
          </label>
        </div>
        <div className="modal-actions modal-actions-split">
          <div className="modal-actions-left">
            <button type="button" className="modal-btn modal-btn-secondary" onClick={handleClear}>
              清除配置
            </button>
          </div>
          <div className="modal-actions-right">
            <button type="button" className="modal-btn modal-btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="button" className="modal-btn modal-btn-primary" onClick={handleSave}>
              {saved ? '已保存' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
