/**
 * 将文本复制到剪贴板
 * @param text 要复制的文本
 * @returns 一个 Promise，表示复制操作的结果
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    throw new Error('当前环境不支持剪贴板操作');
  }

  try {
    await navigator.clipboard.writeText(text);
    console.log('文本已成功复制到剪贴板');
  } catch (error) {
    console.error('复制到剪贴板失败:', error);
    throw error;
  }
}
