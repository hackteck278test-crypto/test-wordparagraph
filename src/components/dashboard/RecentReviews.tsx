// import { useTelegramNotifications } from "@/hooks/useTelegramNotifications";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { GitMerge, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface Review {
//   id: string;
//   title: string;
//   repository: string;
//   status: "passed" | "warnings" | "failed";
//   issues: number;
//   timestamp: string;  author?: string;
//   branch?: string;
//   commitHash?: string;
// }

// const mockReviews: Review[] = [
//   {
//     id: "1",
//     title: "feat: Add user authentication",
//     repository: "frontend-app",
//     status: "passed",
//     issues: 0,
//     timestamp: "2 min ago",
//   },
//   {
//     id: "2",
//     title: "fix: Resolve memory leak in worker",
//     repository: "backend-api",
//     status: "warnings",
//     issues: 3,
//     timestamp: "15 min ago",
//   },
//   {
//     id: "3",
//     title: "refactor: Clean up utils module",
//     repository: "shared-lib",
//     status: "failed",
//     issues: 8,
//     timestamp: "1 hour ago",
//   },
//   {
//     id: "4",
//     title: "chore: Update dependencies",
//     repository: "frontend-app",
//     status: "passed",
//     issues: 0,
//     timestamp: "2 hours ago",
//   },
// ];

// const statusConfig = {
//   passed: {
//     icon: CheckCircle2,
//     label: "Passed",
//     className: "bg-success/10 text-success border-success/20",
//   },
//   warnings: {
//     icon: AlertCircle,
//     label: "Warnings",
//     className: "bg-warning/10 text-warning border-warning/20",
//   },
//   failed: {
//     icon: XCircle,
//     label: "Failed",
//     className: "bg-destructive/10 text-destructive border-destructive/20",
//   },
// };

// export function RecentReviews() {
//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle className="flex items-center gap-2">
//           <GitMerge className="h-5 w-5 text-primary" />
//           Recent Reviews
//         </CardTitle>
//         <Badge variant="secondary" className="font-mono text-xs">
//           {mockReviews.length} total
//         </Badge>
//       </CardHeader>
//       <CardContent className="space-y-3">
//         {mockReviews.map((review) => {
//           const config = statusConfig[review.status];
//           const StatusIcon = config.icon;
          
//           return (
//             <div
//               key={review.id}
//               className="group flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4 transition-all duration-200 hover:bg-secondary/50 hover:border-primary/30"
//             >
//               <div className="flex items-center gap-4">
//                 <div className={cn(
//                   "flex h-10 w-10 items-center justify-center rounded-lg",
//                   review.status === "passed" && "bg-success/10",
//                   review.status === "warnings" && "bg-warning/10",
//                   review.status === "failed" && "bg-destructive/10"
//                 )}>
//                   <StatusIcon className={cn(
//                     "h-5 w-5",
//                     review.status === "passed" && "text-success",
//                     review.status === "warnings" && "text-warning",
//                     review.status === "failed" && "text-destructive"
//                   )} />
//                 </div>
//                 <div>
//                   <p className="font-medium text-foreground group-hover:text-primary transition-colors">
//                     {review.title}
//                   </p>
//                   <div className="flex items-center gap-2 mt-1">
//                     <span className="text-xs font-mono text-muted-foreground">
//                       {review.repository}
//                     </span>
//                     <span className="text-muted-foreground">•</span>
//                     <span className="flex items-center gap-1 text-xs text-muted-foreground">
//                       <Clock className="h-3 w-3" />
//                       {review.timestamp}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 {review.issues > 0 && (
//                   <span className="text-sm text-muted-foreground">
//                     {review.issues} issue{review.issues !== 1 ? "s" : ""}
//                   </span>
//                 )}
//                 <Badge className={config.className}>
//                   {config.label}
//                 </Badge>
//               </div>
//             </div>
//           );
//         })}
//       </CardContent>
//     </Card>
//   );
// }
import { useTelegramNotifications } from "@/hooks/useTelegramNotifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitMerge, Clock, CheckCircle2, AlertCircle, XCircle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  title: string;
  repository: string;
  status: "passed" | "warnings" | "failed";
  issues: number;
  timestamp: string;
  author?: string;
  branch?: string;
  commitHash?: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    title: "feat: Add user authentication",
    repository: "frontend-app",
    status: "passed",
    issues: 0,
    timestamp: "2 min ago",
    author: "john.doe",
    branch: "feature/auth",
    commitHash: "a1b2c3d4"
  },
  {
    id: "2",
    title: "fix: Resolve memory leak in worker",
    repository: "backend-api",
    status: "warnings",
    issues: 3,
    timestamp: "15 min ago",
    author: "jane.smith",
    branch: "fix/memory-leak",
    commitHash: "e5f6g7h8"
  },
  {
    id: "3",
    title: "refactor: Clean up utils module",
    repository: "shared-lib",
    status: "failed",
    issues: 8,
    timestamp: "1 hour ago",
    author: "alex.wong",
    branch: "refactor/utils",
    commitHash: "i9j0k1l2"
  },
  {
    id: "4",
    title: "chore: Update dependencies",
    repository: "frontend-app",
    status: "passed",
    issues: 0,
    timestamp: "2 hours ago",
    author: "sam.carter",
    branch: "chore/deps",
    commitHash: "m3n4o5p6"
  },
];

const statusConfig = {
  passed: {
    icon: CheckCircle2,
    label: "Passed",
    className: "bg-success/10 text-success border-success/20",
  },
  warnings: {
    icon: AlertCircle,
    label: "Warnings",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function RecentReviews() {
  const { notifyReview, isConfigured } = useTelegramNotifications();

  const handleSendNotification = async (review: Review) => {
    const notification = {
      title: review.title,
      repository: review.repository,
      status: review.status,
      issues: review.issues,
      timestamp: review.timestamp,
      author: review.author,
      branch: review.branch,
      commitHash: review.commitHash
    };
    
    const success = await notifyReview(notification);
    if (success) {
      alert('Telegram notification sent!');
    } else {
      alert('Failed to send notification. Please check Telegram configuration in Settings.');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <GitMerge className="h-5 w-5 text-primary" />
          <CardTitle>Recent Reviews</CardTitle>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="font-mono text-xs">
            {mockReviews.length} total
          </Badge>
          {!isConfigured() && (
            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
              <Bell className="h-3 w-3 mr-1" />
              Notifications off
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockReviews.map((review) => {
          const config = statusConfig[review.status];
          const StatusIcon = config.icon;
          
          return (
            <div
              key={review.id}
              className="group flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4 transition-all duration-200 hover:bg-secondary/50 hover:border-primary/30"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  review.status === "passed" && "bg-success/10",
                  review.status === "warnings" && "bg-warning/10",
                  review.status === "failed" && "bg-destructive/10"
                )}>
                  <StatusIcon className={cn(
                    "h-5 w-5",
                    review.status === "passed" && "text-success",
                    review.status === "warnings" && "text-warning",
                    review.status === "failed" && "text-destructive"
                  )} />
                </div>
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {review.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-muted-foreground">
                      {review.repository}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {review.timestamp}
                    </span>
                    {review.author && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          @{review.author}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {review.issues > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {review.issues} issue{review.issues !== 1 ? "s" : ""}
                  </span>
                )}
                <Badge className={config.className}>
                  {config.label}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSendNotification(review)}
                  disabled={!isConfigured()}
                  title={isConfigured() ? "Send Telegram notification" : "Configure Telegram first"}
                  className="h-8 w-8 p-0"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}