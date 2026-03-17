import { getApiErrorMessage, isApiError } from '@/lib/api/client';

export function isNotFoundApiError(error: unknown): boolean {
  return isApiError(error) && error.status === 404;
}

export function getFriendRequestCreateErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, {
    fallback: '通信エラーが発生しました。時間をおいて再度お試しください。',
    notFound: '指定したユーザーが見つかりません。',
  });
}

export function getFriendRequestUpdateErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, {
    fallback: '通信エラーが発生しました。時間をおいて再度お試しください。',
    unauthorized: 'セッションが切れました。再ログインしてください。',
    forbidden: 'この申請を更新する権限がありません。',
    notFound: '対象の申請が見つかりませんでした。',
  });
}

export function getSettingsSaveErrorMessage(error: unknown): string {
  if (isApiError(error) && error.status === 422) {
    return '入力内容が不正です。';
  }

  return getApiErrorMessage(error, {
    fallback: '設定の保存に失敗しました。時間をおいて再度お試しください。',
    defaultWithStatus: true,
  });
}

export function getUploadProfileImageErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, {
    fallback: 'アップロードに失敗しました。時間をおいて再度お試しください。',
    defaultWithStatus: true,
  });
}
