import { ref } from 'vue'
import { toast } from 'vue-sonner'

export function useInteraction() {
  const isLoading = ref(false)
  const isProcessing = ref(false)

  function showSuccess(message: string) {
    toast.success(message)
  }

  function showError(message: string) {
    toast.error(message)
  }

  function showInfo(message: string) {
    toast.info(message)
  }

  function showWarning(message: string) {
    toast.warning(message)
  }

  function showLoading(message: string) {
    return toast.loading(message)
  }

  function dismissToast(id?: string | number) {
    toast.dismiss(id)
  }

  function handleAction(action: string, itemName?: string) {
    const name = itemName ? `「${itemName}」` : ''
    showSuccess(`${action}成功${name}`)
  }

  function handleDelete(itemName?: string) {
    const name = itemName ? `「${itemName}」` : ''
    showSuccess(`已删除${name}`)
  }

  function handleFollow(userName?: string) {
    const name = userName ? `@${userName}` : ''
    showSuccess(`已关注${name}`)
  }

  function handleUnfollow(userName?: string) {
    const name = userName ? `@${userName}` : ''
    showSuccess(`已取消关注${name}`)
  }

  function handleLike(itemName?: string) {
    const name = itemName ? `「${itemName}」` : ''
    showSuccess(`已点赞${name}`)
  }

  function handleBookmark(itemName?: string) {
    const name = itemName ? `「${itemName}」` : ''
    showSuccess(`已收藏${name}`)
  }

  function handleShare() {
    showSuccess('链接已复制到剪贴板')
  }

  function handleDownload(itemName?: string) {
    const name = itemName ? `「${itemName}」` : ''
    const id = showLoading(`正在下载${name}...`)
    setTimeout(() => {
      dismissToast(id)
      showSuccess(`下载完成${name}`)
    }, 1500)
  }

  function handleUpload() {
    showSuccess('上传成功')
  }

  function handleSubmit() {
    showSuccess('提交成功')
  }

  function handleSave() {
    showSuccess('保存成功')
  }

  function handleJoin() {
    showSuccess('报名成功')
  }

  function handleLeave() {
    showSuccess('已退出')
  }

  function handleCreate() {
    showSuccess('创建成功')
  }

  function handleUpdate() {
    showSuccess('更新成功')
  }

  function handleCopy() {
    showSuccess('已复制到剪贴板')
  }

  function handleLoadMore() {
    const id = showLoading('加载中...')
    setTimeout(() => {
      dismissToast(id)
      showSuccess('加载完成')
    }, 800)
  }

  async function withLoading<T>(fn: () => Promise<T>, loadingMessage = '处理中...'): Promise<T> {
    isLoading.value = true
    const id = showLoading(loadingMessage)
    try {
      const result = await fn()
      dismissToast(id)
      return result
    } catch (err) {
      dismissToast(id)
      showError('操作失败，请稍后重试')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    isProcessing,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismissToast,
    handleAction,
    handleDelete,
    handleFollow,
    handleUnfollow,
    handleLike,
    handleBookmark,
    handleShare,
    handleDownload,
    handleUpload,
    handleSubmit,
    handleSave,
    handleJoin,
    handleLeave,
    handleCreate,
    handleUpdate,
    handleCopy,
    handleLoadMore,
    withLoading
  }
}