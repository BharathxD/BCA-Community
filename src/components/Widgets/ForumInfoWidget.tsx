"use client";

import { Fragment } from "react";
import { format } from "date-fns";

import SubscribeLeaveToggle from "../Forum/SubscribeLeaveToggle";

interface ForumInfoWidgetProps {
  forumId: string;
  forumName: string;
  forumCreationDate: Date;
  memberCount: number;
  isCreator: boolean;
  isSubscribed: boolean;
  authorName?: string | null;
}

const ForumInfoWidget: React.FC<ForumInfoWidgetProps> = ({
  forumId,
  forumName,
  isCreator,
  memberCount,
  isSubscribed,
  forumCreationDate,
  authorName,
}) => {
  return (
    <div className="order-first mt-14 hidden h-fit overflow-hidden rounded-lg border-2 border-zinc-800 md:order-last md:block">
      <div className="bg-green-100 px-6 py-4 dark:bg-zinc-900">
        <p className="py-3 text-xl font-bold">About d/{forumName}</p>
      </div>
      <div className="h-[2px] w-full bg-zinc-800" />
      <dl className="bg-zinc-50 leading-6 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-x-4 px-6 py-4">
          <dt className="text-zinc-700 dark:text-zinc-100">Created</dt>
          <dd className="text-zinc-700 dark:text-zinc-50">
            <time dateTime={forumCreationDate.toDateString()}>
              {format(forumCreationDate, "MMMM d, yyyy")}
            </time>
          </dd>
        </div>

        {authorName && (
          <Fragment>
            <div className="h-[2px] w-full bg-zinc-800" />
            <div className="flex justify-between gap-x-4 px-6 py-4">
              <dt className="text-zinc-700 dark:text-zinc-100">Admin</dt>
              <dd className="text-zinc-700 dark:text-zinc-50">u/{authorName}</dd>
            </div>
          </Fragment>
        )}
        <div className="h-[2px] w-full bg-zinc-800" />

        <div className="flex justify-between gap-x-4 px-6 py-4">
          <dt className="text-zinc-700 dark:text-zinc-100">Members</dt>
          <dd className="text-zinc-700 dark:text-zinc-50">{memberCount}</dd>
        </div>

        {/* {forum.creatorId === currentUser?.id ? ( */}
        {isCreator ? (
          <Fragment>
            <div className="h-[2px] w-full bg-zinc-800" />
            <div className="flex justify-between gap-x-4 px-6 py-4">
              <p className="text-zinc-500">You created this community</p>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className="h-[2px] w-full bg-zinc-800" />
            <div className="flex h-full w-full justify-between gap-x-4">
              <SubscribeLeaveToggle
                isSubscribed={isSubscribed}
                forum={{ id: forumId, name: forumName }}
              />
            </div>
          </Fragment>
        )}
      </dl>
    </div>
  );
};
export default ForumInfoWidget;