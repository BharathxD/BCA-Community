"use client";

import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { FC, useCallback, useEffect, useState } from "react";
import { Button } from "../UI/Button";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import cn from "@/libs/classNames";
import { useMutation } from "react-query";
import { PostVoteRequest } from "@/libs/validators/vote";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { error } from "console";
import { StatusCodes } from "http-status-codes";
import { toast } from "@/hooks/useToast";

interface PostVoteClientProps {
  postId: string;
  initialVote?: VoteType | null;
  initialVoteAmount: number;
}

const PostVoteClient: FC<PostVoteClientProps> = ({
  postId,
  initialVoteAmount,
  initialVote,
}) => {
  const router = useRouter();
  const [votesAmount, setVotesAmount] = useState<number>(initialVoteAmount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);
  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);
  const {
    mutate: vote,
    isLoading,
    error,
  } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType: type,
      };
      await axios.patch("/api/forum/post/vote", payload);
    },
    onError: async (error, voteType) => {
      if (voteType === "UP") setVotesAmount((prev) => prev - 1);
      else setVotesAmount((prev) => prev + 1);

      setCurrentVote(prevVote);

      if (error instanceof AxiosError) {
        if (error.response?.status === StatusCodes.UNAUTHORIZED)
          return router.push("/signin?unauthorized=1");
      }

      return toast({
        title: "Something went wrong",
        description: "Your vote was not registered, please try again",
        variant: "destructive",
      });
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined);
        if (type === "UP") setVotesAmount((prev) => prev - 1);
        else if (type === "DOWN") setVotesAmount((prev) => prev + 1);
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentVote(type);
        if (type === "UP")
          setVotesAmount((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          setVotesAmount((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });
  return (
    <div className="flex sm:flex-col gap-4 sm:gap-0 py-2 pr-5 sm:w-20 pb-2 sm:pb-0">
      <Button
        size="sm"
        aria-label="upvote"
        onClick={() => vote("UP")}
        className={cn(
          "hover:bg-green-200 dark:hover:bg-green-500 hover:text-zinc-800 dark:hover:text-zinc-50 text-zinc-800 dark:text-zinc-50",
          {
            "bg-green-200 dark:bg-green-500": currentVote === "UP",
          }
        )}
        disabled={isLoading && currentVote === "UP"}
      >
        <AiOutlineArrowUp className={"h-5 w-5"} />
      </Button>
      <p className="text-center py-2 font-medium text-sm text-zinc-900 dark:text-zinc-50">
        {votesAmount}
      </p>
      <Button
        size="sm"
        aria-label="downvote"
        onClick={() => vote("DOWN")}
        className={cn(
          "hover:bg-red-200 dark:hover:bg-red-500 hover:text-zinc-800 dark:hover:text-zinc-50 text-zinc-800 dark:text-zinc-50",
          {
            "bg-red-200 dark:bg-red-500": currentVote === "DOWN",
          }
        )}
        disabled={isLoading && currentVote === "DOWN"}
      >
        <AiOutlineArrowDown className={"h-5 w-5"} />
      </Button>
    </div>
  );
};

export default PostVoteClient;
