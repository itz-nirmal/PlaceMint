import React, { useState } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useUnreadCount } from '@/hooks/useDatabase';
import { useProfile } from '@/hooks/useDatabase';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const NotificationCenter: React.FC = () => {
  const { data: profile } = useProfile();
  const { data: notifications = [], isLoading } = useNotifications(profile?.id);
  const { data: unreadCount = 0 } = useUnreadCount(profile?.id);
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    if (profile?.id) {
      markAllAsReadMutation.mutate(profile.id);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    const baseClasses = isRead ? 'opacity-60' : '';
    
    switch (type) {
      case 'success':
        return cn('border-l-4 border-l-green-500', baseClasses);
      case 'error':
        return cn('border-l-4 border-l-red-500', baseClasses);
      case 'warning':
        return cn('border-l-4 border-l-yellow-500', baseClasses);
      default:
        return cn('border-l-4 border-l-blue-500', baseClasses);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                  disabled={markAllAsReadMutation.isPending}
                >
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
            <CardDescription>
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 hover:bg-muted/50 transition-colors',
                        getNotificationColor(notification.type || 'info', notification.is_read || false)
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-lg">
                          {getNotificationIcon(notification.type || 'info')}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={cn(
                              'text-sm font-medium',
                              notification.is_read ? 'text-muted-foreground' : 'text-foreground'
                            )}>
                              {notification.title}
                            </h4>
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="h-6 w-6 p-0 hover:bg-background"
                                disabled={markAsReadMutation.isPending}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          {notification.message && (
                            <p className={cn(
                              'text-xs',
                              notification.is_read ? 'text-muted-foreground' : 'text-muted-foreground'
                            )}>
                              {notification.message}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;