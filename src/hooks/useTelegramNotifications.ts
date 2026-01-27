// src/hooks/useTelegramNotifications.ts
// [file content begin]
import { telegramService } from '@/services/telegram-notification';
import { ReviewNotification } from '@/services/telegram-notification';

export function useTelegramNotifications() {
  const notifyReview = async (review: ReviewNotification) => {
    if (!telegramService.isConfigured()) {
      return false;
    }
    
    return await telegramService.sendReviewNotification(review);
  };

  const notifyReviews = async (reviews: ReviewNotification[]) => {
    if (!telegramService.isConfigured()) {
      return [];
    }
    
    return await telegramService.sendBatchReviewNotifications(reviews);
  };

  const isConfigured = () => {
    return telegramService.isConfigured();
  };

  return {
    notifyReview,
    notifyReviews,
    isConfigured
  };
}

export function useAutoReviewNotifications(reviews: ReviewNotification[]) {
  const { notifyReview, isConfigured } = useTelegramNotifications();

  // This would be called when reviews change
  // You'll need to implement logic to determine which reviews are new
}
// [file content end]