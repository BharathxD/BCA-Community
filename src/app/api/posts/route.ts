import getCurrentUser from "@/actions/getCurrentUser";
import database from "@/lib/database";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, object, string } from "zod";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const currentUser = await getCurrentUser();
    let followedCommunitiesIds: string[] = [];
    if (currentUser) {
      const followedCommunities = await database.subscription.findMany({
        where: {
          userId: currentUser.id,
        },
      });
      followedCommunitiesIds = followedCommunities.map(
        ({ forumId }) => forumId
      );
    }
    const { forumName, limit, page } = object({
      limit: string(),
      page: string(),
      forumName: string().nullish().optional(),
    }).parse({
      forumName: url.searchParams.get("forumName"),
      limit: url.searchParams.get("limit"),
      page: url.searchParams.get("page"),
    });
    let whereClause = {};
    if (forumName) whereClause = { forum: { name: forumName } };
    const posts = await database.post.findMany({
      take: +limit,
      // Only giving back the posts that are not already shown
      skip: (+page - 1) * +limit,
      orderBy: { createdAt: "desc" },
      include: { forum: true, votes: true, author: true, comments: true },
      where: whereClause,
    });
    if (!posts || posts.length === 0)
      return NextResponse.json(
        { message: "No posts found with the given forum name" },
        { status: StatusCodes.NOT_FOUND }
      );
    return NextResponse.json(posts, { status: StatusCodes.OK });
  } catch (error: any) {
    // If there's a validation error, return a bad request response
    if (error instanceof ZodError)
      return NextResponse.json(
        { message: error.message },
        { status: StatusCodes.BAD_REQUEST }
      );
    // If an error occurs, return an internal server error response
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
