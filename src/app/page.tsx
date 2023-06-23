import database from "@/libs/database";
import PostFeed from "@/components/Post/PostFeed";
import SearchBar from "@/components/UI/SearchBar";
import getCurrentUser from "@/actions/getCurrentUser";
import HomepageLayout from "@/components/Layout/HomepageLayout";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import CreateCommunity from "@/components/Widgets/CreateCommunity";
import JoinedCommunities from "@/components/Widgets/JoinedCommunities";
import CommunityLeaderboard from "@/components/Widgets/CommunityLeaderboard";

const Home = async () => {
  const currentUser = await getCurrentUser();
  const posts = await database.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      forum: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });
  return (
    <HomepageLayout>
      {/* Left */}
      <div className="py-4 hidden md:flex md:flex-col md:gap-5">
        <SearchBar />
        <JoinedCommunities />
      </div>
      {/* Middle */}
      <div className="p-4 h-[91vh] w-full md:border-x-2 md:border-zinc-800 md:col-span-2 overflow-hidden overflow-y-scroll no-scrollbar">
        <PostFeed initialPosts={posts} userId={currentUser?.id} />;
      </div>
      {/* Right */}
      <div className="py-4 hidden md:flex md:flex-col md:gap-5">
        <CreateCommunity />
        <CommunityLeaderboard />
      </div>
    </HomepageLayout>
  );
};

export default Home;
