import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import getCurrentUser from "@/actions/getCurrentUser";
import getForum from "@/actions/getForum";

import database from "@/lib/database";
import ForumInfoWidget from "@/components/Widgets/ForumInfoWidget";

interface LayoutProps {
  children: ReactNode;
  params: {
    forumName: string;
  };
}

const Layout = async ({
  children,
  params: { forumName: forumName },
}: LayoutProps) => {
  const [currentUser, forum] = await Promise.all([
    getCurrentUser(),
    getForum(forumName),
  ]);

  if (!forum) return notFound();

  const subscription = currentUser
    ? await database.subscription.findFirst({
        where: { forumId: forum.id, userId: currentUser.id },
      })
    : undefined;

  const isSubscribed = !!subscription;

  // Get the count of forum members
  const memberCount = await database.subscription.count({
    where: { forum: { name: forumName } },
  });

  return (
    <div className="h-full pb-0 pt-3 font-medium">
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-4 md:gap-x-4">
        <div className="col-span-3 flex flex-col gap-2">
          <h1 className="py-4 text-4xl font-extrabold leading-6 text-zinc-800 dark:bg-gradient-to-br dark:from-zinc-200 dark:to-zinc-400 dark:bg-clip-text dark:text-transparent sm:text-2xl md:py-0 md:text-3xl lg:text-4xl">
            d/{forumName}
          </h1>
          <div className="flex flex-col gap-4">{children}</div>
        </div>
        <ForumInfoWidget
          forumId={forum.id}
          forumName={forum.name}
          forumCreationDate={forum.createdAt}
          memberCount={memberCount}
          isCreator={forum.creatorId === currentUser?.id}
          isSubscribed={isSubscribed}
        />
      </div>
    </div>
  );
};

export default Layout;
