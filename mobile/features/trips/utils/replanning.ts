import { getApiErrorMessage } from '@/lib/api/client';

export function getReplanningErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, {
    fallback: '再計画の保存に失敗しました。通信状態を確認してください。',
    unauthorized: '認証が切れています。再ログイン後にもう一度お試しください。',
    forbidden: 'このプランに対する操作権限がありません。',
    notFound: '対象プランが見つかりませんでした。プラン詳細から再計画を開いてください。',
  });
}
