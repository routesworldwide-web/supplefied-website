import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import React from "react";
import { Close, Notification } from "@/svg";
import { useGetStockOutProductsQuery } from "@/redux/product/productApi";
import {
  useDismissNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/redux/notification/notificationApi";
import { AdminNotificationType } from "@/types/notification-type";

type IPropType = {
  nRef: React.RefObject<HTMLDivElement>;
  notificationOpen: boolean;
  handleNotificationOpen: () => void;
};

const typeStyles: Record<AdminNotificationType, string> = {
  order: "bg-info/10 text-info",
  review: "bg-warning/10 text-warning",
  staff: "bg-purple/10 text-purple",
  security: "bg-danger/10 text-danger",
  contact: "bg-success/10 text-success",
  subscriber: "bg-theme/10 text-theme",
};

const typeLabels: Record<AdminNotificationType, string> = {
  order: "Order",
  review: "Review",
  staff: "Staff",
  security: "Security",
  contact: "Contact",
  subscriber: "Subscriber",
};

const NotificationArea = ({
  nRef,
  notificationOpen,
  handleNotificationOpen,
}: IPropType) => {
  const { data: stockOutProduct } = useGetStockOutProductsQuery();
  const { data, isLoading } = useGetNotificationsQuery(undefined, {
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [markRead] = useMarkNotificationReadMutation();
  const [dismissNotification] = useDismissNotificationMutation();
  const [markAllRead, { isLoading: isMarkingAllRead }] =
    useMarkAllNotificationsReadMutation();

  const stockOutProducts = stockOutProduct?.data || [];
  const notifications = data?.data || [];
  const totalCount = (data?.unreadTotal || 0) + stockOutProducts.length;

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      markRead(id);
    }
  };

  return (
    <div ref={nRef}>
      <button
        type="button"
        onClick={handleNotificationOpen}
        aria-label="Open notifications"
        className="relative w-[40px] h-[40px] leading-[40px] rounded-md text-gray border border-gray hover:bg-themeLight hover:text-theme hover:border-themeLight"
      >
        <Notification />
        {totalCount > 0 && (
          <span className="min-w-[20px] h-[20px] px-1 inline-block bg-danger rounded-full absolute -top-[4px] -right-[4px] border-[2px] border-white text-xs leading-[16px] font-medium text-white">
            {totalCount > 99 ? "99+" : totalCount}
          </span>
        )}
      </button>

      {notificationOpen && (
        <div className="absolute z-50 w-[320px] sm:w-[390px] max-h-[520px] top-full mt-2 -right-[60px] sm:right-0 shadow-lg rounded-md bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray6 px-5 py-4">
            <div>
              <h4 className="mb-0 text-lg font-semibold text-heading">
                Notifications
              </h4>
              <p className="mb-0 text-tiny text-text3">
                {data?.unreadTotal || 0} unread
              </p>
            </div>
            {(data?.unreadTotal || 0) > 0 && (
              <button
                type="button"
                disabled={isMarkingAllRead}
                onClick={() => markAllRead()}
                className="text-tiny font-medium text-theme hover:text-themeDark disabled:opacity-50"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[445px] overflow-y-auto">
            {isLoading && (
              <p className="px-5 py-6 mb-0 text-center text-tiny text-text3">
                Loading notifications...
              </p>
            )}

            {!isLoading &&
              notifications.map((item) => {
                const details = (
                  <>
                    <div
                      className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${typeStyles[item.type]}`}
                    >
                      {typeLabels[item.type].slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <h5 className="mb-1 flex-1 text-base font-medium leading-5 text-heading">
                          {item.title}
                        </h5>
                        {!item.isRead && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-theme" />
                        )}
                      </div>
                      <p className="mb-2 break-words text-tiny leading-5 text-textBody">
                        {item.message}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`rounded-md px-2 py-1 text-[10px] font-medium leading-none ${typeStyles[item.type]}`}
                        >
                          {typeLabels[item.type]}
                        </span>
                        <span className="text-[10px] text-text3">
                          {dayjs(item.createdAt).format("MMM D, YYYY h:mm A")}
                        </span>
                      </div>
                    </div>
                  </>
                );

                return (
                  <div
                    key={item._id}
                    className={`flex items-start border-b border-gray6 transition-colors hover:bg-gray5 ${
                      item.isRead ? "bg-white" : "bg-themeLight/40"
                    }`}
                  >
                    {item.link ? (
                      <Link
                        href={item.link}
                        onClick={() =>
                          handleNotificationClick(item._id, item.isRead)
                        }
                        className="flex min-w-0 flex-1 gap-3 px-5 py-4"
                      >
                        {details}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleNotificationClick(item._id, item.isRead)
                        }
                        className="flex min-w-0 flex-1 gap-3 px-5 py-4 text-left"
                      >
                        {details}
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label="Dismiss notification"
                      onClick={() => dismissNotification(item._id)}
                      className="mr-4 mt-4 h-6 shrink-0 text-text3 hover:text-danger"
                    >
                      <Close />
                    </button>
                  </div>
                );
              })}

            {stockOutProducts.slice(0, 5).map((item) => (
              <Link
                key={`stock-${item._id}`}
                href="/product-list"
                className="flex items-center gap-3 border-b border-gray6 px-5 py-4 hover:bg-gray5"
              >
                <Image
                  className="h-10 w-10 shrink-0 rounded-md object-cover"
                  src={item.img}
                  alt={item.title}
                  width={40}
                  height={40}
                />
                <div className="min-w-0 flex-1">
                  <h5 className="mb-1 truncate text-base font-medium text-heading">
                    {item.title}
                  </h5>
                  <span className="rounded-md bg-danger/10 px-2 py-1 text-[10px] font-medium text-danger">
                    Out of stock
                  </span>
                </div>
              </Link>
            ))}

            {!isLoading &&
              notifications.length === 0 &&
              stockOutProducts.length === 0 && (
                <p className="px-5 py-8 mb-0 text-center text-tiny text-text3">
                  You are all caught up.
                </p>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationArea;
