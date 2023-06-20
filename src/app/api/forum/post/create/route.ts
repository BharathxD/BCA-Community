import getCurrentUser from "@/actions/getCurrentUser";
import database from "@/libs/database";
import { PostValidator } from "@/libs/validators/post";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Handles the HTTP GET request for creating a new post.
 * @param req The Next.js request object.
 * @returns The Next.js response object.
 */
export async function POST(req: NextRequest) {
    try {
        // Retrieve the current user
        const currentUser = await getCurrentUser();

        // Check if the user is authenticated
        if (!currentUser) {
            return NextResponse.json(
                { message: "This action requires authentication" },
                { status: StatusCodes.UNAUTHORIZED }
            );
        }

        // Parse the request body
        const body = await req.json();
        const { title, content, forumId } = PostValidator.parse(body);

        // Check if the user is subscribed to the forum
        const subscription = await database.subscription.findFirst({
            where: {
                forumId,
                userId: currentUser.id,
            },
        });
        if (!subscription) {
            return NextResponse.json(
                { message: "You are not subscribed to this forum" },
                { status: StatusCodes.FORBIDDEN }
            );
        }

        // Create the new post
        const post = await database.post.create({
            data: {
                forumId,
                authorId: currentUser.id,
                title,
                content,
            },
        });

        return NextResponse.json(post, { status: StatusCodes.CREATED });
    } catch (error: any) {
        if (error instanceof ZodError) {
            // Handle validation errors
            return new Response(error.message, { status: StatusCodes.BAD_REQUEST });
        }
        // Handle other errors
        return NextResponse.json(
            { message: "Cannot create the post" },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}